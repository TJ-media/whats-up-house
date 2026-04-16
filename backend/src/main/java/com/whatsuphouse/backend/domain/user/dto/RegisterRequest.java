package com.whatsuphouse.backend.domain.user.dto;

import com.whatsuphouse.backend.domain.user.enums.Gender;
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
