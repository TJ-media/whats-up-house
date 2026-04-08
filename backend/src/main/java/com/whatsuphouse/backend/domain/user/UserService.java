package com.whatsuphouse.backend.domain.user;

import com.whatsuphouse.backend.domain.user.dto.*;
import com.whatsuphouse.backend.global.auth.JwtTokenProvider;
import com.whatsuphouse.backend.global.auth.UserPrincipal;
import com.whatsuphouse.backend.global.exception.CustomException;
import com.whatsuphouse.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public ProfileResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .build();

        user.updateProfile(
                request.getNickname(), request.getBio(), request.getGender(), request.getAge(),
                request.getJob(), request.getMbti(), request.getAnimalType(), request.getAnimalColor(),
                request.getAnimalPose(), request.getInterests(), request.getAvatarUrl()
        );

        return ProfileResponse.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        UserPrincipal principal = new UserPrincipal(user.getId(), user.getEmail(), user.isAdmin());
        String token = jwtTokenProvider.generateToken(principal);

        return LoginResponse.builder()
                .accessToken(token)
                .user(ProfileResponse.from(user))
                .build();
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return ProfileResponse.from(user);
    }

    public ProfileResponse updateProfile(UUID userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        user.updateProfile(
                request.getNickname(), request.getBio(), request.getGender(), request.getAge(),
                request.getJob(), request.getMbti(), request.getAnimalType(), request.getAnimalColor(),
                request.getAnimalPose(), request.getInterests(), request.getAvatarUrl()
        );

        return ProfileResponse.from(user);
    }

    @Transactional(readOnly = true)
    public boolean checkNickname(String nickname) {
        return !userRepository.existsByNickname(nickname);
    }

    @Transactional(readOnly = true)
    public boolean checkEmail(String email) {
        return !userRepository.existsByEmail(email);
    }
}
