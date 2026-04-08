package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.gathering.dto.*;
import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import com.whatsuphouse.backend.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/gatherings")
@RequiredArgsConstructor
@Tag(name = "Admin - Gathering", description = "관리자 게더링 CRUD API")
public class AdminGatheringController {

    private final AdminGatheringService adminGatheringService;

    @GetMapping
    @Operation(summary = "게더링 전체 목록 조회 (필터: status, date)")
    public ApiResponse<List<AdminGatheringListResponse>> getGatherings(
            @RequestParam(required = false) GatheringStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.success(adminGatheringService.getGatherings(status, date));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "게더링 생성")
    public ApiResponse<GatheringDetailResponse> createGathering(@RequestBody @Valid GatheringCreateRequest request) {
        return ApiResponse.success(adminGatheringService.createGathering(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "게더링 수정")
    public ApiResponse<GatheringDetailResponse> updateGathering(@PathVariable UUID id,
                                                                  @RequestBody @Valid GatheringUpdateRequest request) {
        return ApiResponse.success(adminGatheringService.updateGathering(id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "게더링 상태 변경")
    public ApiResponse<Void> updateStatus(@PathVariable UUID id,
                                           @RequestBody @Valid GatheringStatusRequest request) {
        adminGatheringService.updateStatus(id, request);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "게더링 삭제 (status = CANCELLED)")
    public ApiResponse<Void> deleteGathering(@PathVariable UUID id) {
        adminGatheringService.deleteGathering(id);
        return ApiResponse.success(null);
    }
}
