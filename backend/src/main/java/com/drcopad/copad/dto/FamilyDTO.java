package com.drcopad.copad.dto;

import com.drcopad.copad.entity.Family;
import com.drcopad.copad.entity.FamilyRole;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyDTO {
    private Long id;
    private String name;
    private Long ownerUserId;
    /** The requesting user's role, so the UI knows what to allow. */
    private FamilyRole role;
    private List<FamilyMemberDTO> members;

    public static FamilyDTO from(Family family, FamilyRole role, List<FamilyMemberDTO> members) {
        return FamilyDTO.builder()
                .id(family.getId())
                .name(family.getName())
                .ownerUserId(family.getOwner() == null ? null : family.getOwner().getId())
                .role(role)
                .members(members)
                .build();
    }
}
