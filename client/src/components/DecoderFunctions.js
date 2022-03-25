function getConversionType(conversionTypeCode) {
    let conversionType = conversionTypeCode === "M" ? "Manual"
        : "DMT"

    return conversionType;
}

function getAdditionalProcessingType(additionalProcessingCode) {
    let additionalProcessing = additionalProcessingCode === "C" ? "Cleanup Needed"
        : additionalProcessingCode === "D" ? "New Data to Be Added"
            : "N/A";

    return additionalProcessing
}

export {
    getConversionType as getConversionType,
    getAdditionalProcessingType as getAdditionalProcessingType
}