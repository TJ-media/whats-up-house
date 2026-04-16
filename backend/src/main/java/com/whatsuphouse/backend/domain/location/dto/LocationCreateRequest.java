package com.whatsuphouse.backend.domain.location.dto;

import com.whatsuphouse.backend.domain.location.enums.LocationStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class LocationCreateRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    private String mapUrl;

    @NotNull
    @Min(1) @Max(20)
    private Integer maxCapacity;

    @NotNull
    private LocationStatus status;

    private String memo;
}
