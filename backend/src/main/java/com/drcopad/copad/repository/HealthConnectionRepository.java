package com.drcopad.copad.repository;

import com.drcopad.copad.entity.HealthConnection;
import com.drcopad.copad.entity.HealthProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HealthConnectionRepository extends JpaRepository<HealthConnection, Long> {

    List<HealthConnection> findByFamilyMemberIdOrderByProviderAsc(Long familyMemberId);

    Optional<HealthConnection> findByFamilyMemberIdAndProvider(Long familyMemberId,
                                                              HealthProvider provider);
}
