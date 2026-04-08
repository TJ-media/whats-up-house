package com.whatsuphouse.backend.domain.user.dto;

import com.whatsuphouse.backend.domain.user.enums.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ProfileUpdateRequest {

    @NotBlank
    private String nickname;

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
