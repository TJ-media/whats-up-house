package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface GatheringRepository extends JpaRepository<Gathering, UUID> {

    List<Gathering> findAllByOrderByEventDateAsc();

    List<Gathering> findByStatus(GatheringStatus status);

    List<Gathering> findByEventDate(LocalDate eventDate);

    List<Gathering> findByEventDateAndStatus(LocalDate eventDate, GatheringStatus status);

    @Query("SELECT DISTINCT g.eventDate FROM Gathering g WHERE g.status != :status ORDER BY g.eventDate")
    List<LocalDate> findActiveDates(@Param("status") GatheringStatus status);

    @Query("SELECT DISTINCT g.eventDate FROM Gathering g WHERE g.eventDate >= :start AND g.eventDate <= :end AND g.status != com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus.CANCELLED ORDER BY g.eventDate")
    List<LocalDate> findDistinctDatesByMonth(@Param("start") LocalDate start, @Param("end") LocalDate end);

    long countByEventDateBetween(LocalDate start, LocalDate end);
}
