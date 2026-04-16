package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.gathering.dto.GatheringCalendarResponse;
import com.whatsuphouse.backend.domain.gathering.dto.GatheringDetailResponse;
import com.whatsuphouse.backend.domain.gathering.dto.GatheringListResponse;
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

    public List<GatheringListResponse> getGatheringsByDate(LocalDate date) {
        return gatheringRepository.findByEventDate(date).stream()
                .map(gathering -> GatheringListResponse.from(gathering, 0))
                .toList();
    }

    public GatheringDetailResponse getGatheringDetail(UUID id) {
        Gathering gathering = gatheringRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.GATHERING_NOT_FOUND));
        return GatheringDetailResponse.from(gathering, 0, 0.0, 0);
    }

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
