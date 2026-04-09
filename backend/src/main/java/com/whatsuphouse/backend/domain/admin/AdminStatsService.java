package com.whatsuphouse.backend.domain.admin;

import com.whatsuphouse.backend.domain.admin.dto.*;
import com.whatsuphouse.backend.domain.application.Application;
import com.whatsuphouse.backend.domain.application.ApplicationRepository;
import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import com.whatsuphouse.backend.domain.gathering.Gathering;
import com.whatsuphouse.backend.domain.gathering.GatheringRepository;
import com.whatsuphouse.backend.domain.gathering.dto.AdminGatheringListResponse;
import com.whatsuphouse.backend.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatsService {

    private final UserRepository userRepository;
    private final GatheringRepository gatheringRepository;
    private final ApplicationRepository applicationRepository;

    public DashboardResponse getDashboard() {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        long totalMembers = userRepository.count();
        long thisMonthGatherings = gatheringRepository.countByDateBetween(monthStart, today);
        int thisMonthRevenue = calculateMonthlyRevenue(monthStart, today);
        long todayNew = applicationRepository.countByCreatedAtAfter(today.atStartOfDay());

        List<Gathering> thisWeek = gatheringRepository
                .findByDateBetweenOrderByDateAscStartTimeAsc(today, today.plusDays(7));
        List<AdminGatheringListResponse> weekGatherings = thisWeek.stream()
                .map(g -> {
                    int count = applicationRepository
                            .countByGatheringIdAndStatusNot(g.getId(), ApplicationStatus.CANCELLED);
                    return AdminGatheringListResponse.from(g, count);
                })
                .collect(Collectors.toList());

        List<RecentActivityResponse> recentActivities = applicationRepository
                .findTop20ByOrderByCreatedAtDesc()
                .stream()
                .map(app -> RecentActivityResponse.builder()
                        .type(app.getStatus().name())
                        .userNickname(app.getUser() != null
                                ? app.getUser().getNickname() : app.getGuestName())
                        .gatheringTitle(app.getGathering().getTitle())
                        .createdAt(app.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalMembers(totalMembers)
                .thisMonthGatherings(thisMonthGatherings)
                .thisMonthRevenue(thisMonthRevenue)
                .todayNewApplications(todayNew)
                .thisWeekGatherings(weekGatherings)
                .recentActivities(recentActivities)
                .build();
    }

    public MonitoringResponse getMonitoring() {
        LocalDate today = LocalDate.now();

        List<GatheringMonitoringDto> upcomingGatherings = gatheringRepository
                .findByDateGreaterThanEqualOrderByDateAscStartTimeAsc(today)
                .stream()
                .map(g -> {
                    int currentApplicants = applicationRepository
                            .countByGatheringIdAndStatusNot(g.getId(), ApplicationStatus.CANCELLED);
                    int attendedCount = applicationRepository
                            .countByGatheringIdAndStatus(g.getId(), ApplicationStatus.ATTENDED);
                    long daysUntil = ChronoUnit.DAYS.between(today, g.getDate());

                    return GatheringMonitoringDto.builder()
                            .gatheringId(g.getId())
                            .title(g.getTitle())
                            .date(g.getDate())
                            .startTime(g.getStartTime())
                            .endTime(g.getEndTime())
                            .locationName(g.getLocation() != null ? g.getLocation().getName() : null)
                            .status(g.getStatus().name())
                            .capacity(g.getCapacity())
                            .currentApplicants(currentApplicants)
                            .attendedCount(attendedCount)
                            .daysUntil(daysUntil)
                            .build();
                })
                .collect(Collectors.toList());

        return MonitoringResponse.builder()
                .upcomingGatherings(upcomingGatherings)
                .build();
    }

    private int calculateMonthlyRevenue(LocalDate start, LocalDate end) {
        return gatheringRepository.findByDateBetweenOrderByDateAscStartTimeAsc(start, end)
                .stream()
                .mapToInt(g -> {
                    if (g.getPrice() == null) return 0;
                    int attendedCount = applicationRepository
                            .countByGatheringIdAndStatus(g.getId(), ApplicationStatus.ATTENDED);
                    return g.getPrice() * attendedCount;
                })
                .sum();
    }
}
