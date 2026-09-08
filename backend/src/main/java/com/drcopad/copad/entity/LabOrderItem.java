package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * One test on an order.
 *
 * Keeps the name and price as they stood at the time, so an order still reads
 * correctly after the laboratory renames or reprices something.
 */
@Entity
@Table(name = "lab_order_item")
@Getter
@Setter
public class LabOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lab_order_id", nullable = false)
    private LabOrder order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lab_test_id", nullable = false)
    private LabTest test;

    @Column(name = "name_at_order", nullable = false)
    private String nameAtOrder;

    @Column(name = "price_at_order", precision = 10, scale = 2)
    private BigDecimal priceAtOrder;

    /** Set when a result for this test lands in the record. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_result_id")
    private LabResult result;
}
