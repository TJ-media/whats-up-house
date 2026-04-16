package com.whatsuphouse.backend.domain.location.dto;

import com.whatsuphouse.backend.domain.location.Location;
import com.whatsuphouse.backend.domain.location.enums.LocationStatus;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class LocationResponse {

    private UUID id;
    private String name;
    private String address;
    private String mapUrl;
    private int maxCapacity;
    private LocationStatus status;
    private String memo;

    public static LocationResponse from(Location location) {
        return LocationResponse.builder()
                .id(location.getId())
                .name(location.getName())
                .address(location.getAddress())
                .mapUrl(location.getMapUrl())
                .maxCapacity(location.getMaxCapacity())
                .status(location.getStatus())
                .memo(location.getMemo())
                .build();
    }
}
