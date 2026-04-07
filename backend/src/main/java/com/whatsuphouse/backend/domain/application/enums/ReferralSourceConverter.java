package com.whatsuphouse.backend.domain.application.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ReferralSourceConverter implements AttributeConverter<ReferralSource, String> {

    @Override
    public String convertToDatabaseColumn(ReferralSource attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public ReferralSource convertToEntityAttribute(String dbData) {
        return dbData == null ? null : ReferralSource.valueOf(dbData.toUpperCase());
    }
}
