package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface GatheringRepository extends JpaRepository<Gathering, UUID> {

    List<Gathering> findAllByOrderByDateAsc();

    List<Gathering> findByStatus(GatheringStatus status);

    List<Gathering> findByDate(LocalDate date);

    List<Gathering> findByDateAndStatus(LocalDate date, GatheringStatus status);

    @Query("SELECT DISTINCT g.date FROM Gathering g WHERE g.status != :status ORDER BY g.date")
    List<LocalDate> findActiveDates(@Param("status") GatheringStatus status);

    @Query("SELECT DISTINCT g.date FROM Gathering g WHERE g.date >= :start AND g.date <= :end AND g.status != com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus.CANCELLED ORDER BY g.date")
    List<LocalDate> findDistinctDatesByMonth(@Param("start") LocalDate start, @Param("end") LocalDate end);

    long countByDateBetween(LocalDate start, LocalDate end);
}
