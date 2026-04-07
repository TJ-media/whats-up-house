package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface GatheringRepository extends JpaRepository<Gathering, UUID> {

    List<Gathering> findByDate(LocalDate date);

    List<Gathering> findByDateAndStatus(LocalDate date, GatheringStatus status);

    @Query("SELECT DISTINCT g.date FROM Gathering g WHERE g.status != :status ORDER BY g.date")
    List<LocalDate> findActiveDates(GatheringStatus status);

    long countByDateBetween(LocalDate start, LocalDate end);
}
