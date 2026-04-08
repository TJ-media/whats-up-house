package com.whatsuphouse.backend.domain.gathering.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class GatheringStatusConverter implements AttributeConverter<GatheringStatus, String> {

    @Override
    public String convertToDatabaseColumn(GatheringStatus attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public GatheringStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : GatheringStatus.valueOf(dbData.toUpperCase());
    }
}
