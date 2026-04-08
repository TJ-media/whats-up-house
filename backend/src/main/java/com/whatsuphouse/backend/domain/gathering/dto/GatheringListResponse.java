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
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String locationName;
    private Integer price;
    private int capacity;
    private int applicantCount;
    private String thumbnailUrl;
    private String[] moodTags;
    private String[] activityTags;
    private GatheringStatus status;

    public static GatheringListResponse from(Gathering gathering, int applicantCount) {
        return GatheringListResponse.builder()
                .id(gathering.getId())
                .title(gathering.getTitle())
                .date(gathering.getDate())
                .startTime(gathering.getStartTime())
                .endTime(gathering.getEndTime())
                .locationName(gathering.getLocation() != null ? gathering.getLocation().getName() : null)
                .price(gathering.getPrice())
                .capacity(gathering.getCapacity())
                .applicantCount(applicantCount)
                .thumbnailUrl(gathering.getThumbnailUrl())
                .moodTags(gathering.getMoodTags())
                .activityTags(gathering.getActivityTags())
                .status(gathering.getStatus())
                .build();
    }
}
