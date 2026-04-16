package com.whatsuphouse.backend.domain.gathering;

import com.whatsuphouse.backend.domain.gathering.enums.GatheringStatus;
import com.whatsuphouse.backend.domain.location.Location;
import com.whatsuphouse.backend.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "gatherings")
@Getter
@NoArgsConstructor
public class Gathering extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    private Integer price;

    @Column(name = "max_attendees", nullable = false)
    private int maxAttendees;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GatheringStatus status;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Builder
    public Gathering(String title, String description, Location location,
                     LocalDate eventDate, LocalTime startTime, LocalTime endTime, Integer price,
                     int maxAttendees, GatheringStatus status, String thumbnailUrl) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.maxAttendees = maxAttendees;
        this.status = status;
        this.thumbnailUrl = thumbnailUrl;
    }

    public void updateStatus(GatheringStatus status) {
        this.status = status;
    }

    public void update(String title, String description, Location location,
                       LocalDate eventDate, LocalTime startTime, LocalTime endTime, Integer price,
                       int maxAttendees, String thumbnailUrl) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.maxAttendees = maxAttendees;
        this.thumbnailUrl = thumbnailUrl;
    }
}
