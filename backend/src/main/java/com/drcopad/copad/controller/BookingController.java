package com.drcopad.copad.controller;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.service.BookingService;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Appointments a person has made.
 *
 * Under /api/members/{memberId}, like the rest of the record, because an
 * appointment belongs to the person it is for rather than to whoever booked it.
 * A parent books for a child and both facts matter.
 */
@Slf4j
@RestController
@RequestMapping("/api/members/{memberId}/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookings;
    private final com.drcopad.copad.service.notification.LanguagePreference languagePreference;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingDTO {
        private Long id;
        private Long doctorId;
        private String doctorName;
        private String doctorSlug;
        private String clinicName;
        private String clinicAddress;
        private String clinicPhone;
        private LocalDateTime startsAt;
        private LocalDateTime endsAt;
        private BookingStatus status;
        private String reason;
        /** Whether the record was shared for this appointment specifically. */
        private boolean sharedRecord;
        private LocalDateTime cancelledAt;
        private String cancellationReason;

        static BookingDTO from(Booking b) {
            Doctor doctor = b.getDoctor();
            Clinic clinic = b.getClinic();
            return BookingDTO.builder()
                    .id(b.getId())
                    .doctorId(doctor == null ? null : doctor.getId())
                    .doctorName(doctor == null ? null : doctor.getFullName())
                    .doctorSlug(doctor == null ? null : doctor.getSlug())
                    .clinicName(clinic == null ? null : clinic.getName())
                    .clinicAddress(clinic == null ? null : clinic.getAddress())
                    .clinicPhone(clinic == null ? null : clinic.getPhone())
                    .startsAt(b.getStartsAt()).endsAt(b.getEndsAt())
                    .status(b.getStatus()).reason(b.getReason())
                    .sharedRecord(b.isSharedRecord())
                    .cancelledAt(b.getCancelledAt())
                    .cancellationReason(b.getCancellationReason())
                    .build();
        }
    }

    @Data
    public static class BookRequest {
        private Long doctorId;
        private Long clinicId;
        private LocalDateTime startsAt;
        private String reason;
        /**
         * Whether to share this person's record with the doctor.
         *
         * Asked each time rather than remembered. Showing one doctor an allergy
         * list is not agreeing to show every doctor everything.
         */
        private boolean shareRecord;
    }

    @Data
    public static class CancelRequest {
        private String reason;
    }

    @GetMapping
    public List<BookingDTO> list(@PathVariable Long memberId,
                                 @AuthenticationPrincipal User user) {
        return bookings.forMember(memberId, user.getId()).stream()
                .map(BookingDTO::from).toList();
    }

    /**
     * Books an appointment.
     *
     * 409 when the slot went to somebody else between choosing and confirming,
     * which is a normal outcome rather than an error: the interface should
     * offer the next time rather than an apology.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingDTO book(@PathVariable Long memberId,
                           @RequestBody BookRequest request,
                           @AuthenticationPrincipal User user,
                           jakarta.servlet.http.HttpServletRequest http) {
        // Noted here because this is the first point at which we owe them a
        // message, and we would rather send it in the language they are reading.
        languagePreference.noteFrom(http, user.getId());
        return BookingDTO.from(bookings.book(
                request.getDoctorId(), memberId, user.getId(), request.getClinicId(),
                request.getStartsAt(), request.getReason(), request.isShareRecord()));
    }

    @PostMapping("/{bookingId}/cancel")
    public BookingDTO cancel(@PathVariable Long memberId,
                             @PathVariable Long bookingId,
                             @RequestBody(required = false) CancelRequest request,
                             @AuthenticationPrincipal User user) {
        return BookingDTO.from(bookings.cancel(bookingId, user.getId(),
                request == null ? null : request.getReason()));
    }
}
