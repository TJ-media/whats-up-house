package com.whatsuphouse.backend.domain.gathering.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class GatheringCalendarResponse {

    private int year;
    private int month;
    private List<LocalDate> dates;
}
