package com.drcopad.copad.dto;

import com.drcopad.copad.entity.BiologicalSex;
import com.drcopad.copad.entity.FamilyMember;
import com.drcopad.copad.entity.Relationship;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberDTO {

    private Long id;
    private Long familyId;
    private String fullName;
    private Relationship relationship;
    private LocalDate dateOfBirth;
    private BiologicalSex biologicalSex;
    private String bloodType;
    private String avatarUrl;

    private Integer birthWeightGrams;
    private BigDecimal birthLengthCm;
    private BigDecimal gestationalAgeWeeks;

    /** Derived server-side so every client shows the same age. */
    private Integer ageYears;
    private Integer ageMonths;
    private Integer correctedAgeMonths;
    private boolean minor;
    /** True when this member is the account holder themselves. */
    private boolean self;

    public static FamilyMemberDTO from(FamilyMember m) {
        return FamilyMemberDTO.builder()
                .id(m.getId())
                .familyId(m.getFamily() == null ? null : m.getFamily().getId())
                .fullName(m.getFullName())
                .relationship(m.getRelationship())
                .dateOfBirth(m.getDateOfBirth())
                .biologicalSex(m.getBiologicalSex())
                .bloodType(m.getBloodType())
                .avatarUrl(m.getAvatarUrl())
                .birthWeightGrams(m.getBirthWeightGrams())
                .birthLengthCm(m.getBirthLengthCm())
                .gestationalAgeWeeks(m.getGestationalAgeWeeks())
                .ageYears(m.getAgeYears())
                .ageMonths(m.getAgeMonths())
                .correctedAgeMonths(m.getCorrectedAgeMonths())
                .minor(m.isMinor())
                .self(m.getRelationship() == Relationship.SELF)
                .build();
    }

    public FamilyMember toEntity() {
        return FamilyMember.builder()
                .fullName(fullName)
                .relationship(relationship == null ? Relationship.OTHER : relationship)
                .dateOfBirth(dateOfBirth)
                .biologicalSex(biologicalSex)
                .bloodType(bloodType)
                .avatarUrl(avatarUrl)
                .birthWeightGrams(birthWeightGrams)
                .birthLengthCm(birthLengthCm)
                .gestationalAgeWeeks(gestationalAgeWeeks)
                .build();
    }
}
