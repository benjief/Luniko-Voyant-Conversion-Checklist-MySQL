import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import PostConversionChecklistOptionsCard from "../components/PostConversionChecklistOptionsCard";
import MaterialTextField from "../components/MaterialTextField";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/PostConversionChecklist.css";

function PostConversionChecklist() {
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
                <div className="post-conversion-checklist-options">
                    <div className="page-message">
                        Post-Conversion Checklist
                    </div>
                    <div className="post-conversion-checklist-options-container">
                        <div className="post-conversion-checklist-options-card">
                            <PostConversionChecklistOptionsCard></PostConversionChecklistOptionsCard>
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

export default PostConversionChecklist;