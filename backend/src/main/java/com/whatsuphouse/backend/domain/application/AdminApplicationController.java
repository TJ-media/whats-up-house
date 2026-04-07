package com.whatsuphouse.backend.domain.application;

import com.whatsuphouse.backend.domain.application.dto.AdminApplicationResponse;
import com.whatsuphouse.backend.domain.application.dto.ApplicationRequest;
import com.whatsuphouse.backend.domain.application.dto.AttendRequest;
import com.whatsuphouse.backend.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Admin - Application", description = "관리자 참가자 관리 API")
public class AdminApplicationController {

    private final AdminApplicationService adminApplicationService;

    @GetMapping("/api/admin/gatherings/{gatheringId}/applications")
    @Operation(summary = "게더링별 참가자 목록 조회")
    public ApiResponse<List<AdminApplicationResponse>> getApplications(@PathVariable UUID gatheringId) {
        return ApiResponse.success(adminApplicationService.getApplications(gatheringId));
    }

    @PostMapping("/api/admin/gatherings/{gatheringId}/applications")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "참가자 직접 추가")
    public ApiResponse<AdminApplicationResponse> addApplication(@PathVariable UUID gatheringId,
                                                                 @RequestBody @Valid ApplicationRequest request) {
        return ApiResponse.success(adminApplicationService.addApplication(gatheringId, request));
    }

    @PatchMapping("/api/admin/applications/{id}/attend")
    @Operation(summary = "출석 체크 toggle")
    public ApiResponse<AdminApplicationResponse> updateAttend(@PathVariable UUID id,
                                                               @RequestBody @Valid AttendRequest request) {
        return ApiResponse.success(adminApplicationService.updateAttend(id, request));
    }

    @DeleteMapping("/api/admin/applications/{id}")
    @Operation(summary = "참가자 삭제 (status = CANCELLED)")
    public ApiResponse<Void> deleteApplication(@PathVariable UUID id) {
        adminApplicationService.deleteApplication(id);
        return ApiResponse.success(null);
    }
}
