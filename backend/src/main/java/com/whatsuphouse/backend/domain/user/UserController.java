package com.whatsuphouse.backend.domain.user;

import com.whatsuphouse.backend.domain.user.dto.*;
import com.whatsuphouse.backend.global.auth.UserPrincipal;
import com.whatsuphouse.backend.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "User", description = "회원 인증 및 프로필 API")
public class UserController {

    private final UserService userService;

    @PostMapping("/api/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "회원가입")
    public ApiResponse<ProfileResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ApiResponse.success("회원가입이 완료되었습니다.", userService.register(request));
    }

    @PostMapping("/api/auth/login")
    @Operation(summary = "로그인")
    public ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        return ApiResponse.success(userService.login(request));
    }

    @GetMapping("/api/users/me")
    @Operation(summary = "내 프로필 조회")
    public ApiResponse<ProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(userService.getProfile(principal.getUserId()));
    }

    @PutMapping("/api/users/me")
    @Operation(summary = "프로필 수정")
    public ApiResponse<ProfileResponse> updateProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestBody @Valid ProfileUpdateRequest request) {
        return ApiResponse.success(userService.updateProfile(principal.getUserId(), request));
    }

    @GetMapping("/api/users/check-nickname")
    @Operation(summary = "닉네임 중복 확인 (true = 사용 가능)")
    public ApiResponse<Boolean> checkNickname(@RequestParam String nickname) {
        return ApiResponse.success(userService.checkNickname(nickname));
    }

    @GetMapping("/api/users/check-email")
    @Operation(summary = "이메일 중복 확인 (true = 사용 가능)")
    public ApiResponse<Boolean> checkEmail(@RequestParam String email) {
        return ApiResponse.success(userService.checkEmail(email));
    }
}
