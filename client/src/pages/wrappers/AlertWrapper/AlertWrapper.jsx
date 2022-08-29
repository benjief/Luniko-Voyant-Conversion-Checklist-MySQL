import PropTypes from "prop-types";
import React from "react";
import MaterialAlert from "../../../components/MaterialAlert";

function AlertWrapper({
    alert,
    alertMessage,
    handleAlertClosed,
    alertType,
}) {
    return (
        alert
            ? <div className="alert-container">
                <MaterialAlert
                    message={alertMessage}
                    handleAlertClosed={handleAlertClosed}
                    className={alertType}>
                </MaterialAlert>
                {/* <div className="error-div"></div> */}
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
