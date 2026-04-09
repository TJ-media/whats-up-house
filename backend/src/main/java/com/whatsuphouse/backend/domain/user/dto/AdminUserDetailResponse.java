package com.whatsuphouse.backend.domain.user.dto;

import com.whatsuphouse.backend.domain.application.dto.AdminApplicationResponse;
import com.whatsuphouse.backend.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
@Builder
public class AdminUserDetailResponse {

    private UUID id;
    private String nickname;
    private String name;
    private String phone;
    private String email;
    private String bio;
    private String gender;
    private Integer age;
    private String job;
    private String mbti;
    private String animalType;
    private String[] interests;
    private Integer mileage;
    private String accountStatus;
    private LocalDateTime createdAt;
    private List<AdminApplicationResponse> applicationHistory;

    public static AdminUserDetailResponse from(User user, List<AdminApplicationResponse> appHistory) {
        String accountStatus;
        if (user.isAdmin()) {
            accountStatus = "ADMIN";
        } else if (user.isSuspended()) {
            accountStatus = "SUSPENDED";
        } else {
            accountStatus = "ACTIVE";
        }

        return AdminUserDetailResponse.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .bio(user.getBio())
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .age(user.getAge())
                .job(user.getJob() != null ? user.getJob().name() : null)
                .mbti(user.getMbti() != null ? user.getMbti().name() : null)
                .animalType(user.getAnimalType() != null ? user.getAnimalType().name() : null)
                .interests(user.getInterests())
                .mileage(user.getMileage())
                .accountStatus(accountStatus)
                .createdAt(user.getCreatedAt())
                .applicationHistory(appHistory)
                .build();
    }
}
