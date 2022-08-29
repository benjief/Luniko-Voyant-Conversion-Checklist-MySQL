import PropTypes from "prop-types";
import React, { Fragment } from "react";
import NavBar from "../../../components/Navbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";

function LoadingWrapper({
    rendering,
    transitionElementOpacity,
    transitionElementVisibility,
}) {
    return (
        <Fragment>
            <NavBar></NavBar>
            <div
                className={rendering ? "loading-spinner" : "transition-element"}
                style={{ opacity: rendering ? "100%" : transitionElementOpacity, visibility: rendering ? "visible" : transitionElementVisibility }}>
                {rendering
                    ? <Hypnosis
                        className="spinner"
                        color="var(--lunikoOrange)"
                        width="100px"
                        height="100px"
                        duration="1.5s" />
                    : <div></div>}
            </div >
        </Fragment>
    )
};

LoadingWrapper.propTypes = {
    rendering: PropTypes.bool,
    transitionElementOpacity: PropTypes.string,
    transitionElementVisibility: PropTypes.string,
};

LoadingWrapper.defaultProps = {
    rendering: false,
    transitionElementOpacity: "0%",
    transitionElementVisibility: "hidden",
};

export default LoadingWrapper;
