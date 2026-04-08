package com.whatsuphouse.backend.domain.application;

import com.whatsuphouse.backend.domain.application.dto.ApplicationRequest;
import com.whatsuphouse.backend.domain.application.dto.ApplicationResponse;
import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import com.whatsuphouse.backend.domain.gathering.Gathering;
import com.whatsuphouse.backend.domain.gathering.GatheringRepository;
import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import com.whatsuphouse.backend.domain.user.User;
import com.whatsuphouse.backend.domain.user.UserRepository;
import com.whatsuphouse.backend.global.exception.CustomException;
import com.whatsuphouse.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final GatheringRepository gatheringRepository;
    private final UserRepository userRepository;

    public ApplicationResponse applyAsUser(UUID gatheringId, UUID userId, ApplicationRequest request) {
        Gathering gathering = getGathering(gatheringId);
        int currentCount = applicationRepository.countByGatheringIdAndStatusNot(gatheringId, ApplicationStatus.CANCELLED);
        validateGathering(gathering, currentCount);

        if (applicationRepository.existsByGatheringIdAndUserId(gatheringId, userId)) {
            throw new CustomException(ErrorCode.ALREADY_APPLIED);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Application application = Application.builder()
                .gathering(gathering)
                .user(user)
                .gender(request.getGender())
                .age(request.getAge())
                .job(request.getJob())
                .mbti(request.getMbti())
                .intro(request.getIntro())
                .referralSource(request.getReferralSource())
                .build();

        return ApplicationResponse.from(applicationRepository.save(application));
    }

    public ApplicationResponse applyAsGuest(UUID gatheringId, ApplicationRequest request) {
        Gathering gathering = getGathering(gatheringId);
        int currentCount = applicationRepository.countByGatheringIdAndStatusNot(gatheringId, ApplicationStatus.CANCELLED);
        validateGathering(gathering, currentCount);

        if (applicationRepository.existsByGatheringIdAndGuestPhone(gatheringId, request.getGuestPhone())) {
            throw new CustomException(ErrorCode.ALREADY_APPLIED);
        }

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

        return ApplicationResponse.from(applicationRepository.save(application));
    }

    private Gathering getGathering(UUID gatheringId) {
        return gatheringRepository.findById(gatheringId)
                .orElseThrow(() -> new CustomException(ErrorCode.GATHERING_NOT_FOUND));
    }

    private void validateGathering(Gathering gathering, int currentCount) {
        if (gathering.getStatus() != GatheringStatus.RECRUITING) {
            throw new CustomException(ErrorCode.GATHERING_NOT_RECRUITING);
        }
        if (currentCount >= gathering.getCapacity()) {
            throw new CustomException(ErrorCode.GATHERING_FULL);
        }
    }
}
