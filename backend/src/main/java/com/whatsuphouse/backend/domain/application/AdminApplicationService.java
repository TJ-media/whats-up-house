package com.whatsuphouse.backend.domain.application;

import com.whatsuphouse.backend.domain.application.dto.AdminApplicationResponse;
import com.whatsuphouse.backend.domain.application.dto.ApplicationRequest;
import com.whatsuphouse.backend.domain.application.dto.AttendRequest;
import com.whatsuphouse.backend.domain.gathering.Gathering;
import com.whatsuphouse.backend.domain.gathering.GatheringRepository;
import com.whatsuphouse.backend.global.exception.CustomException;
import com.whatsuphouse.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminApplicationService {

    private final ApplicationRepository applicationRepository;
    private final GatheringRepository gatheringRepository;

    @Transactional(readOnly = true)
    public List<AdminApplicationResponse> getApplications(UUID gatheringId) {
        return applicationRepository.findActiveByGatheringIdWithUser(gatheringId).stream()
                .map(AdminApplicationResponse::from)
                .toList();
    }

    public AdminApplicationResponse updateAttend(UUID id, AttendRequest request) {
        Application application = getApplication(id);
        if (request.getAttended()) {
            application.toAttended();
        } else {
            application.toPending();
        }
        return AdminApplicationResponse.from(application);
    }

    public AdminApplicationResponse addApplication(UUID gatheringId, ApplicationRequest request) {
        Gathering gathering = gatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new CustomException(ErrorCode.GATHERING_NOT_FOUND));

        Application application = Application.builder()
                .gathering(gathering)
                .guestName(request.getGuestName())
                .guestPhone(request.getGuestPhone())
                .gender(request.getGender())
                .age(request.getAge())
                .job(request.getJob())
                .mbti(request.getMbti())
                .intro(request.getIntro())
                .referralSource(request.getReferralSource())
                .build();

        return AdminApplicationResponse.from(applicationRepository.save(application));
    }

    public void deleteApplication(UUID id) {
        getApplication(id).cancel();
    }

    private Application getApplication(UUID id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.APPLICATION_NOT_FOUND));
    }
}
