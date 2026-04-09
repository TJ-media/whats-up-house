package com.whatsuphouse.backend.domain.user;

import com.whatsuphouse.backend.domain.application.Application;
import com.whatsuphouse.backend.domain.application.ApplicationRepository;
import com.whatsuphouse.backend.domain.application.dto.AdminApplicationResponse;
import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import com.whatsuphouse.backend.domain.user.dto.AdminUserDetailResponse;
import com.whatsuphouse.backend.domain.user.dto.AdminUserListResponse;
import com.whatsuphouse.backend.global.exception.CustomException;
import com.whatsuphouse.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminUserService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public Page<AdminUserListResponse> getUsers(String keyword, Pageable pageable) {
        Page<User> users = (keyword != null && !keyword.isBlank())
                ? userRepository.searchByKeyword(keyword, pageable)
                : userRepository.findAll(pageable);

        return users.map(user -> {
            long count = applicationRepository
                    .countByUserIdAndStatusNot(user.getId(), ApplicationStatus.CANCELLED);
            return AdminUserListResponse.from(user, count);
        });
    }

    public AdminUserDetailResponse getUserDetail(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<AdminApplicationResponse> appHistory = applicationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(AdminApplicationResponse::from)
                .collect(Collectors.toList());

        return AdminUserDetailResponse.from(user, appHistory);
    }

    @Transactional
    public void updateUserStatus(UUID userId, boolean suspend) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (suspend) {
            user.suspend();
        } else {
            user.activate();
        }
    }
}
