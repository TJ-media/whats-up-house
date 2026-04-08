package com.whatsuphouse.backend.domain.gathering.dto;

import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
public class GatheringCreateRequest {

    @NotBlank
    private String title;

    private String description;

    private String[] howToRun;

    @NotNull
    private UUID locationId;

    @NotNull
    private LocalDate date;

    private LocalTime startTime;
    private LocalTime endTime;

    private Integer price;

    @NotNull
    @Min(1) @Max(20)
    private Integer capacity;

    @NotNull
    private GatheringStatus status;

    private String thumbnailUrl;
    private String[] photoUrls;
    private String[] moodTags;
    private String[] activityTags;

    private int mileageReward = 500;
}
