package com.whatsuphouse.backend.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
@Builder
public class GatheringMonitoringDto {

    private UUID gatheringId;
    private String title;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String locationName;
    private String status;
    private Integer capacity;
    private Integer currentApplicants;
    private Integer attendedCount;
    private long daysUntil;      // 오늘로부터 몇 일 후
}
