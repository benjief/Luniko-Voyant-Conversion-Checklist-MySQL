import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import LandingPageOptionsCard from "../components/LandingPageOptionsCard";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/InputComponents.css"
import "../styles/LandingPage.css";

function LandingPage() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

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
                        <div className="landing-page-options-card">
                            <LandingPageOptionsCard>
                            </LandingPageOptionsCard>
                        </div>
                        {/* <div className="card-text">
                            Please choose an option below:
                        </div>
                        <Link to={"/pre-conversion-checklist"}>
                            <button
                                className="pre-conversion-checklist-button">
                                Pre-Conversion Checklist
                            </button>
                        </Link>
                        <Link to={"/post-conversion-checklist"}>
                            <button
                                className="post-conversion-checklist-button">
                                Post-Conversion Checklist
                            </button>
                        </Link> */}
                    </div>
                </div>
            </Fragment>
    )
};

export default LandingPage;