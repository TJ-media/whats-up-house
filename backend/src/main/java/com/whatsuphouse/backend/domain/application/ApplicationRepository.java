package com.whatsuphouse.backend.domain.application;

import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    List<Application> findByGatheringId(UUID gatheringId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT a FROM Application a LEFT JOIN FETCH a.user WHERE a.gathering.id = :gatheringId AND a.status <> 'CANCELLED' ORDER BY a.createdAt ASC"
    )
    List<Application> findActiveByGatheringIdWithUser(@org.springframework.data.repository.query.Param("gatheringId") UUID gatheringId);

    boolean existsByGatheringIdAndUserId(UUID gatheringId, UUID userId);

    boolean existsByGatheringIdAndApplicantPhone(UUID gatheringId, String applicantPhone);

    int countByGatheringIdAndStatusNot(UUID gatheringId, ApplicationStatus status);

    long countByCreatedAtAfter(LocalDateTime dateTime);

    List<Application> findTop20ByOrderByCreatedAtDesc();

    int countByGatheringIdAndStatus(UUID gatheringId, ApplicationStatus status);

    long countByUserIdAndStatusNot(UUID userId, ApplicationStatus status);

    List<Application> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
