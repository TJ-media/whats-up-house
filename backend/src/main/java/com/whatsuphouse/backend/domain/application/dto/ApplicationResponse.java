package com.whatsuphouse.backend.domain.application.dto;

import com.whatsuphouse.backend.domain.application.Application;
import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class ApplicationResponse {

    private UUID id;
    private UUID gatheringId;
    private ApplicationStatus status;

    public static ApplicationResponse from(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .gatheringId(application.getGathering().getId())
                .status(application.getStatus())
                .build();
    }
}
