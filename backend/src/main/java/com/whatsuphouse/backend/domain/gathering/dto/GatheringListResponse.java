package com.whatsuphouse.backend.domain.gathering.dto;

import com.whatsuphouse.backend.domain.gathering.Gathering;
import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import com.whatsuphouse.backend.domain.location.Location;
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
    private Integer price;
    private int maxAttendees;
    private long currentApplicants;
    private String status;
    private String thumbnailUrl;
    private LocationDto location;

    @Getter
    @Builder
    public static class LocationDto {
        private UUID id;
        private String name;
    }

    public static GatheringListResponse from(Gathering gathering, long currentApplicants) {
        Location loc = gathering.getLocation();
        return GatheringListResponse.builder()
                .id(gathering.getId())
                .title(gathering.getTitle())
                .eventDate(gathering.getEventDate())
                .startTime(gathering.getStartTime())
                .endTime(gathering.getEndTime())
                .price(gathering.getPrice())
                .maxAttendees(gathering.getMaxAttendees())
                .currentApplicants(currentApplicants)
                .status(mapStatus(gathering.getStatus()))
                .thumbnailUrl(gathering.getThumbnailUrl())
                .location(loc != null
                        ? LocationDto.builder().id(loc.getId()).name(loc.getName()).build()
                        : null)
                .build();
    }

    private static String mapStatus(GatheringStatus status) {
        return switch (status) {
            case RECRUITING -> "RECRUITING";
            case CLOSED -> "CLOSED";
            default -> status.name();
        };
    }
}
