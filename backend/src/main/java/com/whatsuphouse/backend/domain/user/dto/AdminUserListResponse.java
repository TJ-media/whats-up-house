package com.whatsuphouse.backend.domain.user.dto;

import com.whatsuphouse.backend.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
@Builder
public class AdminUserListResponse {

    private UUID id;
    private String nickname;
    private String name;
    private String phone;
    private String email;
    private String gender;
    private Integer age;
    private String job;
    private String mbti;
    private LocalDateTime createdAt;
    private Long applicationCount;
    private Integer mileage;
    private String accountStatus;   // ACTIVE / SUSPENDED / ADMIN

    public static AdminUserListResponse from(User user, Long applicationCount) {
        String accountStatus;
        if (user.isAdmin()) {
            accountStatus = "ADMIN";
        } else if (user.isSuspended()) {
            accountStatus = "SUSPENDED";
        } else {
            accountStatus = "ACTIVE";
        }

        return AdminUserListResponse.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .age(user.getAge())
                .job(user.getJob() != null ? user.getJob().name() : null)
                .mbti(user.getMbti() != null ? user.getMbti().name() : null)
                .createdAt(user.getCreatedAt())
                .applicationCount(applicationCount)
                .mileage(user.getMileage())
                .accountStatus(accountStatus)
                .build();
    }
}
