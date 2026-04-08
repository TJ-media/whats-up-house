package com.whatsuphouse.backend.domain.user.dto;

import com.whatsuphouse.backend.domain.user.User;
import com.whatsuphouse.backend.domain.user.enums.*;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class ProfileResponse {

    private UUID id;
    private String email;
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
    private int mileage;
    private boolean isAdmin;
    private String avatarUrl;

    public static ProfileResponse from(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .bio(user.getBio())
                .gender(user.getGender())
                .age(user.getAge())
                .job(user.getJob())
                .mbti(user.getMbti())
                .animalType(user.getAnimalType())
                .animalColor(user.getAnimalColor())
                .animalPose(user.getAnimalPose())
                .interests(user.getInterests())
                .mileage(user.getMileage())
                .isAdmin(user.isAdmin())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
