package com.whatsuphouse.backend.domain.user.dto;

import com.whatsuphouse.backend.domain.user.User;
import com.whatsuphouse.backend.domain.user.enums.Gender;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class ProfileResponse {

    private UUID id;
    private String email;
    private String name;
    private Gender gender;
    private String age;
    private String nickname;
    private String phone;
    private boolean isAdmin;

    public static ProfileResponse from(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .gender(user.getGender())
                .age(user.getAge())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .isAdmin(user.isAdmin())
                .build();
    }
}
