package com.whatsuphouse.backend.domain.user.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AnimalPoseConverter implements AttributeConverter<AnimalPose, String> {

    @Override
    public String convertToDatabaseColumn(AnimalPose attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public AnimalPose convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AnimalPose.valueOf(dbData.toUpperCase());
    }
}
