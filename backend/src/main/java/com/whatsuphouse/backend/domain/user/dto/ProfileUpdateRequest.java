package com.whatsuphouse.backend.domain.user.dto;

import com.whatsuphouse.backend.domain.user.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ProfileUpdateRequest {

    @NotBlank
    private String name;

    @NotNull
    private Gender gender;

    @NotBlank
    private String age;

    @NotBlank
    private String nickname;

    @NotBlank
    private String phone;
}
