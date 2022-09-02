import PropTypes from "prop-types";
import React from "react";

/**
 * Component that structures this application's checklist-related pages (i.e. CreateOrModifyPre/PostConversionChecklist.js, ViewConversionChecklist.js and DeleteChecklist.js).
 * @returns said component.
 */
function CardWrapper({
    children, // components to be displayed within the structured divs below
    rendering, // whether or not the page is rendering
    alert, // whether or not an alert is being displayed on the page
    isErrorThrown, // whether or not an error has been thrown on the page
    preConversionChecklist, // whether or not the current page's functionality has to do with pre-conversion checklists
    postConversionChecklist, // whether or not the current page's functionality has to do with post-conversion checklists
    isUserDeletingChecklist, // whether or not the user is currently deleting a checklist
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
                        : isUserDeletingChecklist
                            ? "delete-conversion-checklist"
                            : "view-conversion-checklist"}>
                    <div className="page-message">
                        {preConversionChecklist || postConversionChecklist
                            ? "Please Fill in the Fields Below:"
                            : isUserDeletingChecklist
                                ? "Enter the Name of the Checklist to Delete Below"
                                : "View Your Checklist Below:"}
                    </div>
                    <div className={
                        preConversionChecklist
                            ? "create-or-modify-pre-conversion-checklist-container"
                            : postConversionChecklist
                                ? "create-or-modify-post-conversion-checklist-container"
                                : isUserDeletingChecklist
                                    ? "delete-conversion-checklist-container"
                                    : "view-conversion-checklist-container"}>
                        <div className={
                            preConversionChecklist
                                ? "create-or-modify-pre-conversion-checklist-card"
                                : postConversionChecklist
                                    ? "create-or-modify-post-conversion-checklist-card"
                                    : isUserDeletingChecklist
                                        ? "delete-conversion-checklist-card"
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
    isUserDeletingChecklist: PropTypes.bool,
}

CardWrapper.defaultProps = {
    rendering: false,
    alert: false,
    isErrorThrown: false,
    preConversionChecklist: false,
    postConversionChecklist: false,
    isUserDeletingChecklist: false,
}

export default CardWrapper;
