import React, { useContext, useState } from "react";

const ValidationErrorContext = React.createContext();
const ValidationErrorUpdateContext = React.createContext();

export function useValidationError() {
    return useContext(ValidationErrorContext);
}

export function useValidationErrorUpdate() {
    return useContext(ValidationErrorUpdateContext);
}

export function ValidationErrorProvider({ children }) {
    const [validationError, setValidationError] = useState("");

    function specifyValidationError(validationError) {
        validationError.trim().length
            ? setValidationError(validationError)
            : setValidationError("");
    }

    return (
        <ValidationErrorContext.Provider value={validationError}>
            <ValidationErrorUpdateContext.Provider value={specifyValidationError}>
                {children}
            </ValidationErrorUpdateContext.Provider>
        </ValidationErrorContext.Provider>
    )
}