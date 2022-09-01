import PropTypes from "prop-types";
import React from "react";
import MaterialAlert from "../../../components/MaterialAlert";

/**
 * Component that renders if an error has been thrown on a page. Essentially a blank page with an alert displayed at the top.
 * @returns said component.
 */
function AlertWrapper({
    alert, // whether or not an alert is being displayed on the page
    alertMessage, // text displayed by an active alert
    handleAlertClosed, // function to be called upon alert closure
    alertType, // "success-alert" or "error-alert" - this is used for css styling
}) {
    return (
        alert
            ? <div className="alert-container">
                <MaterialAlert
                    message={alertMessage}
                    handleAlertClosed={handleAlertClosed}
                    className={alertType}>
                </MaterialAlert>
            </div>
            : <div></div>
    )
};

AlertWrapper.propTypes = {
    alert: PropTypes.bool,
    alertMessage: PropTypes.string,
    handleAlertClosed: PropTypes.func,
    alertType: PropTypes.string,
};

AlertWrapper.defaultProps = {
    alert: false,
    alertMessage: "",
    handleAlertClosed: () => { },
    alertType: "",
};

export default AlertWrapper;
