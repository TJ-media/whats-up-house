package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.application.ApplicationRepository;
import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import com.whatsuphouse.backend.domain.gathering.dto.*;
import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import com.whatsuphouse.backend.domain.location.Location;
import com.whatsuphouse.backend.domain.location.LocationRepository;
import com.whatsuphouse.backend.global.exception.CustomException;
import com.whatsuphouse.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminGatheringService {

    private final GatheringRepository gatheringRepository;
    private final LocationRepository locationRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public List<AdminGatheringListResponse> getGatherings(GatheringStatus status, LocalDate date) {
        List<Gathering> gatherings;

        if (status != null && date != null) {
            gatherings = gatheringRepository.findByEventDateAndStatus(date, status);
        } else if (status != null) {
            gatherings = gatheringRepository.findByStatus(status);
        } else if (date != null) {
            gatherings = gatheringRepository.findByEventDate(date);
        } else {
            gatherings = gatheringRepository.findAllByOrderByEventDateAsc();
        }

        return gatherings.stream()
                .map(g -> AdminGatheringListResponse.from(g,
                        applicationRepository.countByGatheringIdAndStatusNot(g.getId(), ApplicationStatus.CANCELLED)))
                .toList();
    }

    public GatheringDetailResponse createGathering(GatheringCreateRequest request) {
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));

        Gathering gathering = Gathering.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(location)
                .eventDate(request.getEventDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .price(request.getPrice())
                .maxAttendees(request.getMaxAttendees())
                .status(request.getStatus())
                .thumbnailUrl(request.getThumbnailUrl())
                .build();

        return GatheringDetailResponse.from(gatheringRepository.save(gathering), 0, 0.0, 0);
    }

    public GatheringDetailResponse updateGathering(UUID id, GatheringUpdateRequest request) {
        Gathering gathering = getGathering(id);
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));

        gathering.update(request.getTitle(), request.getDescription(), location,
                request.getEventDate(), request.getStartTime(), request.getEndTime(),
                request.getPrice(), request.getMaxAttendees(), request.getThumbnailUrl());

        int applicantCount = applicationRepository.countByGatheringIdAndStatusNot(id, ApplicationStatus.CANCELLED);
        return GatheringDetailResponse.from(gathering, applicantCount, 0.0, 0);
    }

    public void updateStatus(UUID id, GatheringStatusRequest request) {
        getGathering(id).updateStatus(request.getStatus());
    }

    public void deleteGathering(UUID id) {
        getGathering(id).updateStatus(GatheringStatus.CANCELLED);
    }

    private Gathering getGathering(UUID id) {
        return gatheringRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.GATHERING_NOT_FOUND));
    }
}
