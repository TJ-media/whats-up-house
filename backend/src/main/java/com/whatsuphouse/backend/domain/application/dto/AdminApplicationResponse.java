package com.whatsuphouse.backend.domain.application.dto;

import com.whatsuphouse.backend.domain.application.Application;
import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import com.whatsuphouse.backend.domain.application.enums.ReferralSource;
import com.whatsuphouse.backend.domain.user.enums.Gender;
import com.whatsuphouse.backend.domain.user.enums.Job;
import com.whatsuphouse.backend.domain.user.enums.Mbti;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class AdminApplicationResponse {

    private UUID id;
    private String name;
    private String phone;
    private Gender gender;
    private Integer age;
    private Job job;
    private Mbti mbti;
    private String intro;
    private ReferralSource referralSource;
    private ApplicationStatus status;
    private LocalDateTime createdAt;
    private boolean isGuest;

    public static AdminApplicationResponse from(Application application) {
        return AdminApplicationResponse.builder()
                .id(application.getId())
                .name(application.getApplicantName())
                .phone(application.getApplicantPhone())
                .gender(application.getGender())
                .age(application.getAge())
                .job(application.getJob())
                .mbti(application.getMbti())
                .intro(application.getIntro())
                .referralSource(application.getReferralSource())
                .status(application.getStatus())
                .createdAt(application.getCreatedAt())
                .isGuest(application.getUser() == null)
                .build();
    }
}
