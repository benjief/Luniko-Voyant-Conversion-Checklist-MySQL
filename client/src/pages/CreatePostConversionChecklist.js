import React, { Fragment, useEffect, useState, useRef } from "react";
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
    const [rendering, setRendering] = useState(true);
    // const [enterLoadSheetNameDisplay, setEnterLoadSheetNameDisplay] = useState("visible");
    const enterLoadSheetNameDisplay = useRef("visible");
    // const [createPostConversionChecklistDisplay, setCreatePostConversionChecklistDisplay] = useState("none");
    const createPostConversionChecklistDisplay = useRef("none");
    // const [validLoadSheetNames, setValidLoadSheetNames] = useState([]);
    const validLoadSheetNames = useRef([]);
    // const [validLoadSheetNameEntered, setValidLoadSheetNameEntered] = useState(false);
    const validLoadSheetNameEntered = useRef(false);
    const [invalidLoadSheetNameError, setInvalidLoadSheetNameError] = useState("");
    const [loadSheetName, setLoadSheetName] = useState("");
    // const [conversionChecklistID, setConversionChecklistID] = useState("");
    const conversionChecklistID = useRef("");
    const [postConversionLoadingErrors, setPostConversionLoadingErrors] = useState("");
    const [postConversionValidationResults, setPostConversionValidationResults] = useState("");
    const [postConversionChanges, setPostConversionChanges] = useState("");
    const [forceCheckboxOff, setForceCheckboxOff] = useState(false);
    const [formReviewed, setFormReviewed] = useState(false);
    const [formApproved, setFormApproved] = useState(false);
    const [submitted, setSubmitted] = useState(false); // TODO: is this needed?
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    // const [valueUpdated, setValueUpdated] = useState(false);
    const valueUpdated = useRef(false);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);
    // const [alertType, setAlertType] = useState("success-alert");
    const alertType = useRef("success-alert");
    // const [alertMessage, setAlertMessage] = useState("Post-conversion checklist successfully created!");
    const alertMessage = useRef("Post-conversion checklist successfully created!");
    const loadErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to re-load this page.");
    const writeErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to update your checklist again.");
    const [displaySubmitButtonWorkingIcon, setDisplaySubmitButtonWorkingIcon] = useState(false);
    const activeError = useRef(false);
    const async = useRef(false);

    const navigate = useNavigate();

    const runInitialReadAsyncFunctions = async () => {
        await getValidLoadSheetNames();
        setRendering(false);
    }

    const getValidLoadSheetNames = async () => {
        console.log("fetching valid load sheet names");
        try {
            await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-valid-pre-conversion-ls-names", {
            }).then(response => {
                populateValidLoadSheetNamesList(response.data);
            });
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    }

    const populateValidLoadSheetNamesList = (validLoadSheetNamesList) => {
        console.log("populating load sheet name list");
        try {
            let tempArray = [];
            for (let i = 0; i < validLoadSheetNamesList.length; i++) {
                tempArray.push(validLoadSheetNamesList[i].cc_load_sheet_name.toLowerCase());
            }
            // console.log(tempArray);
            validLoadSheetNames.current = tempArray;
            console.log("valid load sheet names set");
            async.current = false;
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    }

    const handleLoadSheetNameCallback = (lsNameFromInput) => {
        setLoadSheetName(lsNameFromInput);
        setInvalidLoadSheetNameError("");
    }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    const checkLoadSheetNameEntered = () => {
        for (let i = 0; i < validLoadSheetNames.current.length; i++) {
            let escapeRegExpMatch = loadSheetName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`\\b${escapeRegExpMatch}\\b`).test(validLoadSheetNames.current[i])) {
                return true;
            }
        }
        return false;
    }

    const getConversionChecklistID = async (loadSheetName) => {
        console.log("fetching conversion checklist ID");
        try {
            async.current = true;
            await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-load-sheet-id/${loadSheetName}`, {
            }).then((response) => {
                async.current = false;
                // setConversionChecklistID(response.data[0].cc_id);
                conversionChecklistID.current = response.data[0].cc_id;
                setRendering(false, createPostConversionChecklistDisplay.current = "visible");
            });
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
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
        setForceCheckboxOff(false);
    }

    const handleApprovedCallback = (checkedFromCheckbox) => {
        setFormApproved(checkedFromCheckbox);
    }

    const handleOnClickSubmit = async (submitted) => {
        if (submitted && !validLoadSheetNameEntered.current) {
            if (checkLoadSheetNameEntered()) {
                // setValidLoadSheetNameEntered(true)
                validLoadSheetNameEntered.current = true;
                setRendering(true);
                // setEnterLoadSheetNameDisplay("none");
                enterLoadSheetNameDisplay.current = "none";
                setSubmitButtonDisabled(true);
            } else {
                setInvalidLoadSheetNameError("Invalid pre-conversion load sheet name");
            }
        } else {
            if (submitted) {
                setSubmitButtonDisabled(true);
                setDisplaySubmitButtonWorkingIcon(true);
                await updateConversionChecklist();
                setAlert(true);
            }
        }
    }

    const updateConversionChecklist = async () => {
        console.log("updating checklist...");
        try {
            async.current = true;
            await Axios.put(`https://voyant-conversion-checklist.herokuapp.com/update-post-conversion-checklist/${conversionChecklistID.current}`, {
                postConversionLoadingErrors: postConversionLoadingErrors === null ? null : postConversionLoadingErrors.trim === "" ? null : postConversionLoadingErrors,
                postConversionValidationResults: postConversionValidationResults === null ? null : postConversionValidationResults.trim() === "" ? null : postConversionValidationResults,
                postConversionChanges: postConversionChanges === null ? null : postConversionChanges.trim() === "" ? null : postConversionChanges,
                approvedByITDirector: formApproved
            }).then(response => {
                async.current = false;
                console.log("pre-conversion checklist successfully updated");
            });
        } catch (err) {
            handleError("w");
        }
    }

    const handleValueUpdated = () => {
        valueUpdated.current = true;
        setForceCheckboxOff(true);
    }

    const handleError = (errorType) => {
        activeError.current = true;
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage.current
            : alertMessage.current = writeErrorMessage.current;

        // Delay is set up just in case an error is generated before the is fully-displayed
        let delay = transitionElementOpacity === "100%" ? 500 : rendering ? 500 : 0;

        if (rendering) {
            setRendering(false);
        }

        setTimeout(() => {
            setAlert(true);
        }, delay);
    }

    const handleAlertClosed = (alertClosed) => {
        if (alertClosed) {
            setAlert(false);
            navigate("/");
        }
    }

    useEffect(() => {
        if (rendering) {
            if (!validLoadSheetNameEntered.current) {
                runInitialReadAsyncFunctions();
            } else {
                getConversionChecklistID(loadSheetName);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!validLoadSheetNameEntered.current) {
                loadSheetName.trim() !== "" ? setSubmitButtonDisabled(false) : setSubmitButtonDisabled(true);
            } else {
                if (postConversionLoadingErrors.trim() !== "" && postConversionValidationResults.trim() !== ""
                    && postConversionChanges.trim() !== "" && formReviewed) {
                    setSubmitButtonDisabled(false);
                } else {
                    setSubmitButtonDisabled(true);
                }
            }
        }
    }, [validLoadSheetNames, loadSheetName, postConversionLoadingErrors, postConversionValidationResults, postConversionChanges, formReviewed, rendering]);

    return (
        rendering
            ? <div className="loading-spinner">
                <Hypnosis
                    className="spinner"
                    color="var(--lunikoOrange)"
                    width="100px"
                    height="100px"
                    duration="1.5s" />
            </div>
            : activeError.current
                ? <Fragment>
                    <NavBar>
                    </NavBar>
                    {alert
                        ? <div className="alert-container">
                            <PositionedSnackbar
                                message={alertMessage.current}
                                closed={handleAlertClosed}
                                className={alertType.current}>
                            </PositionedSnackbar>
                        </div>
                        : <div></div>}
                    <div
                        className="error-div"
                        style={{ height: "100vw", width: "100%" }}
                    ></div>
                </Fragment>
                : <Fragment>
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
                                message={alertMessage.current}
                                closed={handleAlertClosed}
                                className={alertType.current}>
                            </PositionedSnackbar>
                        </div>
                        : <div></div>}
                    <div
                        className="enter-valid-load-sheet-name"
                        style={{ display: enterLoadSheetNameDisplay.current }}>
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
                                    input={[<u>pre</u>, "-"]}>
                                </EnterLoadSheetNameCard>
                            </div>
                        </div>
                    </div>
                    <div className="create-post-conversion-checklist"
                        style={{ display: createPostConversionChecklistDisplay.current }}>
                        <div className="page-message">
                            Please Fill In the Fields Below:
                        </div><div className="create-post-conversion-checklist-container">
                            <div className="create-post-conversion-checklist-card">
                                <CreatePostConversionChecklistCard
                                    postConversionLoadingErrors={handlePostConversionLoadingErrorsCallback}
                                    postConversionValidationResults={handlePostConversionValidationResultsCallback}
                                    postConversionChanges={handlePostConversionChangesCallback}
                                    forceReviewedOff={forceCheckboxOff}
                                    reviewed={handleReviewedCallback}
                                    approved={handleApprovedCallback}
                                    valueUpdated={handleValueUpdated}
                                    submitted={handleOnClickSubmit}
                                    submitButtonDisabled={submitButtonDisabled}
                                    displayFadingBalls={displaySubmitButtonWorkingIcon}>
                                </CreatePostConversionChecklistCard>
                            </div>
                        </div>
                    </div>
                </Fragment >
    )
}

export default CreatePostConversionChecklist;