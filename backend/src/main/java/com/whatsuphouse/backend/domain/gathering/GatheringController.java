package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.gathering.dto.GatheringCalendarResponse;
import com.whatsuphouse.backend.domain.gathering.dto.GatheringDetailResponse;
import com.whatsuphouse.backend.domain.gathering.dto.GatheringListResponse;
import com.whatsuphouse.backend.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gatherings")
@RequiredArgsConstructor
@Tag(name = "Gathering", description = "게더링 조회 API")
public class GatheringController {

    private final GatheringService gatheringService;

    @GetMapping
    @Operation(summary = "날짜별 게더링 목록 조회")
    public ApiResponse<List<GatheringListResponse>> getGatheringsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.success(gatheringService.getGatheringsByDate(date));
    }

    @GetMapping("/{id}")
    @Operation(summary = "게더링 상세 조회")
    public ApiResponse<GatheringDetailResponse> getGatheringDetail(@PathVariable UUID id) {
        return ApiResponse.success(gatheringService.getGatheringDetail(id));
    }

    @GetMapping("/calendar")
    @Operation(summary = "캘린더 게더링 날짜 조회")
    public ApiResponse<GatheringCalendarResponse> getCalendar(
            @RequestParam int year,
            @RequestParam int month) {
        return ApiResponse.success(gatheringService.getCalendar(year, month));
    }
}
