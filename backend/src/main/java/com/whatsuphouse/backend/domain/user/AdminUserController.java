package com.whatsuphouse.backend.domain.user;

import com.whatsuphouse.backend.domain.user.dto.AdminUserDetailResponse;
import com.whatsuphouse.backend.domain.user.dto.AdminUserListResponse;
import com.whatsuphouse.backend.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin - User", description = "관리자 회원 관리 API")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "회원 목록 조회 (keyword: 닉네임/이메일 검색)")
    public ApiResponse<Page<AdminUserListResponse>> getUsers(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ApiResponse.success(adminUserService.getUsers(keyword, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "회원 상세 조회 (신청 이력 포함)")
    public ApiResponse<AdminUserDetailResponse> getUserDetail(@PathVariable UUID id) {
        return ApiResponse.success(adminUserService.getUserDetail(id));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "회원 상태 변경 (suspend=true: 정지, suspend=false: 활성화)")
    public ApiResponse<Void> updateStatus(
            @PathVariable UUID id,
            @RequestParam boolean suspend) {
        adminUserService.updateUserStatus(id, suspend);
        return ApiResponse.success(null);
    }
}
