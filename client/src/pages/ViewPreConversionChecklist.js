import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import EnterLoadSheetNameCard from "../components/EnterLoadSheetNameCard";
import ViewPreConversionChecklistCard from "../components/ViewPreConversionChecklistCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import * as DecoderFunctions from "../components/DecoderFunctions";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/ViewPreConversionChecklist.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function ViewPreConversionChecklist() {
    const [rendering, setRendering] = useState(true);
    const enterLoadSheetNameDisplay = useRef("visible");
    const viewPreConversionChecklistDisplay = useRef("none");
    const validLoadSheetNames = useRef([]);
    const validLoadSheetNameEntered = useRef(false);
    const [invalidLoadSheetNameError, setInvalidLoadSheetNameError] = useState("");
    const [loadSheetName, setLoadSheetName] = useState("");
    const conversionChecklistID = useRef("");
    const [personnelOptions, setPersonnelOptions] = useState([]);
    const [newPersonnel, setNewPersonnel] = useState([]);
    const loadSheetOwner = useRef([]);
    const decisionMaker = useRef([]);
    const contributors = useRef([]);
    const conversionType = useRef("");
    const additionalProcessing = useRef([]);
    const dataSources = useRef("");
    const uniqueRecordsPreCleanup = useRef(0);
    const uniqueRecordsPostCleanup = useRef(0);
    const recordsPreCleanupNotes = useRef("");
    const recordsPostCleanupNotes = useRef("");
    const preConversionManipulation = useRef("");
    const [forceCheckboxOff, setForceCheckboxOff] = useState(false);
    const [formReviewed, setFormReviewed] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const valueUpdated = useRef(false);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);
    const alertType = useRef("success-alert");
    const alertMessage = useRef("Pre-conversion checklist successfully updated!");
    const [displaySubmitButtonWorkingIcon, setDisplaySubmitButtonWorkingIcon] = useState(false);
    const async = useRef(false);

    var asyncFunctionAtWork = false;

    const navigate = useNavigate();

    // Single select options
    const conversionTypeOptions = [
        { value: "M", label: "Manual" },
        { value: "D", label: "DMT" }
    ];

    const additionalProcessingOptions = [
        { value: "C", label: "Cleanup Needed" },
        { value: "D", label: "New Data to Be Added" },
        { value: "N", label: "N/A" }
    ];

    const runInitialReadAsyncFunctions = async () => {
        await getValidLoadSheetNames();
        console.log("setting rendering to false");
        setRendering(false);
    }

    const getValidLoadSheetNames = async () => {
        console.log("fetching valid load sheet names");
        try {
            async.current = true;
            await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-valid-pre-conversion-ls-names", {
            }).then(async response => {
                await populateValidLoadSheetNamesList(response.data);
            });
        } catch (err) {
            console.log("error caught: ", err);
            handleError("r");
        }
    }

    const populateValidLoadSheetNamesList = (validLoadSheetNamesList) => {
        console.log("populating load sheet name list");
        try {
            async.current = true;
            let tempArray = [];
            for (let i = 0; i < validLoadSheetNamesList.length; i++) {
                tempArray.push(validLoadSheetNamesList[i].cc_load_sheet_name.toLowerCase());
            }
            console.log(tempArray);
            validLoadSheetNames.current = tempArray;
            console.log("valid load sheet names set");
            async.current = false;
        } catch (err) {
            console.log("error caught: ", err);
            handleError("r");
        }
    }

    const runSecondaryReadAsyncFunctions = async (loadSheetName) => {
        let conversionChecklistInfo = await getConversionChecklistInfo(loadSheetName);
        // This needs to be in a try-catch block, in case the first function errors out
        try {
            let tempConversionChecklistID = conversionChecklistInfo[0].cc_id
            conversionChecklistID.current = tempConversionChecklistID;
            let conversionChecklistPersonnel = [conversionChecklistInfo[0].cc_load_sheet_owner, conversionChecklistInfo[0].cc_decision_maker];
            loadSheetOwner.current = await getPersonnelInfo(conversionChecklistPersonnel[0]);
            decisionMaker.current = await getPersonnelInfo(conversionChecklistPersonnel[1]);
            await populateSubmittedFields(conversionChecklistInfo[0]);
            await getAdditionalProcessing();
            await getAvailablePersonnel();
            await getSubmittedContributors();
        } catch (err) {
            console.log("error caught: ", err);
            handleError("r");
        }
    }

    const getConversionChecklistInfo = async (loadSheetName) => {
        console.log("fetching conversion checklist info");
        try {
            async.current = true;
            let tempArray = [];
            await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-pre-conversion-checklist-info/${loadSheetName}`, {
            }).then(response => {
                tempArray.push(response.data[0]);
                async.current = false;
            });
            return tempArray;
        } catch (err) {
            console.log("error caught: ", err);
            handleError("r");
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
                console.log("error caught: ", err);
                handleError("r");
            }
        }
    }

    const populateSubmittedFields = (conversionChecklistInfo) => {
        if (!async.current) {
            console.log("populating submitted fields");
            try {
                async.current = true;
                let value = conversionChecklistInfo.cc_conversion_type;
                let label = DecoderFunctions.getConversionType(value);
                let tempConversionType = {
                    "value": value,
                    "label": label
                };
                conversionType.current = tempConversionType;
                dataSources.current = conversionChecklistInfo.cc_data_sources;
                uniqueRecordsPreCleanup.current = conversionChecklistInfo.uq_records_pre_cleanup;
                uniqueRecordsPostCleanup.current = conversionChecklistInfo.uq_records_post_cleanup;
                recordsPreCleanupNotes.current = conversionChecklistInfo.cc_records_pre_cleanup_notes;
                recordsPostCleanupNotes.current = conversionChecklistInfo.cc_records_post_cleanup_notes;
                preConversionManipulation.current = conversionChecklistInfo.cc_pre_conversion_manipulation;
                async.current = false;
            } catch (err) {
                console.log("error caught: ", err);
                handleError("r");
            }
        }
    }

    const getAdditionalProcessing = async () => {
        if (!async.current) {
            console.log("fetching additional processing");
            try {
                async.current = true;
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-additional-processing/${conversionChecklistID.current}`, {
                }).then(async response => {
                    await populateAdditionalProcessingList(response.data);
                    async.current = false;
                });
            } catch (err) {
                console.log("error caught: ", err);
                handleError("r");
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
                let tempAdditionalProcessing = {
                    "value": value,
                    "label": label
                }
                tempArray.push(tempAdditionalProcessing);
            }
            additionalProcessing.current = tempArray;
        } catch (err) {
            console.log("error caught: ", err);
            handleError("r");
        }
    }

    const getAvailablePersonnel = async () => {
        if (!async.current) {
            console.log("fetching available personnel");
            try {
                async.current = true;
                await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-all-personnel", {
                }).then(async response => {
                    await populatePersonnelList(response.data);
                    async.current = false;
                });
            } catch (err) {
                console.log("error caught: ", err);
                handleError("r");
            }
        }
    }

    const populatePersonnelList = (availablePersonnelList) => {
        console.log("populating available personnel list");
        try {
            let tempArray = [];
            for (let i = 0; i < availablePersonnelList.length; i++) {
                let uid = availablePersonnelList[i].pers_id;
                let name = availablePersonnelList[i].pers_fname + " " + availablePersonnelList[i].pers_lname; // TODO: change this (query-side) and CONCAT'd name?
                let personnel = {
                    "value": uid,
                    "label": name
                };
                tempArray.push(personnel);
            }
            setPersonnelOptions([...tempArray]);
        } catch (err) {
            console.log("error caught: ", err);
            handleError("r");
        }
    }

    const getSubmittedContributors = async () => {
        if (!async.current) {
            console.log("fetching submitted contributors");
            try {
                async.current = true;
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-submitted-contributors/${conversionChecklistID.current}`, {
                }).then(async response => {
                    await populateSubmittedContributorsList(response.data);
                    async.current = false;
                    setRendering(false, viewPreConversionChecklistDisplay.current = "visible");
                });
            } catch (err) {
                console.log("error caught: ", err);
                handleError("r");
            }
        }
    }

    const populateSubmittedContributorsList = (submittedContributorsList) => {
        try {
            let tempArray = [];
            for (let i = 0; i < submittedContributorsList.length; i++) {
                let uid = submittedContributorsList[i].pers_id;
                let name = submittedContributorsList[i].pers_name;
                let personnel = {
                    "value": uid,
                    "label": name
                };
                tempArray.push(personnel);
            }
            contributors.current = tempArray;
        } catch (err) {
            console.log("error caught: ", err);
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

    const handleLoadSheetOwnerCallback = (loadSheetOwnerFromSelector) => {
        loadSheetOwner.current = loadSheetOwnerFromSelector;
    }

    const handleDecisionMakerCallback = (decisionMakerFromSelector) => {
        decisionMaker.current = decisionMakerFromSelector
    }

    const handleContributorsCallback = (contributorsFromSelector) => {
        contributors.current = contributorsFromSelector;
    }

    const handleConversionTypeCallback = (conversionTypeFromSelector) => {
        conversionType.current = conversionTypeFromSelector;
    }

    const handleAdditionalProcessingCallback = (additionalProcessingFromSelector) => {
        additionalProcessing.current = additionalProcessingFromSelector;
    }

    const handleDataSourcesCallback = (dataSourcesFromInput) => {
        dataSources.current = dataSourcesFromInput;
    }

    const handleUqRecordsPreCleanupCallback = (uqRecordsPreCleanupFromInput) => {
        uniqueRecordsPreCleanup.current = uqRecordsPreCleanupFromInput ? uqRecordsPreCleanupFromInput : 0;
    }

    const handleUqRecordsPostCleanupCallback = (uqRecordsPostCleanupFromInput) => {
        uniqueRecordsPostCleanup.current = uqRecordsPostCleanupFromInput ? uqRecordsPostCleanupFromInput : 0;
    }

    const handleRecordsPreCleanupNotesCallback = (recordsPreCleanupNotesFromInput) => {
        recordsPreCleanupNotes.current = recordsPreCleanupNotesFromInput;
    }

    const handleRecordsPostCleanupNotesCallback = (recordsPostCleanupNotesFromInput) => {
        recordsPostCleanupNotes.current = recordsPostCleanupNotesFromInput;
    }

    const handlePreConversionManipulationCallback = (preConversionManipulationFromInput) => {
        preConversionManipulation.current = preConversionManipulationFromInput;
    }

    const handleCheckboxCallback = (checkedFromCheckbox) => {
        setFormReviewed(checkedFromCheckbox);
        setForceCheckboxOff(false);
    }

    const handleOnClickSubmit = async (submitted) => {
        if (submitted && !validLoadSheetNameEntered.current) {
            if (checkLoadSheetNameEntered()) {
                validLoadSheetNameEntered.current = true;
                setRendering(true);
                enterLoadSheetNameDisplay.current = "none";
                setSubmitButtonDisabled(true);
            } else {
                setInvalidLoadSheetNameError("Invalid pre-conversion load sheet name");
            }
        } else {
            if (submitted) {
                setSubmitButtonDisabled(true);
                setDisplaySubmitButtonWorkingIcon(true);
                runWriteAsyncFunctions();
            }
        }
    }

    const runWriteAsyncFunctions = async () => {
        console.log("starting promise chain...");
        console.log("assigning UIDs to new personnel");
        let newPersonnelToAdd = await assignUIDsToNewPersonnel();
        try {
            setNewPersonnel(newPersonnelToAdd);
            for (let i = 0; i < newPersonnelToAdd.length; i++) {
                await addNewPersonnelToDB(newPersonnelToAdd[i]);
            }
            await removeAdditionalProcessing();
            for (let i = 0; i < additionalProcessing.current.length; i++) {
                await addAdditionalProcessing(additionalProcessing.current[i]);
            }
            await removeContributions();
            for (let i = 0; i < contributors.current.length; i++) {
                await addContributions(contributors.current[i]);
            }
            await updateConversionChecklist();
            setAlert(true);
        } catch (err) {
            handleError("w");
        }
    }

    const assignUIDsToNewPersonnel = () => {
        try {
            async.current = true;
            // throw new Error("error");
            let tempArray = [];
            if (loadSheetOwner.current.value === -1) {
                loadSheetOwner.current.value = uuidv4();
                tempArray.push(loadSheetOwner.current);
                setNewPersonnel(tempArray);
            }
            if (decisionMaker.current.value === -1) {
                // Don't want to try and add duplicate personnel to DB
                decisionMaker.current.value = (decisionMaker.current.label.toLowerCase() === loadSheetOwner.current.label.toLowerCase()) ?
                    loadSheetOwner.current.value
                    : uuidv4();
                tempArray.push(decisionMaker.current);
                setNewPersonnel(tempArray);
            }
            for (let i = 0; i < contributors.current.length; i++) {
                if (contributors.current[i].value === -1) {
                    contributors.current[i].value = uuidv4();
                    tempArray.push(contributors.current[i]);
                }
            }
            async.current = false;
            return tempArray;
        } catch (err) {
            handleError("w");
        }
    }

    const addNewPersonnelToDB = async (personnel) => {
        if (!async.current) {
            console.log("adding new personnel");
            let name = personnel.label;
            let firstName = name.split(" ")[0];
            let lastName = name.substring(name.indexOf(" ") + 1);
            async.current = true;
            try {
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-personnel", {
                    pers_id: personnel.value,
                    pers_fname: firstName,
                    pers_lname: lastName
                }).then(response => {
                    async.current = false;
                });
            } catch (err) {
                console.log("error caught: ", err);
                handleError("w");
            }
        }
    }

    const removeAdditionalProcessing = async () => {
        if (!async.current) {
            try {
                console.log("removing additional processing");
                async.current = true;
                await Axios.delete(`https://voyant-conversion-checklist.herokuapp.com/remove-additional-processing/${conversionChecklistID.current}`, {
                }).then(response => {
                    async.current = false;
                });
            } catch (err) {
                console.log("error caught: ", err);
                handleError("w");
            }
        }
    }

    const addAdditionalProcessing = async (selectedValue) => {
        if (!async.current) {
            try {
                console.log("adding additional processing");
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-additional-processing", {
                    checklistID: conversionChecklistID.current,
                    apType: selectedValue.value
                }).then(response => {
                    async.current = false;
                });
            } catch (err) {
                console.log("error caught: ", err);
                handleError("w");
            }
        }
    }


    const removeContributions = async () => {
        if (!async.current) {
            try {
                console.log("removing contributions");
                async.current = true;
                await Axios.delete(`https://voyant-conversion-checklist.herokuapp.com/remove-contributions/${conversionChecklistID.current}`, {
                }).then(response => {
                    async.current = false;
                });
            } catch (err) {
                console.log("caught error: ", err);
                handleError("w");
            }
        }
    }

    const addContributions = async (contributor) => {
        if (!async.current) {
            try {
                console.log("adding contributions");
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-contribution", {
                    checklistID: conversionChecklistID.current,
                    contributorID: contributor.value
                }).then(response => {
                    async.current = false;
                });
            } catch (err) {
                console.log("caught error: ", err);
                handleError("w");
            }
        }
    }

    const updateConversionChecklist = async () => {
        if (!async.current) {
            try {
                console.log("updating conversion checklist");
                async.current = true;
                await Axios.put(`https://voyant-conversion-checklist.herokuapp.com/update-pre-conversion-checklist/${conversionChecklistID.current}`, {
                    loadSheetName: loadSheetName,
                    loadSheetOwner: loadSheetOwner.current.value,
                    decisionMaker: decisionMaker.current.value,
                    conversionType: conversionType.current.value ? conversionType.current.value : conversionType.current,
                    dataSources: dataSources.current,
                    uniqueRecordsPreCleanup: uniqueRecordsPreCleanup.current,
                    uniqueRecordsPostCleanup: uniqueRecordsPostCleanup.current,
                    recordsPreCleanupNotes: recordsPreCleanupNotes.current === null ? null : recordsPreCleanupNotes.current.trim() === "" ? null : recordsPreCleanupNotes.current,
                    recordsPostCleanupNotes: recordsPostCleanupNotes.current === null ? null : recordsPostCleanupNotes.current.trim() === "" ? null : recordsPostCleanupNotes.current,
                    preConversionManipulation: preConversionManipulation.current === null ? null : preConversionManipulation.current.trim() === "" ? null : preConversionManipulation.current
                }).then(response => {
                    async.current = false;
                });
            } catch (err) {
                console.log("error caught: ", err);
                handleError("w");
            }
        }
    }

    const handleValueUpdated = () => {
        valueUpdated.current = true;
        setForceCheckboxOff(true);
    }

    const handleError = (errorType) => {
        // Delay is set up just in case an error is generated before the is fully-displayed
        let delay = transitionElementOpacity === "100%" ? 500 : rendering ? 500 : 0;

        if (rendering) {
            setRendering(false);
        }

        setTimeout(() => {
            alertType.current = "error-alert";
            errorType === "r"
                ? alertMessage.current = "Apologies! We've encountered an error. Please attempt to re-load this page."
                : alertMessage.current = "Apologies! We've encountered an error. Please attempt to update your checklist again.";
            setAlert(true);
        }, delay);
    }

    const handleAlertClosed = (alertClosed) => {
        if (alertClosed) {
            console.log("navigating back");
            setAlert(false);
            navigate("/");
        }
    }

    useEffect(() => {
        if (rendering) {
            if (!validLoadSheetNameEntered.current) {
                runInitialReadAsyncFunctions();
            } else {
                runSecondaryReadAsyncFunctions(loadSheetName);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!validLoadSheetNameEntered.current) {
                loadSheetName.trim() !== "" ? setSubmitButtonDisabled(false) : setSubmitButtonDisabled(true);
            } else {
                if (loadSheetName.trim() !== "" && loadSheetOwner.current !== {} && decisionMaker.current !== {}
                    && conversionType.current !== "" && additionalProcessing.current.length && dataSources.current !== {}
                    && uniqueRecordsPreCleanup.current > 0 && uniqueRecordsPostCleanup.current > 0
                    && formReviewed && valueUpdated.current) {
                    setSubmitButtonDisabled(false);
                } else {
                    setSubmitButtonDisabled(true);
                }
            }
        }
    }, [validLoadSheetNameEntered, loadSheetName, loadSheetOwner, decisionMaker, conversionType, additionalProcessing,
        dataSources, uniqueRecordsPreCleanup, uniqueRecordsPostCleanup, formReviewed, valueUpdated, rendering]);

    try {
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
                    <div
                        className="view-pre-conversion-checklist"
                        style={{ display: viewPreConversionChecklistDisplay.current }}>
                        <div className="page-message">
                            Please Review/Modify the Fields Below:
                        </div>
                        <div className="view-pre-conversion-checklist-container">
                            <div className="view-pre-conversion-checklist-card">
                                <ViewPreConversionChecklistCard
                                    conversionTypeOptions={conversionTypeOptions}
                                    additionalProcessingOptions={additionalProcessingOptions}
                                    loadSheetName={handleLoadSheetNameCallback}
                                    submittedLoadSheetName={loadSheetName}
                                    personnelOptions={personnelOptions}
                                    submittedContributors={contributors.current}
                                    invalidPersonnel={contributors.current}
                                    loadSheetOwner={handleLoadSheetOwnerCallback}
                                    submittedLoadSheetOwner={loadSheetOwner.current}
                                    decisionMaker={handleDecisionMakerCallback}
                                    submittedDecisionMaker={decisionMaker.current}
                                    contributors={handleContributorsCallback}
                                    invalidContributors={
                                        loadSheetOwner.current.label && decisionMaker.current.label
                                            ? Array.from(new Set(contributors.current.concat([loadSheetOwner.current, decisionMaker.current]))) // TODO: fix this roundabout way of doing things
                                            : loadSheetOwner.current.label ? contributors.current.concat(loadSheetOwner.current)
                                                : decisionMaker.current.label ? contributors.current.concat(decisionMaker.current)
                                                    : contributors.current
                                    }
                                    conversionType={handleConversionTypeCallback}
                                    submittedConversionType={conversionType.current}
                                    additionalProcessing={handleAdditionalProcessingCallback}
                                    submittedAdditionalProcessing={additionalProcessing.current}
                                    dataSources={handleDataSourcesCallback}
                                    submittedDataSources={dataSources.current}
                                    uniqueRecordsPreCleanup={handleUqRecordsPreCleanupCallback}
                                    submittedUniqueRecordsPreCleanup={uniqueRecordsPreCleanup.current}
                                    uniqueRecordsPreCleanupLowerLimit={uniqueRecordsPostCleanup.current}
                                    uniqueRecordsPostCleanup={handleUqRecordsPostCleanupCallback}
                                    submittedUniqueRecordsPostCleanup={uniqueRecordsPostCleanup.current}
                                    uniqueRecordsPostCleanupUpperLimit={uniqueRecordsPreCleanup.current}
                                    recordsPreCleanupNotes={handleRecordsPreCleanupNotesCallback}
                                    submittedRecordsPreCleanupNotes={recordsPreCleanupNotes.current ? recordsPreCleanupNotes.current : ""}
                                    recordsPostCleanupNotes={handleRecordsPostCleanupNotesCallback}
                                    submittedRecordsPostCleanupNotes={recordsPostCleanupNotes.current ? recordsPostCleanupNotes.current : ""}
                                    preConversionManipulation={handlePreConversionManipulationCallback}
                                    submittedPreConversionManipulation={preConversionManipulation.current ? preConversionManipulation.current : ""}
                                    // postConversionLoadingErrors={handlePostConversionLoadingErrorsCallback}
                                    // postConversionValidationResults={handlePostConversionValidationResultsCallback}
                                    // postConversionChanges={handlePostConversionChangesCallback}
                                    forceCheckboxOff={forceCheckboxOff}
                                    checked={handleCheckboxCallback}
                                    valueUpdated={handleValueUpdated}
                                    updateButtonDisabled={submitButtonDisabled}
                                    updated={handleOnClickSubmit}
                                    displayFadingBalls={displaySubmitButtonWorkingIcon}>
                                </ViewPreConversionChecklistCard>
                            </div>
                        </div>
                    </div>
                </Fragment >
        )
    } catch (err) {
        console.log("error caught: ", err);
        handleError("r");
        return (
            <Fragment>
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
        )
    }
}

export default ViewPreConversionChecklist;