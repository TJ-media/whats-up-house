package com.whatsuphouse.backend.domain.application.dto;

import com.whatsuphouse.backend.domain.application.enums.ReferralSource;
import com.whatsuphouse.backend.domain.user.enums.Gender;
import com.whatsuphouse.backend.domain.user.enums.Job;
import com.whatsuphouse.backend.domain.user.enums.Mbti;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ApplicationRequest {

    // 비로그인 전용
    private String applicantName;
    private String applicantPhone;

    @NotNull
    private Gender gender;

    @NotNull
    private Integer age;

    private Job job;

    private Mbti mbti;

    private String intro;

    @NotNull
    private ReferralSource referralSource;
}
