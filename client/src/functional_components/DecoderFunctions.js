
/**
 * Returns the expanded name/description for a conversion checklist's conversion type, given said type's shorthand code.
 * @param {string} conversionTypeCode - the conversion type's shorthand code.
 * @returns the conversion type's expanded name/description
 */
function getConversionType(conversionTypeCode) {
    let conversionType = conversionTypeCode === "M" ? "Manual"
        : "DMT"

    return conversionType;
}

/**
 * Returns the expanded name/description for a conversion checklist's additional processing type, given said type's shorthand code.
 * @param {string} conversionTypeCode - the additional processing type's shorthand code.
 * @returns the additional processing type's expanded name/description
 */
function getAdditionalProcessingType(additionalProcessingCode) {
    let additionalProcessing = additionalProcessingCode === "C" ? "Cleanup Needed"
        : additionalProcessingCode === "D" ? "New Data to Be Added"
            : "N/A";

    return additionalProcessing
}

export {
    getConversionType,
    getAdditionalProcessingType
}