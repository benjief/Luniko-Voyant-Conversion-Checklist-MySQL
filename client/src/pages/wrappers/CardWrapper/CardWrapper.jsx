import PropTypes from "prop-types";
import React from "react";

function CardWrapper({
    children,
    rendering,
    alert,
    isErrorThrown,
    preConversionChecklist,
    postConversionChecklist,
    testScriptName,
    isTestingSessionBeingDeleted,
    isStepBeingAddedOrRemoved,
}) {

    return (
        rendering || alert
            ? <div></div>
            : isErrorThrown
                ? <div></div>
                : <div className={preConversionChecklist
                    ? "create-or-modify-pre-conversion-checklist"
                    : postConversionChecklist
                        ? "create-or-modify-post-conversion-checklist"
                        : "view-conversion-checklist"}>
                    <div className="page-message">
                        {preConversionChecklist || postConversionChecklist
                            ? "Please Fill in the Fields Below:"
                            : "View Your Checklist Below:"}
                    </div>
                    <div className={
                        preConversionChecklist
                            ? "create-or-modify-pre-conversion-checklist-container"
                            : postConversionChecklist
                                ? "create-or-modify-post-conversion-checklist-container"
                                : "view-conversion-checklist-container"}>
                        <div className={
                            preConversionChecklist
                                ? "create-or-modify-pre-conversion-checklist-card"
                                : postConversionChecklist
                                    ? "create-or-modify-post-conversion-checklist-card"
                                    : "view-conversion-checklist-card"}>
                            {children}
                        </div>
                    </div>
                </div>
    )
};

// TODO: example prop types (document these elsewhere)
CardWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    rendering: PropTypes.bool,
    alert: PropTypes.bool,
    isErrorThrown: PropTypes.bool,
    preConversionChecklist: PropTypes.bool,
    postConversionChecklist: PropTypes.bool,
    testScriptName: PropTypes.string,
    isTestingSessionBeingDeleted: PropTypes.bool,
    isStepBeingAddedOrRemoved: PropTypes.bool,
}

CardWrapper.defaultProps = {
    rendering: false,
    alert: false,
    isErrorThrown: false,
    preConversionChecklist: false,
    postConversionChecklist: false,
    testScriptName: "",
    isTestingSessionBeingDeleted: false,
    isStepBeingAddedOrRemoved: false,
}

export default CardWrapper;
