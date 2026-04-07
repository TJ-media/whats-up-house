package com.whatsuphouse.backend.domain.application;

import com.whatsuphouse.backend.domain.application.dto.ApplicationRequest;
import com.whatsuphouse.backend.domain.application.dto.ApplicationResponse;
import com.whatsuphouse.backend.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/gatherings/{gatheringId}/applications")
@RequiredArgsConstructor
@Tag(name = "Application", description = "게더링 신청 API")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/user")
    @Operation(summary = "로그인 유저 게더링 신청")
    public ApiResponse<ApplicationResponse> applyAsUser(
            @PathVariable UUID gatheringId,
            Authentication authentication,
            @RequestBody @Valid ApplicationRequest request) {
        UUID userId = UUID.fromString(authentication.getName());
        return ApiResponse.success(applicationService.applyAsUser(gatheringId, userId, request));
    }

    @PostMapping("/guest")
    @Operation(summary = "비로그인 게더링 신청")
    public ApiResponse<ApplicationResponse> applyAsGuest(
            @PathVariable UUID gatheringId,
            @RequestBody @Valid ApplicationRequest request) {
        return ApiResponse.success(applicationService.applyAsGuest(gatheringId, request));
    }
}
