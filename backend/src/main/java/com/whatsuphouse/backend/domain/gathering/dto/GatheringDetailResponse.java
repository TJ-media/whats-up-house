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
    private String[] howToRun;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String locationName;
    private String address;
    private String addressDetail;
    private Integer price;
    private int capacity;
    private int applicantCount;
    private String thumbnailUrl;
    private String[] photoUrls;
    private String[] moodTags;
    private String[] activityTags;
    private int mileageReward;
    private double averageRating;
    private int reviewCount;
    private GatheringStatus status;

    public static GatheringDetailResponse from(Gathering gathering, int applicantCount,
                                                double averageRating, int reviewCount) {
        return GatheringDetailResponse.builder()
                .id(gathering.getId())
                .title(gathering.getTitle())
                .description(gathering.getDescription())
                .howToRun(gathering.getHowToRun())
                .date(gathering.getDate())
                .startTime(gathering.getStartTime())
                .endTime(gathering.getEndTime())
                .locationName(gathering.getLocation() != null ? gathering.getLocation().getName() : null)
                .address(gathering.getLocation() != null ? gathering.getLocation().getAddress() : null)
                .addressDetail(gathering.getLocation() != null ? gathering.getLocation().getAddressDetail() : null)
                .price(gathering.getPrice())
                .capacity(gathering.getCapacity())
                .applicantCount(applicantCount)
                .thumbnailUrl(gathering.getThumbnailUrl())
                .photoUrls(gathering.getPhotoUrls())
                .moodTags(gathering.getMoodTags())
                .activityTags(gathering.getActivityTags())
                .mileageReward(gathering.getMileageReward())
                .averageRating(averageRating)
                .reviewCount(reviewCount)
                .status(gathering.getStatus())
                .build();
    }
}
