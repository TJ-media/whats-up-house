package com.whatsuphouse.backend.domain.location.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ContractStatusConverter implements AttributeConverter<ContractStatus, String> {

    @Override
    public String convertToDatabaseColumn(ContractStatus attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public ContractStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : ContractStatus.valueOf(dbData.toUpperCase());
    }
}
