import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialTextField from "../components/MaterialTextField";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/InputComponents.css"
import "../styles/LandingPage.css";

function LandingPage() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [loadSheetNames, setLoadSheetNames] = useState([]);

    const getLoadSheetNames = () => {

    }


    useEffect(() => {
        setRendering(false);
        setTransitionElementOpacity("0%");
        setTransitionElementVisibility("hidden");
    })

    return (
        rendering ?
            <div className="loading-spinner">
                <Hypnosis
                    className="spinner"
                    color="var(--lunikoOrange)"
                    width="100px"
                    height="100px"
                    duration="1.5s" />
            </div> :
            <Fragment>
                <div
                    className="transition-element"
                    style={{
                        opacity: transitionElementOpacity,
                        visibility: transtitionElementVisibility
                    }}>
                </div>
                <NavBar>
                </NavBar>
                <div className="landing-page-options">
                    <div className="page-message">
                        Welcome!
                    </div>
                    <div className="landing-page-options-container">
                        <div className="card-text">
                            Please choose an option below:
                        </div>
                        <button
                            className="create-checklist-button">
                            Create Checklist
                        </button>
                        <button
                            className="view-checklist-button">
                            View/Modify Checklist
                        </button>
                        <MaterialTextField
                            label="Load Sheet Name"
                            placeholder="Enter load sheet name"
                            helperText="">

                        </MaterialTextField>
                    </div>
                </div>
            </Fragment>
    )
};

export default LandingPage;