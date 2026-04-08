package com.whatsuphouse.backend.domain.location;

import com.whatsuphouse.backend.domain.location.dto.LocationCreateRequest;
import com.whatsuphouse.backend.domain.location.dto.LocationResponse;
import com.whatsuphouse.backend.global.exception.CustomException;
import com.whatsuphouse.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminLocationService {

    private final LocationRepository locationRepository;

    @Transactional(readOnly = true)
    public List<LocationResponse> getLocations() {
        return locationRepository.findAll().stream()
                .map(LocationResponse::from)
                .toList();
    }

    public LocationResponse createLocation(LocationCreateRequest request) {
        Location location = Location.builder()
                .name(request.getName())
                .address(request.getAddress())
                .addressDetail(request.getAddressDetail())
                .maxCapacity(request.getMaxCapacity())
                .features(request.getFeatures())
                .contractStatus(request.getContractStatus())
                .memo(request.getMemo())
                .build();
        return LocationResponse.from(locationRepository.save(location));
    }

    public LocationResponse updateLocation(UUID id, LocationCreateRequest request) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));
        location.update(request.getName(), request.getAddress(), request.getAddressDetail(),
                request.getMaxCapacity(), request.getFeatures(), request.getContractStatus(), request.getMemo());
        return LocationResponse.from(location);
    }

    public void deleteLocation(UUID id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.LOCATION_NOT_FOUND));
        locationRepository.delete(location);
    }
}
