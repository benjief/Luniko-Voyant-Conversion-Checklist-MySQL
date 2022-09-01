import React, { useContext, useState } from "react";

const ValidationErrorContext = React.createContext();
const ValidationErrorUpdateContext = React.createContext();

/**
 * Allows a component to access (but not change) the state of ValidationErrorContext. Components in this application will update this context for other components to then access.
 * @returns a function that allows a component to access the state of ValidationErrorContext.
 */
export function useValidationError() {
    return useContext(ValidationErrorContext);
}

/**
 * Allows a component to update the state of ValidationErrorContext.
 * @returns a function that allows a component to update the state of ValidationErrorContext.
 */
export function useValidationErrorUpdate() {
    return useContext(ValidationErrorUpdateContext);
}

/**
 * A context provider that must be wrapped around all components that need access to ValidationErrorContext.
 * @param children - components that need access to ValidationErrorContext
 * @returns a provider (?) that grants access to ValidationErrorContext to all of its descendants. Honesetly, I'm not entirely sure. 
 */
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
