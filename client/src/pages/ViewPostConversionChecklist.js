import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import EnterLoadSheetNameCard from "../components/EnterLoadSheetNameCard";
import ViewPostConversionChecklistCard from "../components/ViewPostConversionChecklistCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/ViewPostConversionChecklist.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";
import "../styles/AlertComponents.css";

function ViewPostConversionChecklist() {
    // const navigate = useNavigate();
    const [rendering, setRendering] = useState(true);
    const [enterLoadSheetNameDisplay, setEnterLoadSheetNameDisplay] = useState("visible");
    const [viewPostConversionChecklistDisplay, setViewPostConversionChecklistDisplay] = useState("none");
    const [validLoadSheetNames, setValidLoadSheetNames] = useState([]);
    const [validLoadSheetNameEntered, setValidLoadSheetNameEntered] = useState(false);
    const [invalidLoadSheetNameError, setInvalidLoadSheetNameError] = useState("");
    const [loadSheetName, setLoadSheetName] = useState("");
    const [conversionChecklistID, setConversionChecklistID] = useState("");
    const [existingLoadSheetNames, setExistingLoadSheetNames] = useState([]);
    const [postConversionLoadingErrors, setPostConversionLoadingErrors] = useState("");
    const [postConversionValidationResults, setPostConversionValidationResults] = useState("");
    const [postConversionChanges, setPostConversionChanges] = useState("");
    const [forceReviewedOff, setForceReviewedOff] = useState(false);
    const [forceApproveLocked, setForceApproveLocked] = useState(false);
    const [formReviewed, setFormReviewed] = useState(true);
    const [formApproved, setFormApproved] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [valueUpdated, setValueUpdated] = useState(false);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);
    const navigate = useNavigate();

    const getValidLoadSheetNames = async () => {
        await Axios.get("http://localhost:3001/get-valid-post-conversion-ls-names", {
        }).then((response) => {
            populateValidLoadSheetNamesList(response.data);
        });
    }

    const populateValidLoadSheetNamesList = (validLSNamesList) => {
        if (validLSNamesList.length) {
            let tempArray = [];
            for (let i = 0; i < validLSNamesList.length; i++) {
                tempArray.push(validLSNamesList[i].cc_load_sheet_name.toLowerCase());
            }
            setValidLoadSheetNames([...tempArray]);
        }
        setViewPostConversionChecklistDisplay("visible");
        setRendering(false);
    }

    const handleLoadSheetNameCallback = (lsNameFromInput) => {
        setLoadSheetName(lsNameFromInput);
        setInvalidLoadSheetNameError("");
    }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    const checkLoadSheetNameEntered = () => {
        for (let i = 0; i < validLoadSheetNames.length; i++) {
            let escapeRegExpMatch = loadSheetName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`\\b${escapeRegExpMatch}\\b`).test(validLoadSheetNames[i])) {
                return true;
            }
        }
        return false;
    }

    const getConversionChecklistInfo = async (loadSheetName) => {
        await Axios.get(`http://localhost:3001/get-post-conversion-checklist-info/${loadSheetName}`, {
        }).then((response) => {
            populateSubmittedFields(response.data[0]);
            // setRendering(false);
        })
    }

    const populateSubmittedFields = (conversionChecklistInfo) => {
        setConversionChecklistID(conversionChecklistInfo.cc_id);
        setPostConversionLoadingErrors(conversionChecklistInfo.cc_post_conversion_loading_errors);
        setPostConversionValidationResults(conversionChecklistInfo.cc_post_conversion_validation_results);
        setPostConversionChanges(conversionChecklistInfo.cc_post_conversion_changes);
        setFormDisabled(conversionChecklistInfo.is_approved.data[0] ? true : false);
        setRendering(false);
    }

    const handlePostConversionLoadingErrorsCallback = (postConversionLoadingErrorsFromInput) => {
        setPostConversionLoadingErrors(postConversionLoadingErrorsFromInput);
    }

    const handlePostConversionValidationResultsCallback = (postConversionValidationResultsFromInput) => {
        setPostConversionValidationResults(postConversionValidationResultsFromInput);
    }

    const handlePostConversionChangesCallback = (postConversionChangesFromInput) => {
        setPostConversionChanges(postConversionChangesFromInput);
    }

    const handleReviewedCallback = (checkedFromCheckbox) => {
        setFormReviewed(checkedFromCheckbox);
        setForceReviewedOff(false);
    }

    const handleApprovedCallback = (checkedFromCheckbox) => {
        setFormApproved(checkedFromCheckbox);
        setForceApproveLocked(false);
        if (checkedFromCheckbox) {
            handleValueUpdated(true);
        }
    }

    const handleApproveUnlockedByUser = (unlocked) => {
        if (unlocked) {
            setForceApproveLocked(false);
        }
    }

    const handleOnClickSubmit = async (submitted) => {
        if (submitted) {
            if (!validLoadSheetNameEntered && submitted) {
                if (checkLoadSheetNameEntered()) {
                    setValidLoadSheetNameEntered(true)
                    setRendering(true);
                    setEnterLoadSheetNameDisplay("none");
                    setSubmitButtonDisabled(true);
                } else {
                    setInvalidLoadSheetNameError("Invalid post-conversion load sheet name");
                }
            } else {
                if (submitted) {
                    updateConversionChecklist();
                }
            }
        }
    }

    const updateConversionChecklist = () => {
        console.log("Updating checklist...");
        Axios.put(`http://localhost:3001/update-post-conversion-checklist/${conversionChecklistID}`, {
            postConversionLoadingErrors: postConversionLoadingErrors === null ? null : postConversionLoadingErrors.trim() === "" ? null : postConversionLoadingErrors,
            postConversionValidationResults: postConversionValidationResults === null ? null : postConversionValidationResults.trim() === "" ? null : postConversionValidationResults,
            postConversionChanges: postConversionChanges === null ? null : postConversionChanges.trim() === "" ? null : postConversionChanges,
            approvedByITDirector: formApproved
        }).then((response) => {
            setSubmitted(true);
            console.log("Pre-conversion checklist successfully updated!");
            // handleSuccessfulUpdate();
            setAlert(true);
        });
    };

    // const handleSuccessfulUpdate = () => {
    //     // setTimeout(() => {
    //     //     setSubmitButtonText("Request Submitted!");
    //     // }, 500);
    //     setTimeout(() => {
    //         navigate("/");
    //     }, 1000);
    // }

    const handleValueUpdated = (approvedUpdated) => {
        console.log(approvedUpdated);
        if (!approvedUpdated) {
            setValueUpdated(true);
            setForceReviewedOff(true);
            setForceApproveLocked(true);
        } else {
            setValueUpdated(true);
        }
    }

    const handleAlertClosed = (alertClosed) => {
        if (alertClosed) {
            setAlert(false);
            navigate("/");
        }
    }

    useEffect(() => {
        if (rendering) {
            if (!validLoadSheetNameEntered) {
                getValidLoadSheetNames();
            } else {
                getConversionChecklistInfo(loadSheetName);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!validLoadSheetNameEntered) {
                loadSheetName.trim() !== "" ? setSubmitButtonDisabled(false) : setSubmitButtonDisabled(true);
            } else {
                if (valueUpdated && postConversionLoadingErrors.trim() !== "" && postConversionValidationResults.trim() !== ""
                    && postConversionChanges.trim() !== "" && formReviewed) {
                    setSubmitButtonDisabled(false);
                } else {
                    setSubmitButtonDisabled(true);
                }
            }
        }
    }, [loadSheetName, postConversionLoadingErrors, postConversionValidationResults, postConversionChanges, formReviewed, formApproved, rendering]);


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
                {alert
                    ? <div className="alert-container">
                        <PositionedSnackbar
                            message="Post-conversion checklist successfully updated!"
                            closed={handleAlertClosed}>
                        </PositionedSnackbar>
                    </div>
                    : <div></div>}
                <div
                    className="enter-valid-load-sheet-name"
                    style={{ display: enterLoadSheetNameDisplay }}>
                    <div className="enter-valid-load-sheet-name-container">
                        <div className="page-message">
                            Retrieve Your Load Sheet Below:
                        </div>
                        <div className="enter-valid-load-sheet-name-card">
                            <EnterLoadSheetNameCard
                                loadSheetName={handleLoadSheetNameCallback}
                                submitted={handleOnClickSubmit}
                                submitButtonDisabled={submitButtonDisabled}
                                textAuthenticationError={invalidLoadSheetNameError}
                                input={<u>post-</u>}>
                            </EnterLoadSheetNameCard>
                        </div>
                    </div>
                </div>
                <div className="view-post-conversion-checklist"
                    style={{ display: viewPostConversionChecklistDisplay }}>
                    <div className="page-message">
                        Please Review/Modify the Fields Below:
                    </div>
                    <div className="view-post-conversion-checklist-container"
                        style={{ display: viewPostConversionChecklistDisplay }}>
                        <div className="view-post-conversion-checklist-card">
                            <ViewPostConversionChecklistCard
                                postConversionLoadingErrors={handlePostConversionLoadingErrorsCallback}
                                submittedPostConversionLoadingErrors={postConversionLoadingErrors}
                                postConversionValidationResults={handlePostConversionValidationResultsCallback}
                                submittedPostConversionValidationResults={postConversionValidationResults}
                                postConversionChanges={handlePostConversionChangesCallback}
                                submittedPostConversionChanges={postConversionChanges}
                                reviewed={handleReviewedCallback}
                                forceReviewedOff={forceReviewedOff}
                                approved={handleApprovedCallback}
                                formDisabled={formDisabled}
                                forceApproveLocked={forceApproveLocked}
                                approveUnlockedByUser={handleApproveUnlockedByUser}
                                valueUpdated={handleValueUpdated}
                                updateButtonDisabled={submitButtonDisabled}
                                updated={handleOnClickSubmit}>
                            </ViewPostConversionChecklistCard>
                        </div>
                    </div>
                </div>
            </Fragment >
    )
}

export default ViewPostConversionChecklist;