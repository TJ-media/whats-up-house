package com.whatsuphouse.backend.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class RecentActivityResponse {

    private String type;           // PENDING, CANCELLED, ATTENDED
    private String userNickname;
    private String gatheringTitle;
    private LocalDateTime createdAt;
}
