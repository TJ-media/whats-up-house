package com.whatsuphouse.backend.domain.gathering.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
public class GatheringUpdateRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private UUID locationId;

    @NotNull
    private LocalDate eventDate;

    private LocalTime startTime;
    private LocalTime endTime;
    private Integer price;

    @NotNull
    @Min(1) @Max(20)
    private Integer maxAttendees;

    private String thumbnailUrl;
}
