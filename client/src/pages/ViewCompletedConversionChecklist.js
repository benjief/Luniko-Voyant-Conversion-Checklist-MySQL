import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import EnterLoadSheetNameCard from "../components/EnterLoadSheetNameCard";
import ViewCompletedConversionChecklistCard from "../components/ViewCompletedConversionChecklistCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import * as DecoderFunctions from "../components/DecoderFunctions";
import "../styles/ViewCompletedConversionChecklist.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";
import "../styles/AlertComponents.css";

function ViewCompletedConversionChecklist() {
    const [rendering, setRendering] = useState(true);
    const enterLoadSheetNameDisplay = useRef("visible");
    const viewCompletedConversionChecklistDisplay = useRef("none");
    const validLoadSheetNames = useRef([]);
    const validLoadSheetNameEntered = useRef(false);
    const [invalidLoadSheetNameError, setInvalidLoadSheetNameError] = useState("");
    const [loadSheetName, setLoadSheetName] = useState("");
    const loadSheetOwner = useRef([]);
    const decisionMaker = useRef([]);
    const contributors = useRef([]);
    const conversionType = useRef("");
    const additionalProcessing = useRef([]);
    const postConversionLoadingErrors = useRef("");
    const postConversionValidationResults = useRef("");
    const postConversionChanges = useRef("");
    const conversionChecklistID = useRef("");
    const dataSources = useRef("");
    const uniqueRecordsPreCleanup = useRef(0);
    const uniqueRecordsPostCleanup = useRef(0);
    const recordsPreCleanupNotes = useRef("");
    const recordsPostCleanupNotes = useRef("");
    const preConversionManipulation = useRef("");
    const [existingLoadSheetNames, setExistingLoadSheetNames] = useState([]);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [alert, setAlert] = useState(false);
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
            await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-valid-post-conversion-ls-names", {
            }).then(response => {
                populateValidLoadSheetNamesList(response.data);
            });
        } catch (err) {
            console.log("error caught:", err);
            handleError();
        }
    }
    const populateValidLoadSheetNamesList = (validLoadSheetNamesList) => {
        console.log("populating load sheet name list");
        try {
            let tempArray = [];
            for (let i = 0; i < validLoadSheetNamesList.length; i++) {
                tempArray.push(validLoadSheetNamesList[i].cc_load_sheet_name.toLowerCase());
            }
            validLoadSheetNames.current = tempArray;
            console.log("valid load sheet names set");
            async.current = false;
        } catch (err) {
            console.log("error caught:", err);
            handleError();
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

    const runSecondaryReadAsyncFunctions = async (loadSheetName) => {
        let conversionChecklistInfo = await getConversionChecklistInfo(loadSheetName);
        try {
            let tempConversionChecklistID = conversionChecklistInfo[0].cc_id
            conversionChecklistID.current = tempConversionChecklistID;
            let conversionChecklistPersonnel = [conversionChecklistInfo[0].cc_load_sheet_owner, conversionChecklistInfo[0].cc_decision_maker];
            await populateSubmittedFields(conversionChecklistInfo[0]);
            loadSheetOwner.current = await getPersonnelInfo(conversionChecklistPersonnel[0])
            decisionMaker.current = await getPersonnelInfo(conversionChecklistPersonnel[1]);
            await getAdditionalProcessing();
            await getSubmittedContributors();
        } catch (err) {
            console.log("error caught:", err);
            handleError();
        }
    }

    const getConversionChecklistInfo = async (loadSheetName) => {
        console.log("fetching conversion checklist information");
        try {
            async.current = true;
            let tempArray = [];
            await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-conversion-checklist-info/${loadSheetName}`, {
            }).then(response => {
                tempArray.push(response.data[0]);
                async.current = false;
            });
            return tempArray;
        } catch (err) {
            console.log("error caught:", err);
            handleError();
        }
    }

    const getPersonnelInfo = async (personnelID) => {
        if (!async.current) {
            console.log("fetching personnel info");
            try {
                async.current = true;
                let personnel = {};
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-personnel-info/${personnelID}`, {
                }).then(response => {
                    let name = response.data[0].pers_name;
                    personnel = {
                        "value": personnelID,
                        "label": name
                    };
                    async.current = false;
                });
                return personnel;
            } catch (err) {
                console.log("error caught:", err);
                handleError();
            }
        }
    }

    const populateSubmittedFields = (conversionChecklistInfo) => {
        if (!async.current) {
            console.log("populating submitted fields");
            try {
                conversionType.current = DecoderFunctions.getConversionType(conversionChecklistInfo.cc_conversionType);
                dataSources.current = conversionChecklistInfo.cc_data_sources;
                uniqueRecordsPreCleanup.current = conversionChecklistInfo.uq_records_pre_cleanup;
                uniqueRecordsPostCleanup.current = conversionChecklistInfo.uq_records_post_cleanup;
                recordsPreCleanupNotes.current = conversionChecklistInfo.cc_records_pre_cleanup_notes;
                recordsPostCleanupNotes.current = conversionChecklistInfo.cc_records_post_cleanup_notes;
                preConversionManipulation.current = conversionChecklistInfo.cc_pre_conversion_manipulation;
                postConversionLoadingErrors.current = conversionChecklistInfo.cc_post_conversion_loading_errors;
                postConversionValidationResults.current = conversionChecklistInfo.cc_post_conversion_validation_results;
                postConversionChanges.current = conversionChecklistInfo.cc_post_conversion_changes;
                async.current = false;
            } catch (err) {
                console.log("error caught:", err);
                handleError();
            }
        }
    }

    const getAdditionalProcessing = async () => {
        if (!async.current) {
            console.log("fetching additional processing");
            try {
                async.current = true;
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-additional-processing/${conversionChecklistID.current}`, {
                }).then(response => {
                    populateAdditionalProcessingList(response.data);
                });
            } catch (err) {
                console.log("error caught:", err);
                handleError();
            }
        }
    }

    const populateAdditionalProcessingList = (additionalProcessingList) => {
        console.log("populating additional processing list");
        try {
            let tempArray = [];
            for (let i = 0; i < additionalProcessingList.length; i++) {
                let value = additionalProcessingList[i].ap_type;
                let label = DecoderFunctions.getAdditionalProcessingType(value);
                tempArray.push(label);
            }
            additionalProcessing.current = tempArray;
            async.current = false;
        } catch (err) {
            console.log("error caught:", err);
            handleError();
        }
    }

    const getSubmittedContributors = async () => {
        if (!async.current) {
            console.log("fetching submitted contributors");
            try {
                async.current = true;
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-submitted-contributors/${conversionChecklistID.current}`, {
                }).then(response => {
                    populateSubmittedContributorsList(response.data);
                });
            } catch (err) {
                console.log("error caught:", err);
                handleError("r");
            }
        }
    }

    const populateSubmittedContributorsList = (submittedContributorsList) => {
        console.log("populating submitted contributor list");
        try {
            let tempArray = [];
            for (let i = 0; i < submittedContributorsList.length; i++) {
                let name = submittedContributorsList[i].pers_name;
                tempArray.push(name);
            }
            contributors.current = tempArray;
            async.current = false;
            setRendering(false, viewCompletedConversionChecklistDisplay.current = "visible");
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    }

    const handleOnClickSubmit = async (submitted) => {
        if (submitted) {
            if (!validLoadSheetNameEntered.current && submitted) {
                if (checkLoadSheetNameEntered()) {
                    validLoadSheetNameEntered.current = true;
                    setRendering(true);
                    enterLoadSheetNameDisplay.current = "none";
                    setSubmitButtonDisabled(true);
                } else {
                    setInvalidLoadSheetNameError("Invalid completed load sheet name");
                }
            }
        }
    }

    const handleError = () => { // TODO: abstract this (very commonly-used) function into a separate file?
        activeError.current = true;
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
                runInitialReadAsyncFunctions()
            } else {
                runSecondaryReadAsyncFunctions(loadSheetName);
            }
        } else {
            if (!validLoadSheetNameEntered.current) {
                loadSheetName.trim() !== "" ? setSubmitButtonDisabled(false) : setSubmitButtonDisabled(true);
            }
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
        }
    }, [loadSheetName, rendering]);


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
                                message={"Apologies! We've encountered an error. Please attempt to re-load this page."}
                                closed={handleAlertClosed}
                                className={"error-alert"}>
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
                    <div
                        className="enter-valid-load-sheet-name"
                        style={{ display: enterLoadSheetNameDisplay.current }}>
                        <div className="enter-valid-load-sheet-name-container">
                            <div className="enter-valid-load-sheet-name-card">
                                <EnterLoadSheetNameCard
                                    loadSheetName={handleLoadSheetNameCallback}
                                    submitted={handleOnClickSubmit}
                                    submitButtonDisabled={submitButtonDisabled}
                                    textAuthenticationError={invalidLoadSheetNameError}
                                    input={[<u>completed</u>, " "]}>
                                </EnterLoadSheetNameCard>
                            </div>
                        </div>
                    </div>
                    <div className="view-completed-conversion-checklist"
                        style={{ display: viewCompletedConversionChecklistDisplay.current }}>
                        <div className="page-message">
                            View Your Completed Checklist Below:
                        </div>
                        <div className="view-completed-conversion-checklist-container">
                            <div className="view-completed-conversion-checklist-card">
                                <ViewCompletedConversionChecklistCard
                                    loadSheetName={loadSheetName}
                                    loadSheetOwner={loadSheetOwner.current}
                                    decisionMaker={decisionMaker.current}
                                    contributors={contributors.current}
                                    conversionType={conversionType.current}
                                    additionalProcessing={additionalProcessing.current}
                                    dataSources={dataSources.current}
                                    uniqueRecordsPreCleanup={uniqueRecordsPreCleanup.current}
                                    uniqueRecordsPostCleanup={uniqueRecordsPostCleanup.current}
                                    recordsPreCleanupNotes={recordsPreCleanupNotes.current}
                                    recordsPostCleanupNotes={recordsPostCleanupNotes.current}
                                    preConversionManipulation={preConversionManipulation.current}
                                    postConversionLoadingErrors={postConversionLoadingErrors.current}
                                    postConversionValidationResults={postConversionValidationResults.current}
                                    postConversionChanges={postConversionChanges.current}
                                >
                                </ViewCompletedConversionChecklistCard>
                            </div>
                        </div>
                    </div>
                </Fragment >
    )
}

export default ViewCompletedConversionChecklist;