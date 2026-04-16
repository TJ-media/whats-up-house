package com.whatsuphouse.backend.domain.location;

import com.whatsuphouse.backend.domain.location.enums.LocationStatus;
import com.whatsuphouse.backend.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "locations")
@Getter
@NoArgsConstructor
public class Location extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(name = "map_url", length = 500)
    private String mapUrl;

    @Column(name = "max_capacity", nullable = false)
    private int maxCapacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LocationStatus status;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Builder
    public Location(String name, String address, String mapUrl, int maxCapacity,
                    LocationStatus status, String memo) {
        this.name = name;
        this.address = address;
        this.mapUrl = mapUrl;
        this.maxCapacity = maxCapacity;
        this.status = status;
        this.memo = memo;
    }

    public void update(String name, String address, String mapUrl, int maxCapacity,
                       LocationStatus status, String memo) {
        this.name = name;
        this.address = address;
        this.mapUrl = mapUrl;
        this.maxCapacity = maxCapacity;
        this.status = status;
        this.memo = memo;
    }
}
