package com.whatsuphouse.backend.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class MonitoringResponse {

    private List<GatheringMonitoringDto> upcomingGatherings;
}
