package com.whatsuphouse.backend.domain.application;

import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    List<Application> findByGatheringId(UUID gatheringId);

    boolean existsByGatheringIdAndUserId(UUID gatheringId, UUID userId);

    boolean existsByGatheringIdAndGuestPhone(UUID gatheringId, String guestPhone);

    int countByGatheringIdAndStatusNot(UUID gatheringId, ApplicationStatus status);
}
