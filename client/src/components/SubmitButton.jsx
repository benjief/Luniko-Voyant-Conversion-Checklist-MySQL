import PropTypes from 'prop-types';
import React from 'react';
import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

function SubmitButton({
    className,
    submitButtonText,
    isSubmitButtonDisabled,
    displayFadingBalls,
    handleOnClick,
    handleOnClickFunction,
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
