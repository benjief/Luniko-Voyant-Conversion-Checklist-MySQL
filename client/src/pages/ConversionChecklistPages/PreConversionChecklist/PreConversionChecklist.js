import React, { Fragment, useEffect, useState } from "react";
import PreConversionChecklistOptionsCard from "../../../components/PreConversionChecklistOptionsCard";
import LoadingWrapper from "../../wrappers/LoadingWrapper/LoadingWrapper";
import "../../../styles/PreConversionChecklist.css";

function PreConversionChecklist() {
    const [rendering, setRendering] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

    useEffect(() => {
        if (rendering) {
            setTimeout(() => {
                setRendering(false);
            }, 10);
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
        }
    }, [rendering])

    return (
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transtitionElementVisibility}>
            </LoadingWrapper>
            <div className="pre-conversion-checklist-options">
                <div className="page-message">
                    Pre-Conversion Checklist
                </div>
                <div className="pre-conversion-checklist-options-container">
                    <div className="pre-conversion-checklist-options-card">
                        <PreConversionChecklistOptionsCard></PreConversionChecklistOptionsCard>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default PreConversionChecklist;