package com.whatsuphouse.backend.domain.location.dto;

import com.whatsuphouse.backend.domain.location.Location;
import com.whatsuphouse.backend.domain.location.enums.ContractStatus;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class LocationResponse {

    private UUID id;
    private String name;
    private String address;
    private String addressDetail;
    private int maxCapacity;
    private String[] features;
    private ContractStatus contractStatus;
    private String memo;

    public static LocationResponse from(Location location) {
        return LocationResponse.builder()
                .id(location.getId())
                .name(location.getName())
                .address(location.getAddress())
                .addressDetail(location.getAddressDetail())
                .maxCapacity(location.getMaxCapacity())
                .features(location.getFeatures())
                .contractStatus(location.getContractStatus())
                .memo(location.getMemo())
                .build();
    }
}
