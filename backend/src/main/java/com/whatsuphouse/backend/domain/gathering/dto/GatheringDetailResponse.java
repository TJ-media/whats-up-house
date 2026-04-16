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
public class GatheringDetailResponse {

    private UUID id;
    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String locationName;
    private String address;
    private Integer price;
    private int maxAttendees;
    private int applicantCount;
    private String thumbnailUrl;
    private double averageRating;
    private int reviewCount;
    private GatheringStatus status;

    public static GatheringDetailResponse from(Gathering gathering, int applicantCount,
                                                double averageRating, int reviewCount) {
        return GatheringDetailResponse.builder()
                .id(gathering.getId())
                .title(gathering.getTitle())
                .description(gathering.getDescription())
                .eventDate(gathering.getEventDate())
                .startTime(gathering.getStartTime())
                .endTime(gathering.getEndTime())
                .locationName(gathering.getLocation() != null ? gathering.getLocation().getName() : null)
                .address(gathering.getLocation() != null ? gathering.getLocation().getAddress() : null)
                .price(gathering.getPrice())
                .maxAttendees(gathering.getMaxAttendees())
                .applicantCount(applicantCount)
                .thumbnailUrl(gathering.getThumbnailUrl())
                .averageRating(averageRating)
                .reviewCount(reviewCount)
                .status(gathering.getStatus())
                .build();
    }
}
