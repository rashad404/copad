package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Ordering tests.
 *
 * An order is a request. The laboratory still has to accept it, and nothing
 * here is paid: the product cannot take money, so an order that behaved as
 * though it had been settled would be a worse lie than one that plainly has
 * not.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LabOrderService {

    private final LabRepository labs;
    private final LabTestRepository tests;
    private final LabOrderRepository orders;
    private final UserRepository users;
    private final FamilyService familyService;

    @Transactional(readOnly = true)
    public List<LabOrder> forMember(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return orders.findByFamilyMemberIdOrderByCreatedAtDesc(memberId);
    }

    /**
     * Places an order.
     *
     * The name and price of every test are copied onto the order as they stand
     * now. A laboratory repricing later must not change what somebody agreed
     * to, and an order should still read correctly after a test is renamed.
     */
    @Transactional
    public LabOrder order(Long memberId, Long userId, Long labId, List<Long> testIds,
                          LabCollection collection, String address, String contactPhone,
                          LocalDateTime preferredAt, String note) {

        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);

        Lab lab = labs.findByIdAndDeletedAtIsNull(labId)
                .filter(Lab::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Laboratory not found"));

        if (testIds == null || testIds.isEmpty()) {
            throw new IllegalArgumentException("Choose at least one test");
        }

        List<LabTest> chosen = tests.findByIdInAndActiveTrue(testIds);
        if (chosen.size() != testIds.stream().distinct().count()) {
            throw new IllegalArgumentException("One of those tests is not available");
        }
        // A test from another laboratory would produce an order nobody can
        // fulfil, priced from a place that is not doing the work.
        boolean allBelong = chosen.stream()
                .allMatch(t -> t.getLab().getId().equals(lab.getId()));
        if (!allBelong) {
            throw new IllegalArgumentException("Those tests are not all from this laboratory");
        }

        if (collection == LabCollection.HOME) {
            if (!lab.isHomeCollection()) {
                throw new IllegalArgumentException("This laboratory does not collect at home");
            }
            if (isBlank(address) || isBlank(contactPhone)) {
                throw new IllegalArgumentException(
                        "Home collection needs an address and a phone number");
            }
        }

        LabOrder order = new LabOrder();
        order.setLab(lab);
        order.setFamilyMember(member);
        order.setOrderedBy(userId == null ? null : users.findById(userId).orElse(null));
        order.setStatus(LabOrderStatus.REQUESTED);
        order.setCollection(collection == null ? LabCollection.LAB : collection);
        order.setPreferredAt(preferredAt);
        order.setNote(blankToNull(note));

        if (order.getCollection() == LabCollection.HOME) {
            order.setAddress(address.trim());
            order.setContactPhone(contactPhone.trim());
        }

        BigDecimal total = BigDecimal.ZERO;
        for (LabTest test : chosen) {
            LabOrderItem item = new LabOrderItem();
            item.setOrder(order);
            item.setTest(test);
            item.setNameAtOrder(test.getNameAz());
            item.setPriceAtOrder(test.getPrice());
            order.getItems().add(item);
            if (test.getPrice() != null) total = total.add(test.getPrice());
        }
        if (order.getCollection() == LabCollection.HOME
                && lab.getHomeCollectionFee() != null) {
            total = total.add(lab.getHomeCollectionFee());
        }
        order.setTotalPrice(total.signum() == 0 ? null : total);

        LabOrder saved = orders.save(order);
        // No analyte names: which tests somebody is having is clinical.
        log.info("Lab order {} placed at lab {} with {} tests",
                saved.getId(), lab.getId(), chosen.size());
        return saved;
    }

    @Transactional
    public LabOrder cancel(Long memberId, Long orderId, Long userId, String reason) {
        familyService.requireMemberAccess(memberId, userId, true);
        LabOrder order = orders.findByIdAndFamilyMemberId(orderId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.isCancellable()) {
            throw new IllegalStateException("This order can no longer be cancelled");
        }
        order.setStatus(LabOrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancellationReason(blankToNull(reason));
        log.info("Lab order {} cancelled", orderId);
        return orders.save(order);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}
