package com.whatsuphouse.backend.domain.user;

import com.whatsuphouse.backend.domain.user.enums.*;
import com.whatsuphouse.backend.global.exception.CustomException;
import com.whatsuphouse.backend.global.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String nickname;

    private String name;

    private String phone;

    @Column(nullable = false)
    private String password;

    private String bio;

    private Gender gender;

    private Integer age;

    private Job job;

    @Enumerated(EnumType.STRING)
    private Mbti mbti;

    @Column(name = "animal_type")
    private AnimalType animalType;

    @Column(name = "animal_color")
    private String animalColor;

    @Column(name = "animal_pose")
    private AnimalPose animalPose;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private String[] interests;

    @Column(nullable = false)
    private int mileage = 0;

    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin = false;

    @Column(name = "is_suspended", nullable = false)
    private boolean isSuspended = false;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public User(String email, String nickname, String password, String name, String phone) {
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.name = name;
        this.phone = phone;
    }

    public void updateProfile(String nickname, String name, String phone, String bio, Gender gender, Integer age,
                               Job job, Mbti mbti, AnimalType animalType, String animalColor,
                               AnimalPose animalPose, String[] interests, String avatarUrl) {
        this.nickname = nickname;
        this.name = name;
        this.phone = phone;
        this.bio = bio;
        this.gender = gender;
        this.age = age;
        this.job = job;
        this.mbti = mbti;
        this.animalType = animalType;
        this.animalColor = animalColor;
        this.animalPose = animalPose;
        this.interests = interests;
        this.avatarUrl = avatarUrl;
    }

    public void addMileage(int amount) {
        this.mileage += amount;
    }

    public void useMileage(int amount) {
        if (this.mileage < amount) {
            throw new CustomException(ErrorCode.MILEAGE_NOT_ENOUGH);
        }
        this.mileage -= amount;
    }

    public void suspend() {
        this.isSuspended = true;
    }

    public void activate() {
        this.isSuspended = false;
    }
}
