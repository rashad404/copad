package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Turns a member's record into the context block the assistant sees.
 *
 * This is what separates azdoc from a general chatbot. The same question -
 * "can I take something for this headache?" - has a different answer for
 * someone on warfarin with a penicillin allergy than for someone with an empty
 * record, and only this service can tell the model which it is talking to.
 *
 * Three rules shape what goes in:
 *
 *  - Safety first. Allergies and current medications lead, because they change
 *    what may be suggested. Everything else is background.
 *  - Current only. A resolved condition or a discontinued drug would invite
 *    advice based on something no longer true.
 *  - Bounded. A record with 40 vitals and 20 conditions must not crowd out the
 *    person's actual question, so each section is capped and the caps are
 *    tightest on the least decision-relevant data.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecordContextService {

    /** Caps chosen so a full context stays a small fraction of the request. */
    private static final int MAX_CONDITIONS = 10;
    private static final int MAX_MEDICATIONS = 15;
    private static final int MAX_VITALS = 8;
    private static final int TREND_WINDOW_DAYS = 180;

    private final FamilyService familyService;
    private final ClinicalRecordService records;
    private final VitalService vitals;

    /**
     * @param prompt      the block appended to the system prompt, empty when there
     *                    is nothing worth saying
     * @param summary     a short human-readable line the UI can show, so the
     *                    person can see what the assistant was told about them
     * @param hasCritical whether a life-threatening allergy is present
     */
    public record Context(String prompt, String summary, boolean hasCritical) {
        public boolean isEmpty() {
            return prompt == null || prompt.isBlank();
        }

        public static Context empty() {
            return new Context("", "", false);
        }
    }

    @Transactional(readOnly = true)
    public Context forMember(Long memberId, Long userId) {
        FamilyMember member;
        try {
            member = familyService.requireMemberAccess(memberId, userId, false);
        } catch (RuntimeException e) {
            // A context failure must never block the conversation; the person
            // still gets an answer, just an ungrounded one.
            log.warn("Record context unavailable for member {}: {}", memberId, e.getClass().getSimpleName());
            return Context.empty();
        }

        StringBuilder sb = new StringBuilder();
        StringBuilder summary = new StringBuilder();
        boolean hasCritical = false;

        sb.append("\n\n--- PATIENT RECORD ---\n");
        sb.append("You are answering about this specific person, not the general public.\n\n")
          // Stated as a rule before the data, and restated after it. A general
          // question such as "what antibiotic is used for an ear infection?"
          // otherwise gets a general answer, and the model recommends the exact
          // drug this person reacts to. Naming the failure mode is what stops
          // it: the answer must be corrected for this record, not appended to.
          .append("RULES - these override the general answer:\n")
          .append("1. If the usual treatment conflicts with an allergy below, ")
          .append("you MUST say so explicitly in the first sentence, name the conflict, ")
          .append("and give the alternative instead. Do not present the conflicting ")
          .append("drug as the recommendation and mention the allergy afterwards.\n")
          .append("2. This applies even when the question is phrased generally.\n")
          .append("3. Check every drug you name against the allergies and current ")
          .append("medications below, including drugs in the same class.\n")
          .append("4. Use the person's age for dosing and thresholds.\n");

        // Demographics: age changes dosing, normal ranges, and what is likely.
        sb.append("\nPerson: ");
        Integer age = member.getAgeYears();
        if (age != null) {
            sb.append(age < 2 && member.getAgeMonths() != null
                    ? member.getAgeMonths() + " months old" : age + " years old");
            summary.append(age).append("y");
        } else {
            sb.append("age unknown");
        }
        if (member.getBiologicalSex() != null) {
            sb.append(", ").append(member.getBiologicalSex().name().toLowerCase());
        }
        if (member.isMinor()) {
            sb.append(". THIS IS A CHILD - use paediatric dosing and thresholds");
        }
        // A preterm infant is assessed on corrected age; using actual age would
        // misjudge both growth and milestones.
        Integer corrected = member.getCorrectedAgeMonths();
        if (corrected != null && member.getAgeMonths() != null
                && !corrected.equals(member.getAgeMonths())) {
            sb.append(". Born preterm; corrected age ").append(corrected).append(" months");
        }
        sb.append(".\n");

        // Allergies first: they constrain everything that may be suggested.
        List<Allergy> allergies = records.allergies(memberId, userId).stream()
                .filter(Allergy::isActive).toList();
        if (!allergies.isEmpty()) {
            sb.append("\nALLERGIES (never suggest anything containing these):\n");
            for (Allergy a : allergies) {
                sb.append("- ").append(a.getAllergen());
                if (a.getSeverity() != null) sb.append(" [").append(a.getSeverity()).append("]");
                if (a.getReaction() != null) sb.append(" - reaction: ").append(a.getReaction());
                sb.append("\n");
                if (a.isCritical()) hasCritical = true;
            }
            summary.append(summary.isEmpty() ? "" : ", ")
                   .append(allergies.size()).append(" allergy")
                   .append(allergies.size() == 1 ? "" : "s");
        }

        List<Medication> medications = records.medications(memberId, userId).stream()
                .filter(Medication::isActive).limit(MAX_MEDICATIONS).toList();
        if (!medications.isEmpty()) {
            sb.append("\nCURRENT MEDICATIONS (check any suggestion against these):\n");
            for (Medication m : medications) {
                sb.append("- ").append(m.getName());
                if (m.getDoseLabel() != null) sb.append(" ").append(m.getDoseLabel());
                if (m.getFrequency() != null) sb.append(" ").append(m.getFrequency());
                sb.append("\n");
            }
            summary.append(summary.isEmpty() ? "" : ", ")
                   .append(medications.size()).append(" medication")
                   .append(medications.size() == 1 ? "" : "s");
        }

        List<MedicalCondition> conditions = records.conditions(memberId, userId).stream()
                .filter(MedicalCondition::isCurrent).limit(MAX_CONDITIONS).toList();
        if (!conditions.isEmpty()) {
            sb.append("\nACTIVE CONDITIONS:\n");
            for (MedicalCondition c : conditions) {
                sb.append("- ").append(c.getLabel());
                if (c.getOnsetDate() != null) {
                    sb.append(" (since ").append(c.getOnsetDate().getYear()).append(")");
                }
                if (c.getStatus() == ConditionStatus.UNCONFIRMED) sb.append(" [self-reported]");
                sb.append("\n");
            }
            summary.append(summary.isEmpty() ? "" : ", ")
                   .append(conditions.size()).append(" condition")
                   .append(conditions.size() == 1 ? "" : "s");
        }

        var latest = vitals.latestByType(memberId, userId);
        if (!latest.isEmpty()) {
            sb.append("\nRECENT MEASUREMENTS:\n");
            int count = 0;
            for (var entry : latest.entrySet()) {
                if (count++ >= MAX_VITALS) break;
                VitalReading r = entry.getValue();
                sb.append("- ").append(entry.getKey()).append(": ")
                  .append(r.getValueCanonical().stripTrailingZeros().toPlainString())
                  .append(" ").append(r.getUnitCanonical())
                  .append(" (").append(r.getMeasuredAt().toLocalDate()).append(")");
                if (r.getAbnormalFlag() != null && r.getAbnormalFlag().isAbnormal()) {
                    sb.append(" [").append(r.getAbnormalFlag()).append("]");
                }
                sb.append("\n");
            }
        }

        // Direction of travel, which a single reading cannot express. "Rising
        // over three readings" is the observation a person would not make
        // themselves and is the clearest sign the record is being used.
        var trends = vitals.trends(memberId, userId, TREND_WINDOW_DAYS).stream()
                .filter(t -> !"STABLE".equals(t.direction()))
                .limit(4).toList();
        if (!trends.isEmpty()) {
            sb.append("\nTRENDS (last 6 months):\n");
            for (var t : trends) {
                sb.append("- ").append(t.type()).append(": ").append(t.direction().toLowerCase())
                  .append(" from ").append(t.first()).append(" to ").append(t.last())
                  .append(" ").append(t.unit())
                  .append(" across ").append(t.readings()).append(" readings\n");
            }
        }

        // Repeated at the end because the constraint has to survive a long
        // record; a rule stated only before the data competes with everything
        // that follows it.
        if (hasCritical) {
            sb.append("\nREMINDER: this person has a life-threatening allergy listed above. ")
              .append("Any drug in that class is contraindicated. Lead with that fact.\n");
        }
        sb.append("\nThe record is self-reported and may be incomplete. ")
          .append("An empty section means nothing was recorded, not that there is nothing. ")
          .append("Do not assume a condition is absent because it is missing here.\n");
        sb.append("--- END RECORD ---\n");

        return new Context(sb.toString(),
                summary.isEmpty() ? "no record details" : summary.toString(),
                hasCritical);
    }
}
