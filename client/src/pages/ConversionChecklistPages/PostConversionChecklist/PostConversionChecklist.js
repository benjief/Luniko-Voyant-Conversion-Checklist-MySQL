import React, { Fragment, useEffect, useState } from "react";
import PostConversionChecklistOptionsCard from "../../../components/PostConversionChecklistOptionsCard";
import LoadingWrapper from "../../wrappers/LoadingWrapper/LoadingWrapper";
import "../../../styles/PostConversionChecklist.css";

function PostConversionChecklist() {
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
            <div className="post-conversion-checklist-options">
                <div className="page-message">
                    Post-Conversion Checklist
                </div>
                <div className="post-conversion-checklist-options-container">
                    <div className="post-conversion-checklist-options-card">
                        <PostConversionChecklistOptionsCard></PostConversionChecklistOptionsCard>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default PostConversionChecklist;