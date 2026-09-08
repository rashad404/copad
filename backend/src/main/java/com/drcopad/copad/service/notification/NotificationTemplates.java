package com.drcopad.copad.service.notification;

import com.drcopad.copad.entity.Notification.Kind;

import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * What each message says, in the language it is being read in.
 *
 * Deliberately thin on detail. An appointment email says who, where and when,
 * and nothing about why: the reason somebody gave is their account of their own
 * symptoms, and email is not a private channel. Anyone who needs the rest can
 * open the appointment behind a login.
 *
 * Nothing here tells the reader to go and ask their doctor - they have just
 * arranged to see one.
 */
public final class NotificationTemplates {

    private NotificationTemplates() {
    }

    /** Plain text, because a booking confirmation is not a newsletter. */
    public record Message(String subject, String body) {
    }

    private static final DateTimeFormatter DAY =
            DateTimeFormatter.ofPattern("dd.MM.yyyy");
    private static final DateTimeFormatter TIME =
            DateTimeFormatter.ofPattern("HH:mm");

    private static final Map<String, String[]> AZ_MONTHS = Map.of();

    public static Message render(Kind kind, String language, Context c) {
        String lang = switch (language == null ? "az" : language) {
            case "en", "ru" -> language;
            default -> "az";
        };
        String when = c.startsAt().format(DAY) + ", " + c.startsAt().format(TIME);

        return switch (lang) {
            case "en" -> english(kind, c, when);
            case "ru" -> russian(kind, c, when);
            default -> azerbaijani(kind, c, when);
        };
    }

    /** Everything a message may mention. Note the absence of a reason field. */
    public record Context(String recipientName,
                          String doctorName,
                          String patientName,
                          String clinicName,
                          String clinicAddress,
                          LocalDateTime startsAt,
                          String appointmentsUrl) {
    }

    private static String place(Context c) {
        if (c.clinicName() == null || c.clinicName().isBlank()) return "";
        return c.clinicAddress() == null || c.clinicAddress().isBlank()
                ? c.clinicName()
                : c.clinicName() + ", " + c.clinicAddress();
    }

    private static Message azerbaijani(Kind kind, Context c, String when) {
        String where = place(c);
        return switch (kind) {
            case BOOKING_REQUESTED_PATIENT -> new Message(
                    "Randevu sorğunuz göndərildi",
                    "Salam, " + c.recipientName() + ".\n\n"
                            + c.doctorName() + " üçün randevu sorğunuz göndərildi.\n"
                            + "Tarix: " + when + "\n"
                            + (where.isEmpty() ? "" : "Yer: " + where + "\n")
                            + "\nHəkim təsdiqlədikdə sizə yenidən yazacağıq.\n"
                            + "Randevularınız: " + c.appointmentsUrl() + "\n");
            case BOOKING_REQUESTED_DOCTOR -> new Message(
                    "Yeni randevu sorğusu",
                    "Salam, " + c.recipientName() + ".\n\n"
                            + c.patientName() + " sizin üçün randevu sorğusu göndərdi.\n"
                            + "Tarix: " + when + "\n"
                            + "\nTəsdiqləmək və ya imtina etmək üçün panelə keçin:\n"
                            + c.appointmentsUrl() + "\n");
            case BOOKING_CONFIRMED_PATIENT -> new Message(
                    "Randevunuz təsdiqləndi",
                    "Salam, " + c.recipientName() + ".\n\n"
                            + c.doctorName() + " randevunuzu təsdiqlədi.\n"
                            + "Tarix: " + when + "\n"
                            + (where.isEmpty() ? "" : "Yer: " + where + "\n")
                            + "\nRandevularınız: " + c.appointmentsUrl() + "\n");
            case BOOKING_DECLINED_PATIENT -> new Message(
                    "Randevunuz baş tutmadı",
                    "Salam, " + c.recipientName() + ".\n\n"
                            + c.doctorName() + " üçün " + when
                            + " tarixli randevunuz təsdiqlənmədi.\n"
                            + "\nBaşqa vaxt seçə bilərsiniz: " + c.appointmentsUrl() + "\n");
            case BOOKING_CANCELLED_DOCTOR -> new Message(
                    "Randevu ləğv edildi",
                    "Salam, " + c.recipientName() + ".\n\n"
                            + c.patientName() + " " + when
                            + " tarixli randevunu ləğv etdi.\n"
                            + "\nPanel: " + c.appointmentsUrl() + "\n");
            case BOOKING_REMINDER_PATIENT -> new Message(
                    "Sabahkı randevunuz",
                    "Salam, " + c.recipientName() + ".\n\n"
                            + c.doctorName() + " ilə randevunuz sabahdır.\n"
                            + "Tarix: " + when + "\n"
                            + (where.isEmpty() ? "" : "Yer: " + where + "\n")
                            + "\nGələ bilməyəcəksinizsə, randevunu ləğv edin:\n"
                            + c.appointmentsUrl() + "\n");
        };
    }

    private static Message english(Kind kind, Context c, String when) {
        String where = place(c);
        return switch (kind) {
            case BOOKING_REQUESTED_PATIENT -> new Message(
                    "Your appointment request was sent",
                    "Hello " + c.recipientName() + ",\n\n"
                            + "Your appointment request with " + c.doctorName() + " was sent.\n"
                            + "When: " + when + "\n"
                            + (where.isEmpty() ? "" : "Where: " + where + "\n")
                            + "\nWe will write again once the doctor answers.\n"
                            + "Your appointments: " + c.appointmentsUrl() + "\n");
            case BOOKING_REQUESTED_DOCTOR -> new Message(
                    "New appointment request",
                    "Hello " + c.recipientName() + ",\n\n"
                            + c.patientName() + " has requested an appointment with you.\n"
                            + "When: " + when + "\n"
                            + "\nConfirm or decline it here:\n" + c.appointmentsUrl() + "\n");
            case BOOKING_CONFIRMED_PATIENT -> new Message(
                    "Your appointment is confirmed",
                    "Hello " + c.recipientName() + ",\n\n"
                            + c.doctorName() + " has confirmed your appointment.\n"
                            + "When: " + when + "\n"
                            + (where.isEmpty() ? "" : "Where: " + where + "\n")
                            + "\nYour appointments: " + c.appointmentsUrl() + "\n");
            case BOOKING_DECLINED_PATIENT -> new Message(
                    "Your appointment did not go ahead",
                    "Hello " + c.recipientName() + ",\n\n"
                            + "Your appointment with " + c.doctorName() + " on " + when
                            + " was not confirmed.\n"
                            + "\nYou can choose another time: " + c.appointmentsUrl() + "\n");
            case BOOKING_CANCELLED_DOCTOR -> new Message(
                    "An appointment was cancelled",
                    "Hello " + c.recipientName() + ",\n\n"
                            + c.patientName() + " cancelled the appointment on " + when + ".\n"
                            + "\nPanel: " + c.appointmentsUrl() + "\n");
            case BOOKING_REMINDER_PATIENT -> new Message(
                    "Your appointment tomorrow",
                    "Hello " + c.recipientName() + ",\n\n"
                            + "You have an appointment with " + c.doctorName() + " tomorrow.\n"
                            + "When: " + when + "\n"
                            + (where.isEmpty() ? "" : "Where: " + where + "\n")
                            + "\nIf you cannot come, please cancel it:\n"
                            + c.appointmentsUrl() + "\n");
        };
    }

    private static Message russian(Kind kind, Context c, String when) {
        String where = place(c);
        return switch (kind) {
            case BOOKING_REQUESTED_PATIENT -> new Message(
                    "Запрос на приём отправлен",
                    "Здравствуйте, " + c.recipientName() + ".\n\n"
                            + "Запрос на приём к " + c.doctorName() + " отправлен.\n"
                            + "Когда: " + when + "\n"
                            + (where.isEmpty() ? "" : "Где: " + where + "\n")
                            + "\nМы напишем снова, когда врач ответит.\n"
                            + "Ваши записи: " + c.appointmentsUrl() + "\n");
            case BOOKING_REQUESTED_DOCTOR -> new Message(
                    "Новый запрос на приём",
                    "Здравствуйте, " + c.recipientName() + ".\n\n"
                            + c.patientName() + " запросил приём у вас.\n"
                            + "Когда: " + when + "\n"
                            + "\nПодтвердить или отклонить:\n" + c.appointmentsUrl() + "\n");
            case BOOKING_CONFIRMED_PATIENT -> new Message(
                    "Ваша запись подтверждена",
                    "Здравствуйте, " + c.recipientName() + ".\n\n"
                            + c.doctorName() + " подтвердил вашу запись.\n"
                            + "Когда: " + when + "\n"
                            + (where.isEmpty() ? "" : "Где: " + where + "\n")
                            + "\nВаши записи: " + c.appointmentsUrl() + "\n");
            case BOOKING_DECLINED_PATIENT -> new Message(
                    "Запись не состоялась",
                    "Здравствуйте, " + c.recipientName() + ".\n\n"
                            + "Запись к " + c.doctorName() + " на " + when
                            + " не была подтверждена.\n"
                            + "\nВы можете выбрать другое время: " + c.appointmentsUrl() + "\n");
            case BOOKING_CANCELLED_DOCTOR -> new Message(
                    "Запись отменена",
                    "Здравствуйте, " + c.recipientName() + ".\n\n"
                            + c.patientName() + " отменил запись на " + when + ".\n"
                            + "\nПанель: " + c.appointmentsUrl() + "\n");
            case BOOKING_REMINDER_PATIENT -> new Message(
                    "Ваш приём завтра",
                    "Здравствуйте, " + c.recipientName() + ".\n\n"
                            + "Завтра у вас приём у " + c.doctorName() + ".\n"
                            + "Когда: " + when + "\n"
                            + (where.isEmpty() ? "" : "Где: " + where + "\n")
                            + "\nЕсли не сможете прийти, отмените запись:\n"
                            + c.appointmentsUrl() + "\n");
        };
    }
}
