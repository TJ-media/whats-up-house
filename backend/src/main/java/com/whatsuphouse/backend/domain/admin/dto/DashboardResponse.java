package com.whatsuphouse.backend.domain.admin.dto;

import com.whatsuphouse.backend.domain.gathering.dto.AdminGatheringListResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Long totalMembers;
    private Long thisMonthGatherings;
    private Integer thisMonthRevenue;
    private Long todayNewApplications;
    private List<AdminGatheringListResponse> thisWeekGatherings;
    private List<RecentActivityResponse> recentActivities;
}
