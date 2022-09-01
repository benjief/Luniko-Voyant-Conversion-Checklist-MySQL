import PropTypes from 'prop-types';
import React from 'react';
import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

/**
 * General purpose submit button that gets used in many of this application's components.
 * @returns said button.
 */
function SubmitButton({
    className,
    submitButtonText, // text displayed on the submit button
    isSubmitButtonDisabled, // whether or not the submit button is disabled
    displayFadingBalls, // whether or not a set of fading balls is displayed on the submit button (to indicate that the page is working on a request)
    handleOnClick, // whether or not a callback function is called that handles submission in the parent component
    handleOnClickFunction, // callback function that handles submission in the parent component
}) {
    return (
        <button
            className={className}
            disabled={isSubmitButtonDisabled}
            onClick={handleOnClick ? handleOnClickFunction : undefined}>
            {displayFadingBalls ?
                <div className="fading-balls-container">
                    <FadingBalls
                        className="spinner"
                        color="white"
                        width="9px"
                        height="9px"
                        duration="0.5s"
                    />
                </div> :
                <p>{submitButtonText}</p>}
        </button>
    )
};

SubmitButton.propTypes = {
    className: PropTypes.string,
    submitButtonText: PropTypes.string,
    isSubmitButtonDisabled: PropTypes.bool,
    displayFadingBalls: PropTypes.bool,
    handleOnClick: PropTypes.bool,
    handleOnClickFunction: PropTypes.func,
};

SubmitButton.defaultProps = {
    className: "",
    submitButtonText: "Submit",
    isSubmitButtonDisabled: true,
    displayFadingBalls: false,
    handleOnClick: false,
    handleOnClickFunction: () => { }
};

export default SubmitButton;
