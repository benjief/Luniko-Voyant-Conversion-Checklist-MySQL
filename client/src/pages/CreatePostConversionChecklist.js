import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import EnterLoadSheetNameCard from "../components/EnterLoadSheetNameCard";
import CreatePostConversionChecklistCard from "../components/CreatePostConversionChecklistCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/CreatePostConversionChecklist.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function CreatePostConversionChecklist() {
    // const navigate = useNavigate();
    const [rendering, setRendering] = useState(true);
    const [enterLoadSheetNameDisplay, setEnterLoadSheetNameDisplay] = useState("visible");
    const [createPostConversionChecklistDisplay, setCreatePostConversionChecklistDisplay] = useState("none");
    const [validLoadSheetNames, setValidLoadSheetNames] = useState([]);
    const [validLoadSheetNameEntered, setValidLoadSheetNameEntered] = useState(false);
    const [invalidLoadSheetNameError, setInvalidLoadSheetNameError] = useState("");
    const [loadSheetName, setLoadSheetName] = useState("");
    const [conversionChecklistID, setConversionChecklistID] = useState("");
    const [existingLoadSheetNames, setExistingLoadSheetNames] = useState([]);
    const [postConversionLoadingErrors, setPostConversionLoadingErrors] = useState("");
    const [postConversionValidationResults, setPostConversionValidationResults] = useState("");
    const [postConversionChanges, setPostConversionChanges] = useState("");
    const [formReviewed, setFormReviewed] = useState(false);
    const [formApproved, setFormApproved] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);
    const navigate = useNavigate();

    const getValidLoadSheetNames = async () => {
        await Axios.get("http://localhost:3001/get-valid-pre-conversion-ls-names", {
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
        setCreatePostConversionChecklistDisplay("visible");
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

    const getConversionChecklistID = async (loadSheetName) => {
        await Axios.get(`http://localhost:3001/get-load-sheet-id/${loadSheetName}`, {
        }).then((response) => {
            setConversionChecklistID(response.data[0].cc_id);
            setRendering(false);
        })
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
    }

    const handleApprovedCallback = (checkedFromCheckbox) => {
        setFormApproved(checkedFromCheckbox);
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
                    setInvalidLoadSheetNameError("Invalid pre-conversion load sheet name");
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
            postConversionLoadingErrors: postConversionLoadingErrors === null ? null : postConversionLoadingErrors.trim === "" ? null : postConversionLoadingErrors,
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
                getConversionChecklistID(loadSheetName);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!validLoadSheetNameEntered) {
                loadSheetName.trim() !== "" ? setSubmitButtonDisabled(false) : setSubmitButtonDisabled(true);
            } else {
                // console.log(loadSheetOwner);
                if (postConversionLoadingErrors.trim() !== "" && postConversionValidationResults.trim() !== ""
                    && postConversionChanges.trim() !== "" && formReviewed) {
                    setSubmitButtonDisabled(false);
                } else {
                    setSubmitButtonDisabled(true);
                }
            }
        }
    }, [loadSheetName, postConversionLoadingErrors, postConversionValidationResults, postConversionChanges, formReviewed, rendering]);


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
                            message="Post-conversion checklist successfully created!"
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
                                input="pre">
                            </EnterLoadSheetNameCard>
                        </div>
                    </div>
                </div>
                <div className="create-post-conversion-checklist"
                    style={{ display: createPostConversionChecklistDisplay }}>
                    <div className="page-message">
                        Please Fill In the Fields Below:
                    </div><div className="create-post-conversion-checklist-container">
                        <div className="create-post-conversion-checklist-card">
                            <CreatePostConversionChecklistCard
                                postConversionLoadingErrors={handlePostConversionLoadingErrorsCallback}
                                postConversionValidationResults={handlePostConversionValidationResultsCallback}
                                postConversionChanges={handlePostConversionChangesCallback}
                                reviewed={handleReviewedCallback}
                                approved={handleApprovedCallback}
                                submitted={handleOnClickSubmit}
                                submitButtonDisabled={submitButtonDisabled}>
                            </CreatePostConversionChecklistCard>
                        </div>
                    </div>
                </div>
            </Fragment >
    )
}

export default CreatePostConversionChecklist;