package com.whatsuphouse.backend.domain.user.dto;

import com.whatsuphouse.backend.domain.user.enums.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class RegisterRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String nickname;

    // 온보딩 (선택)
    private String bio;
    private Gender gender;
    private Integer age;
    private Job job;
    private Mbti mbti;
    private AnimalType animalType;
    private String animalColor;
    private AnimalPose animalPose;
    private String[] interests;
    private String avatarUrl;
}
