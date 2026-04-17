package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.application.ApplicationRepository;
import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import com.whatsuphouse.backend.domain.gathering.dto.GatheringCalendarResponse;
import com.whatsuphouse.backend.domain.gathering.dto.GatheringDetailResponse;
import com.whatsuphouse.backend.domain.gathering.dto.GatheringListResponse;
import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import com.whatsuphouse.backend.global.exception.CustomException;
import com.whatsuphouse.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GatheringService {

    private final GatheringRepository gatheringRepository;
    private final ApplicationRepository applicationRepository;

    private static final List<ApplicationStatus> ACTIVE_STATUSES =
            List.of(ApplicationStatus.PENDING, ApplicationStatus.ATTENDED);

    private static final List<GatheringStatus> EXCLUDED_STATUSES =
            List.of(GatheringStatus.CANCELLED, GatheringStatus.COMPLETED);

    public List<GatheringListResponse> getGatheringsByDate(LocalDate date) {
        return gatheringRepository.findByEventDateAndStatusNotIn(date, EXCLUDED_STATUSES)
                .stream()
                .map(g -> GatheringListResponse.from(g,
                        applicationRepository.countByGatheringIdAndStatusIn(g.getId(), ACTIVE_STATUSES)))
                .toList();
    }

    public GatheringDetailResponse getGatheringDetail(UUID id) {
        Gathering gathering = gatheringRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.GATHERING_NOT_FOUND));
        long count = applicationRepository.countByGatheringIdAndStatusIn(gathering.getId(), ACTIVE_STATUSES);
        return GatheringDetailResponse.from(gathering, count);
    }

    /* 태정 문의 필요 */
    public GatheringCalendarResponse getCalendar(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<LocalDate> dates = gatheringRepository.findDistinctDatesByMonth(start, end);

        return GatheringCalendarResponse.builder()
                .year(year)
                .month(month)
                .dates(dates)
                .build();
    }
}
