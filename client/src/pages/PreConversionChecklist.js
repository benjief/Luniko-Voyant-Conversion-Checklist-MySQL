import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import PreConversionChecklistOptionsCard from "../components/PreConversionChecklistOptionsCard";
import MaterialTextField from "../components/MaterialTextField";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/PreConversionChecklist.css";

function PreConversionChecklist() {
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
                <div className="pre-conversion-checklist-options">
                    <div className="page-message">
                        Pre-Conversion Checklist
                    </div>
                    <div className="pre-conversion-checklist-options-container">
                        <div className="pre-conversion-checklist-options-card">
                            <PreConversionChecklistOptionsCard></PreConversionChecklistOptionsCard>
                        </div>
                        {/* <div className="card-text">
                            Please choose an option below:
                        </div>
                        <Link to={"/create-pre-conversion-checklist"}>
                            <button
                                className="create-pre-conversion-checklist-button">
                                Create
                            </button>
                        </Link>
                        <button
                            className="view-pre-conversion-checklist-button">
                            View/Modify
                        </button> */}
                    </div>
                </div>
            </Fragment>
    )
};

export default PreConversionChecklist;