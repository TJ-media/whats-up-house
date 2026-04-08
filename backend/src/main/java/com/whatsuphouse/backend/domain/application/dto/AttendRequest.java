package com.whatsuphouse.backend.domain.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class AttendRequest {

    @NotNull(message = "출석 여부를 선택해주세요.")
    private Boolean attended;
}
