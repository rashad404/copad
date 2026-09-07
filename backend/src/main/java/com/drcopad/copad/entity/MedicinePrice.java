package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** A published price for a pack of a product. */
@Entity
@Table(name = "medicine_price")
@Getter
@Setter
public class MedicinePrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    @Column(name = "source_id")
    private Long sourceId;

    @Column(name = "trade_name", nullable = false, length = 512)
    private String tradeName;

    @Column(name = "active_ingredient", length = 512)
    private String activeIngredient;

    @Column(length = 255)
    private String dosage;

    @Column(length = 255)
    private String form;

    @Column(length = 255)
    private String packaging;

    @Column(name = "pack_quantity", length = 64)
    private String packQuantity;

    @Column(length = 512)
    private String manufacturer;

    @Column(name = "wholesale_price", precision = 10, scale = 2)
    private BigDecimal wholesalePrice;

    @Column(name = "retail_price", precision = 10, scale = 2)
    private BigDecimal retailPrice;

    @Column(name = "effective_date", length = 64)
    private String effectiveDate;

    @Column(name = "synced_at")
    private LocalDateTime syncedAt;
}
