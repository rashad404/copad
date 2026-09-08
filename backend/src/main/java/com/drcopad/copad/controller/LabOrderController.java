package com.drcopad.copad.controller;

import com.drcopad.copad.entity.LabCollection;
import com.drcopad.copad.entity.LabOrder;
import com.drcopad.copad.entity.LabOrderItem;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.LabOrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Test orders, per family member.
 *
 * Under the member rather than the account, like every other clinical thing
 * here: a parent ordering for a child is the ordinary case.
 */
@RestController
@RequestMapping("/api/members/{memberId}/lab-orders")
@RequiredArgsConstructor
public class LabOrderController {

    private final LabOrderService orders;

    @Data
    public static class OrderRequest {
        private Long labId;
        private List<Long> testIds;
        private LabCollection collection = LabCollection.LAB;
        private String address;
        private String contactPhone;
        private LocalDateTime preferredAt;
        private String note;
    }

    @Data
    public static class CancelRequest {
        private String reason;
    }

    @GetMapping
    public List<Map<String, Object>> list(@PathVariable Long memberId,
                                          @AuthenticationPrincipal User user) {
        return orders.forMember(memberId, user.getId()).stream().map(this::view).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> place(@PathVariable Long memberId,
                                     @RequestBody OrderRequest request,
                                     @AuthenticationPrincipal User user) {
        return view(orders.order(memberId, user.getId(), request.getLabId(),
                request.getTestIds(), request.getCollection(), request.getAddress(),
                request.getContactPhone(), request.getPreferredAt(), request.getNote()));
    }

    @PostMapping("/{orderId}/cancel")
    public Map<String, Object> cancel(@PathVariable Long memberId,
                                      @PathVariable Long orderId,
                                      @RequestBody(required = false) CancelRequest body,
                                      @AuthenticationPrincipal User user) {
        return view(orders.cancel(memberId, orderId, user.getId(),
                body == null ? null : body.getReason()));
    }

    private Map<String, Object> view(LabOrder order) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", order.getId());
        row.put("labId", order.getLab().getId());
        row.put("labName", order.getLab().getName());
        row.put("labSlug", order.getLab().getSlug());
        row.put("labPhone", order.getLab().getPhone());
        row.put("status", order.getStatus());
        row.put("collection", order.getCollection());
        row.put("address", order.getAddress());
        row.put("contactPhone", order.getContactPhone());
        row.put("preferredAt", order.getPreferredAt());
        row.put("totalPrice", order.getTotalPrice());
        row.put("note", order.getNote());
        row.put("cancelledAt", order.getCancelledAt());
        row.put("completedAt", order.getCompletedAt());
        row.put("cancellable", order.isCancellable());
        row.put("items", order.getItems().stream().map(this::item).toList());
        return row;
    }

    private Map<String, Object> item(LabOrderItem item) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", item.getId());
        row.put("name", item.getNameAtOrder());
        row.put("price", item.getPriceAtOrder());
        // Whether the value has landed in the record, not the value itself.
        row.put("resultReady", item.getResult() != null);
        return row;
    }
}
