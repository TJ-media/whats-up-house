package com.whatsuphouse.backend.domain.user.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class JobConverter implements AttributeConverter<Job, String> {

    @Override
    public String convertToDatabaseColumn(Job attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public Job convertToEntityAttribute(String dbData) {
        return dbData == null ? null : Job.valueOf(dbData.toUpperCase());
    }
}
