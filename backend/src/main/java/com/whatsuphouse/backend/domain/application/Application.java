package com.whatsuphouse.backend.domain.application;

import com.whatsuphouse.backend.domain.application.enums.ApplicationStatus;
import com.whatsuphouse.backend.domain.application.enums.ReferralSource;
import com.whatsuphouse.backend.domain.gathering.Gathering;
import com.whatsuphouse.backend.domain.user.User;
import com.whatsuphouse.backend.domain.user.enums.Gender;
import com.whatsuphouse.backend.domain.user.enums.Job;
import com.whatsuphouse.backend.domain.user.enums.Mbti;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications")
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gathering_id", nullable = false)
    private Gathering gathering;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "applicant_phone")
    private String applicantPhone;

    private Gender gender;

    private Integer age;

    private Job job;

    @Enumerated(EnumType.STRING)
    private Mbti mbti;

    private String intro;

    @Column(name = "referral_source")
    private ReferralSource referralSource;

    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public Application(Gathering gathering, User user, String applicantName, String applicantPhone,
                       Gender gender, Integer age, Job job, Mbti mbti, String intro,
                       ReferralSource referralSource) {
        this.gathering = gathering;
        this.user = user;
        this.applicantName = applicantName;
        this.applicantPhone = applicantPhone;
        this.gender = gender;
        this.age = age;
        this.job = job;
        this.mbti = mbti;
        this.intro = intro;
        this.referralSource = referralSource;
        this.status = ApplicationStatus.PENDING;
    }

    public void cancel() {
        this.status = ApplicationStatus.CANCELLED;
    }

    public void toPending() {
        this.status = ApplicationStatus.PENDING;
    }

    public void toAttended() {
        this.status = ApplicationStatus.ATTENDED;
    }
}
