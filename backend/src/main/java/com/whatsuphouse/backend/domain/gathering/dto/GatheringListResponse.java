package com.whatsuphouse.backend.domain.gathering.dto;

import com.whatsuphouse.backend.domain.gathering.Gathering;
import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Builder
public class GatheringListResponse {

    private UUID id;
    private String title;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String locationName;
    private Integer price;
    private int maxAttendees;
    private int applicantCount;
    private String thumbnailUrl;
    private GatheringStatus status;

    public static GatheringListResponse from(Gathering gathering, int applicantCount) {
        return GatheringListResponse.builder()
                .id(gathering.getId())
                .title(gathering.getTitle())
                .eventDate(gathering.getEventDate())
                .startTime(gathering.getStartTime())
                .endTime(gathering.getEndTime())
                .locationName(gathering.getLocation() != null ? gathering.getLocation().getName() : null)
                .price(gathering.getPrice())
                .maxAttendees(gathering.getMaxAttendees())
                .applicantCount(applicantCount)
                .thumbnailUrl(gathering.getThumbnailUrl())
                .status(gathering.getStatus())
                .build();
    }
}
