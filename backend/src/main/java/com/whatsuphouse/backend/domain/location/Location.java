package com.whatsuphouse.backend.domain.location;

import com.whatsuphouse.backend.domain.location.enums.ContractStatus;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "locations")
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(name = "address_detail")
    private String addressDetail;

    @Column(name = "max_capacity", nullable = false)
    private int maxCapacity;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private String[] features;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_status", nullable = false)
    private ContractStatus contractStatus;

    private String memo;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public Location(String name, String address, String addressDetail, int maxCapacity,
                    String[] features, ContractStatus contractStatus, String memo) {
        this.name = name;
        this.address = address;
        this.addressDetail = addressDetail;
        this.maxCapacity = maxCapacity;
        this.features = features;
        this.contractStatus = contractStatus;
        this.memo = memo;
    }

    public void update(String name, String address, String addressDetail, int maxCapacity,
                       String[] features, ContractStatus contractStatus, String memo) {
        this.name = name;
        this.address = address;
        this.addressDetail = addressDetail;
        this.maxCapacity = maxCapacity;
        this.features = features;
        this.contractStatus = contractStatus;
        this.memo = memo;
    }
}
