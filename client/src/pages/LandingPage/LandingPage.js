import React, { Fragment, useEffect, useState } from "react";
import LandingPageOptionsCard from "../../components/LandingPageOptionsCard";
import { useValidationErrorUpdate } from "../ConversionChecklistPages/Context/ValidationErrorContext";
import LoadingWrapper from "../wrappers/LoadingWrapper/LoadingWrapper";
import "../../styles/InputComponents.css"
import "../../styles/LandingPage.css";

function LandingPage() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const invalidLoadSheetNameError = useValidationErrorUpdate();

    useEffect(() => {
        if (rendering) {
            setTimeout(() => {
                setRendering(false);
            }, 10);
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            invalidLoadSheetNameError("");
        }
    }, [invalidLoadSheetNameError, rendering])

    return (
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transtitionElementVisibility}>
            </LoadingWrapper>
            <div className="landing-page-options">
                <div className="page-message">
                    Welcome!
                </div>
                <div className="landing-page-options-container">
                    <div className="landing-page-options-card">
                        <LandingPageOptionsCard>
                        </LandingPageOptionsCard>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default LandingPage;
