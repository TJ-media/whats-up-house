package com.whatsuphouse.backend.domain.user.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AnimalTypeConverter implements AttributeConverter<AnimalType, String> {

    @Override
    public String convertToDatabaseColumn(AnimalType attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public AnimalType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AnimalType.valueOf(dbData.toUpperCase());
    }
}
