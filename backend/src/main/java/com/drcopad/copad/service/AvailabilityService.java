package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;

/**
 * The times a doctor can actually be seen.
 *
 * The weekly pattern says when they work. Time off removes days they are away.
 * Existing bookings remove slots already taken. What survives is offered.
 *
 * The rule that shapes everything here: never offer a slot that cannot be
 * booked. A person who picks a time and is told it has gone learns not to trust
 * the product, and one who books a slot nobody is watching learns something
 * worse. So a doctor who is not accepting bookings has no availability at all,
 * rather than a calendar that leads nowhere.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AvailabilityService {

    /** Far enough ahead to plan, near enough that a clinic's rota still holds. */
    private static final int MAX_DAYS_AHEAD = 60;

    /**
     * Booking further ahead than this is fine; booking in the next few minutes
     * is not, because nobody at the clinic will have seen it.
     */
    private static final int MIN_NOTICE_MINUTES = 60;

    private final DoctorRepository doctors;
    private final DoctorAvailabilityRepository availability;
    private final DoctorTimeOffRepository timeOff;
    private final BookingRepository bookings;

    public record Slot(LocalDateTime startsAt, LocalDateTime endsAt, Long clinicId) {
    }

    /**
     * Free slots for a doctor between two dates.
     *
     * Empty rather than an error when the doctor takes no bookings: there is
     * nothing wrong, there is simply nothing to offer.
     */
    @Transactional(readOnly = true)
    public List<Slot> slotsFor(Long doctorId, LocalDate from, LocalDate to) {
        Doctor doctor = doctors.findByIdAndDeletedAtIsNull(doctorId).orElse(null);
        if (doctor == null || !doctor.isBookable()) return List.of();

        LocalDate start = from == null ? LocalDate.now() : from;
        LocalDate end = to == null ? start.plusDays(14) : to;

        // Bounded, or a caller can ask for a decade and get a very long answer.
        if (end.isAfter(start.plusDays(MAX_DAYS_AHEAD))) {
            end = start.plusDays(MAX_DAYS_AHEAD);
        }
        if (end.isBefore(start)) return List.of();

        LocalDateTime windowStart = start.atStartOfDay();
        LocalDateTime windowEnd = end.plusDays(1).atStartOfDay();
        LocalDateTime earliest = LocalDateTime.now().plusMinutes(MIN_NOTICE_MINUTES);

        List<DoctorAvailability> pattern = availability.findByDoctorIdAndActiveTrue(doctorId);
        if (pattern.isEmpty()) return List.of();

        List<DoctorTimeOff> absences = timeOff
                .findByDoctorIdAndEndsAtAfterAndStartsAtBefore(doctorId, windowStart, windowEnd);

        // Taken slots, by their start. Cancelled bookings are not here, which is
        // what makes a cancellation genuinely free the time.
        Set<LocalDateTime> taken = new HashSet<>();
        for (Booking booking : bookings.findByDoctorIdAndStatusInAndStartsAtBetween(
                doctorId, List.of(BookingStatus.REQUESTED, BookingStatus.CONFIRMED),
                windowStart, windowEnd)) {
            taken.add(booking.getStartsAt());
        }

        List<Slot> slots = new ArrayList<>();
        for (LocalDate day = start; !day.isAfter(end); day = day.plusDays(1)) {
            for (DoctorAvailability block : pattern) {
                if (block.getDayOfWeek() != day.getDayOfWeek().getValue()) continue;
                addSlots(slots, day, block, absences, taken, earliest);
            }
        }

        slots.sort(Comparator.comparing(Slot::startsAt));
        return slots;
    }

    private void addSlots(List<Slot> slots, LocalDate day, DoctorAvailability block,
                          List<DoctorTimeOff> absences, Set<LocalDateTime> taken,
                          LocalDateTime earliest) {

        int minutes = Math.max(block.getSlotMinutes(), 5);
        LocalDateTime cursor = day.atTime(block.getStartTime());
        LocalDateTime blockEnd = day.atTime(block.getEndTime());

        // An overnight block would loop forever; treat it as a data error and
        // skip rather than hang.
        if (!blockEnd.isAfter(cursor)) return;

        while (!cursor.plusMinutes(minutes).isAfter(blockEnd)) {
            final LocalDateTime slotStart = cursor;
            final LocalDateTime slotEnd = cursor.plusMinutes(minutes);

            boolean offerable = slotStart.isAfter(earliest)
                    && !taken.contains(slotStart)
                    && absences.stream().noneMatch(a ->
                            slotStart.isBefore(a.getEndsAt()) && slotEnd.isAfter(a.getStartsAt()));

            if (offerable) {
                slots.add(new Slot(slotStart, slotEnd,
                        block.getClinic() == null ? null : block.getClinic().getId()));
            }
            cursor = slotEnd;
        }
    }

    /**
     * Whether a specific time is one this doctor actually offers.
     *
     * Booking checks this rather than trusting the time it was sent, because a
     * client can send anything and a slot that was never offered must not become
     * an appointment.
     */
    @Transactional(readOnly = true)
    public boolean isOffered(Long doctorId, LocalDateTime startsAt) {
        if (startsAt == null) return false;
        LocalDate day = startsAt.toLocalDate();
        return slotsFor(doctorId, day, day).stream()
                .anyMatch(s -> s.startsAt().equals(startsAt));
    }
}
