package com.whatsuphouse.backend.domain.admin;

import com.whatsuphouse.backend.domain.admin.dto.DashboardResponse;
import com.whatsuphouse.backend.domain.admin.dto.MonitoringResponse;
import com.whatsuphouse.backend.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
@Tag(name = "Admin - Stats", description = "관리자 통계 API")
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping("/dashboard")
    @Operation(summary = "대시보드 KPI (총 회원수, 이번 달 게더링 수, 이번 달 매출, 오늘 새 신청)")
    public ApiResponse<DashboardResponse> getDashboard() {
        return ApiResponse.success(adminStatsService.getDashboard());
    }

    @GetMapping("/monitoring")
    @Operation(summary = "모임 현황 모니터링 (오늘 이후 게더링 현황)")
    public ApiResponse<MonitoringResponse> getMonitoring() {
        return ApiResponse.success(adminStatsService.getMonitoring());
    }
}
