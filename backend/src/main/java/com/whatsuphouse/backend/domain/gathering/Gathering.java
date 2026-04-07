package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import com.whatsuphouse.backend.domain.location.Location;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "gatherings")
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Gathering {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "how_to_run", columnDefinition = "text[]")
    private String[] howToRun;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    private Integer price;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private GatheringStatus status;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "photo_urls", columnDefinition = "text[]")
    private String[] photoUrls;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "mood_tags", columnDefinition = "text[]")
    private String[] moodTags;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "activity_tags", columnDefinition = "text[]")
    private String[] activityTags;

    @Column(name = "mileage_reward", nullable = false)
    private int mileageReward = 500;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public Gathering(String title, String description, String[] howToRun, Location location,
                     LocalDate date, LocalTime startTime, LocalTime endTime, Integer price,
                     int capacity, GatheringStatus status, String thumbnailUrl, String[] photoUrls,
                     String[] moodTags, String[] activityTags, int mileageReward) {
        this.title = title;
        this.description = description;
        this.howToRun = howToRun;
        this.location = location;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.capacity = capacity;
        this.status = status;
        this.thumbnailUrl = thumbnailUrl;
        this.photoUrls = photoUrls;
        this.moodTags = moodTags;
        this.activityTags = activityTags;
        this.mileageReward = mileageReward;
    }

    public void updateStatus(GatheringStatus status) {
        this.status = status;
    }

    public void update(String title, String description, String[] howToRun, Location location,
                       LocalDate date, LocalTime startTime, LocalTime endTime, Integer price,
                       int capacity, String thumbnailUrl, String[] photoUrls,
                       String[] moodTags, String[] activityTags, int mileageReward) {
        this.title = title;
        this.description = description;
        this.howToRun = howToRun;
        this.location = location;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.capacity = capacity;
        this.thumbnailUrl = thumbnailUrl;
        this.photoUrls = photoUrls;
        this.moodTags = moodTags;
        this.activityTags = activityTags;
        this.mileageReward = mileageReward;
    }
}
