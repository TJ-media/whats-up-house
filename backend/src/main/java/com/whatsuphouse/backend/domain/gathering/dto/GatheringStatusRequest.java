package com.whatsuphouse.backend.domain.gathering.dto;

import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class GatheringStatusRequest {

    @NotNull
    private GatheringStatus status;
}
