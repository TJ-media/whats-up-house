package com.whatsuphouse.backend.domain.location;

import com.whatsuphouse.backend.domain.location.dto.LocationCreateRequest;
import com.whatsuphouse.backend.domain.location.dto.LocationResponse;
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
@RequestMapping("/api/admin/locations")
@RequiredArgsConstructor
@Tag(name = "Admin - Location", description = "관리자 장소 관리 API")
public class AdminLocationController {

    private final AdminLocationService adminLocationService;

    @GetMapping
    @Operation(summary = "장소 목록 조회")
    public ApiResponse<List<LocationResponse>> getLocations() {
        return ApiResponse.success(adminLocationService.getLocations());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "장소 추가")
    public ApiResponse<LocationResponse> createLocation(@RequestBody @Valid LocationCreateRequest request) {
        return ApiResponse.success(adminLocationService.createLocation(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "장소 수정")
    public ApiResponse<LocationResponse> updateLocation(@PathVariable UUID id,
                                                         @RequestBody @Valid LocationCreateRequest request) {
        return ApiResponse.success(adminLocationService.updateLocation(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "장소 삭제")
    public ApiResponse<Void> deleteLocation(@PathVariable UUID id) {
        adminLocationService.deleteLocation(id);
        return ApiResponse.success(null);
    }
}
