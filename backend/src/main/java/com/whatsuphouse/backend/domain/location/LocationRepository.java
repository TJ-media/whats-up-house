package com.whatsuphouse.backend.domain.location;

import com.whatsuphouse.backend.domain.location.enums.LocationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {

    List<Location> findByStatus(LocationStatus status);
}
