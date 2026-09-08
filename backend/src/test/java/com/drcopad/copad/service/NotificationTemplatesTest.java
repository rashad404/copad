package com.drcopad.copad.service;

import com.drcopad.copad.entity.Notification.Kind;
import com.drcopad.copad.service.notification.NotificationTemplates;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class NotificationTemplatesTest {

    private static final LocalDateTime WHEN = LocalDateTime.of(2026, 9, 21, 9, 0);

    private NotificationTemplates.Context context() {
        return new NotificationTemplates.Context(
                "Rashad", "Dr. Səbinə Kərimli", "Alim Mirzayev",
                "azdoc Klinikası", "Nizami küçəsi 203, Bakı",
                WHEN, "https://azdoc.ai/randevularim");
    }

    @Test
    void everyKindRendersInEveryLanguage() {
        for (Kind kind : Kind.values()) {
            for (String language : new String[]{"az", "en", "ru"}) {
                NotificationTemplates.Message message =
                        NotificationTemplates.render(kind, language, context());
                assertThat(message.subject()).as("%s/%s subject", kind, language).isNotBlank();
                assertThat(message.body()).as("%s/%s body", kind, language).isNotBlank();
                // The time is the one fact every one of these must carry.
                assertThat(message.body()).as("%s/%s time", kind, language)
                        .contains("21.09.2026").contains("09:00");
            }
        }
    }

    @Test
    void anUnknownLanguageFallsBackToAzerbaijaniRatherThanFailing() {
        NotificationTemplates.Message message = NotificationTemplates.render(
                Kind.BOOKING_CONFIRMED_PATIENT, "fr", context());
        assertThat(message.subject()).isEqualTo("Randevunuz təsdiqləndi");
    }

    @Test
    void nullLanguageIsAzerbaijani() {
        assertThat(NotificationTemplates.render(Kind.BOOKING_REMINDER_PATIENT, null, context())
                .subject()).isEqualTo("Sabahkı randevunuz");
    }

    /**
     * The reason somebody gave is their account of their own symptoms. Email is
     * not a private channel and there is no version of this message that needs
     * it, so the context has no field for it at all - this pins that the
     * rendered text cannot leak one either.
     */
    @Test
    void noMessageCarriesClinicalDetail() {
        for (Kind kind : Kind.values()) {
            for (String language : new String[]{"az", "en", "ru"}) {
                String body = NotificationTemplates.render(kind, language, context()).body();
                assertThat(body.toLowerCase())
                        .as("%s/%s must not discuss why", kind, language)
                        .doesNotContain("symptom")
                        .doesNotContain("diagnos")
                        .doesNotContain("səbəb")
                        .doesNotContain("причин");
            }
        }
    }

    @Test
    void aMissingClinicIsOmittedRatherThanPrintedEmpty() {
        NotificationTemplates.Context noClinic = new NotificationTemplates.Context(
                "Rashad", "Dr. Səbinə Kərimli", "Alim", null, null, WHEN,
                "https://azdoc.ai/randevularim");
        String body = NotificationTemplates.render(
                Kind.BOOKING_CONFIRMED_PATIENT, "en", noClinic).body();
        assertThat(body).doesNotContain("Where:");
    }

    @Test
    void theDoctorIsToldWhoAndThePatientIsToldWhom() {
        String toDoctor = NotificationTemplates.render(
                Kind.BOOKING_REQUESTED_DOCTOR, "en", context()).body();
        assertThat(toDoctor).contains("Alim Mirzayev");

        String toPatient = NotificationTemplates.render(
                Kind.BOOKING_CONFIRMED_PATIENT, "en", context()).body();
        assertThat(toPatient).contains("Dr. Səbinə Kərimli");
    }
}
