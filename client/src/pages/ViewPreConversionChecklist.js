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
    const [loadSheetOwner, setLoadSheetOwner] = useState([]);
    const [decisionMaker, setDecisionMaker] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [conversionType, setConversionType] = useState("");
    const [additionalProcessing, setAdditionalProcessing] = useState([]);
    const [dataSources, setDataSources] = useState("");
    const [uniqueRecordsPreCleanup, setUniqueRecordsPreCleanup] = useState(0);
    const [uniqueRecordsPostCleanup, setUniqueRecordsPostCleanup] = useState(0);
    const recordsPreCleanupNotes = useRef("");
    const recordsPostCleanupNotes = useRef("");
    const preConversionManipulation = useRef("");
    const [formProps, setFormProps] = useState({
        loadSheetName: "",
        personnelOptions: [],
        loadSheetOwner: [],
        decisionMaker: [],
        contributors: [],
        conversionType: "",
        additionalProcessing: [],
        dataSources: "",
        uniqueRecordsPreCleanup: 0,
        uniqueRecordsPostCleanup: 0,
        recordsPreCleanupNotes: "",
        recordsPostCleanupNotes: "",
        preConversionManipulation: ""
    });
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
    const loadErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to re-load this page.");
    const writeErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to update your checklist again.");
    const [displaySubmitButtonWorkingIcon, setDisplaySubmitButtonWorkingIcon] = useState(false);
    const activeError = useRef(false);
    const checklistInfoLoaded = useRef(false);
    const async = useRef(false);

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
        setRendering(false);
    }

    const getValidLoadSheetNames = async () => {
        try {
            console.log("fetching valid load sheet names");
            async.current = true;
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
        try {
            console.log("populating load sheet name list");
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

    const runSecondaryReadAsyncFunctions = async (loadSheetName) => {
        checklistInfoLoaded.current = true;
        let conversionChecklistInfo = await getConversionChecklistInfo(loadSheetName);
        // This needs to be in a try-catch block, in case the first function errors out
        try {
            let tempConversionChecklistID = conversionChecklistInfo[0].cc_id
            conversionChecklistID.current = tempConversionChecklistID;
            let conversionChecklistPersonnel = [conversionChecklistInfo[0].cc_load_sheet_owner, conversionChecklistInfo[0].cc_decision_maker];
            setFormPropsForFieldAndValue("loadSheetOwner", await getPersonnelInfo(conversionChecklistPersonnel[0]));
            setFormPropsForFieldAndValue("decisionMaker", await getPersonnelInfo(conversionChecklistPersonnel[1]));
            await populateSubmittedFields(conversionChecklistInfo[0]);
            await getAdditionalProcessing();
            await getAvailablePersonnel();
            await getSubmittedContributors();
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    }

    const getConversionChecklistInfo = async (loadSheetName) => {
        console.log("fetching conversion checklist info");
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
                console.log("error caught:", err);
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
                setFormPropsForFieldAndValue("conversionType", tempConversionType);
                // setConversionType(tempConversionType);
                setFormPropsForFieldAndValue("dataSources", conversionChecklistInfo.cc_data_sources);
                // setDataSources(conversionChecklistInfo.cc_data_sources);
                setFormPropsForFieldAndValue("uniqueRecordsPreCleanup", conversionChecklistInfo.uq_records_pre_cleanup);
                // setUniqueRecordsPreCleanup(conversionChecklistInfo.uq_records_pre_cleanup);
                setFormPropsForFieldAndValue("uniqueRecordsPostCleanup", conversionChecklistInfo.uq_records_post_cleanup);
                // setUniqueRecordsPostCleanup(conversionChecklistInfo.uq_records_post_cleanup);
                setFormPropsForFieldAndValue("recordsPreCleanupNotes", conversionChecklistInfo.cc_records_pre_cleanup_notes);
                // recordsPreCleanupNotes.current = conversionChecklistInfo.cc_records_pre_cleanup_notes;
                setFormPropsForFieldAndValue("recordsPostCleanupNotes", conversionChecklistInfo.cc_records_post_cleanup_notes);
                // recordsPostCleanupNotes.current = conversionChecklistInfo.cc_records_post_cleanup_notes;
                setFormPropsForFieldAndValue("preConversionManipulation", conversionChecklistInfo.cc_pre_conversion_manipulation);
                // preConversionManipulation.current = conversionChecklistInfo.cc_pre_conversion_manipulation;
                async.current = false;
            } catch (err) {
                console.log("error caught:", err);
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
                }).then(response => {
                    populateAdditionalProcessingList(response.data);
                });
            } catch (err) {
                console.log("error caught:", err);
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
            setFormPropsForFieldAndValue("additionalProcessing", tempArray);
            // setAdditionalProcessing(tempArray);
            async.current = false;
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    }

    const getAvailablePersonnel = async () => {
        if (!async.current) {
            console.log("fetching available personnel");
            try {
                async.current = true;
                await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-all-personnel", {
                }).then(response => {
                    populatePersonnelList(response.data);
                });
            } catch (err) {
                console.log("error caught:", err);
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
            setFormPropsForFieldAndValue("personnelOptions", tempArray);
            // setPersonnelOptions([...tempArray]);
            async.current = false;
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
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
                let uid = submittedContributorsList[i].pers_id;
                let name = submittedContributorsList[i].pers_name;
                let personnel = {
                    "value": uid,
                    "label": name
                };
                tempArray.push(personnel);
            }
            setFormPropsForFieldAndValue("contributors", tempArray);
            // setContributors(tempArray);
            async.current = false;
            setRendering(false, viewPreConversionChecklistDisplay.current = "visible");

        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    }

    // const handleLoadSheetNameCallback = (lsNameFromInput) => {
    //     setLoadSheetName(lsNameFromInput);
    //     setInvalidLoadSheetNameError("");
    // }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    const checkLoadSheetNameEntered = () => {
        for (let i = 0; i < validLoadSheetNames.current.length; i++) {
            let escapeRegExpMatch = formProps["loadSheetName"].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`\\b${escapeRegExpMatch}\\b`).test(validLoadSheetNames.current[i])) {
                return true;
            }
        }
        return false;
    }

    const handleFormCallback = (returnedObject) => {
        // console.log(returnedObject);
        const field = returnedObject.field;
        const value = returnedObject.value;
        // console.log(value);
        if (field === "loadSheetName") {
            // console.log("this is a load sheet name");
            setInvalidLoadSheetNameError("");
        }
        // console.log(formProps[field]);
        if (field !== "loadSheetName") {
            console.log("running setFormProps");
        }
        setFormPropsForFieldAndValue(field, value);
        // setFormProps((prevState) => ({
        //     ...prevState,
        //     [field]: value,
        // }));
    }

    const setFormPropsForFieldAndValue = (field, value) => {
        setFormProps((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }

    const handleLoadSheetOwnerCallback = (loadSheetOwnerFromSelector) => {
        setLoadSheetOwner(loadSheetOwnerFromSelector);
    }

    const handleDecisionMakerCallback = (decisionMakerFromSelector) => {
        setDecisionMaker(decisionMakerFromSelector);
    }

    const handleContributorsCallback = (contributorsFromSelector) => {
        setContributors(contributorsFromSelector);
    }

    const handleConversionTypeCallback = (conversionTypeFromSelector) => {
        setConversionType(conversionTypeFromSelector);
    }

    const handleAdditionalProcessingCallback = (additionalProcessingFromSelector) => {
        setAdditionalProcessing(additionalProcessingFromSelector);
    }

    const handleDataSourcesCallback = (dataSourcesFromInput) => {
        setDataSources(dataSourcesFromInput);
    }

    const handleUqRecordsPreCleanupCallback = (uqRecordsPreCleanupFromInput) => {
        setUniqueRecordsPreCleanup(uqRecordsPreCleanupFromInput ? uqRecordsPreCleanupFromInput : 0);
    }

    const handleUqRecordsPostCleanupCallback = (uqRecordsPostCleanupFromInput) => {
        setUniqueRecordsPostCleanup(uqRecordsPostCleanupFromInput ? uqRecordsPostCleanupFromInput : 0);
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
        console.log(newPersonnelToAdd);
        try {
            // setNewPersonnel(newPersonnelToAdd);
            for (let i = 0; i < newPersonnelToAdd.length; i++) {
                await addNewPersonnelToDB(newPersonnelToAdd[i]);
            }
            await removeAdditionalProcessing();
            for (let i = 0; i < additionalProcessing.length; i++) {
                await addAdditionalProcessing(additionalProcessing[i]);
            }
            await removeContributions();
            for (let i = 0; i < contributors.length; i++) {
                await addContributions(contributors[i]);
            }
            await updateConversionChecklist();
            setAlert(true);
        } catch (err) {
            handleError("w");
        }
    }

    const assignUIDsToNewPersonnel = () => {
        console.log("assigning UIDs to new personnel");
        try {
            // TODO: split these up into 3 helper functions?
            async.current = true;
            let tempArray = [];
            if (loadSheetOwner.value === -1) {
                loadSheetOwner.value = uuidv4();
                tempArray.push(loadSheetOwner);
            }
            if (decisionMaker.value === -1) {
                // Don't want to try and add duplicate personnel to DB
                decisionMaker.value = (decisionMaker.label.toLowerCase() === loadSheetOwner.label.toLowerCase()) ?
                    loadSheetOwner.value
                    : uuidv4();
                tempArray.push(decisionMaker);
            }
            for (let i = 0; i < contributors.length; i++) {
                if (contributors[i].value === -1) {
                    contributors[i].value = uuidv4();
                    tempArray.push(contributors[i]);
                }
            }
            console.log("temp array: ", tempArray);
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
                console.log("error caught:", err);
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
                console.log("error caught:", err);
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
                console.log("error caught:", err);
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
                    loadSheetOwner: loadSheetOwner.value,
                    decisionMaker: decisionMaker.value,
                    conversionType: conversionType.value ? conversionType.value : conversionType,
                    dataSources: dataSources,
                    uniqueRecordsPreCleanup: uniqueRecordsPreCleanup,
                    uniqueRecordsPostCleanup: uniqueRecordsPostCleanup,
                    recordsPreCleanupNotes: recordsPreCleanupNotes.current === null ? null : recordsPreCleanupNotes.current.trim() === "" ? null : recordsPreCleanupNotes.current,
                    recordsPostCleanupNotes: recordsPostCleanupNotes.current === null ? null : recordsPostCleanupNotes.current.trim() === "" ? null : recordsPostCleanupNotes.current,
                    preConversionManipulation: preConversionManipulation.current === null ? null : preConversionManipulation.current.trim() === "" ? null : preConversionManipulation.current
                }).then(response => {
                    async.current = false;
                });
            } catch (err) {
                console.log("error caught:", err);
                handleError("w");
            }
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
            } else if (!checklistInfoLoaded.current) {
                console.log(checklistInfoLoaded.current);
                console.log("running secondary read functions");
                runSecondaryReadAsyncFunctions(formProps["loadSheetName"]);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!validLoadSheetNameEntered.current) {
                formProps["loadSheetName"].trim() !== "" ? setSubmitButtonDisabled(false) : setSubmitButtonDisabled(true);
            } else {
                if (formProps["loadSheetName"].trim() !== "" && (formProps["loadSheetOwner"] && formProps["loadSheetOwner"].value && formProps["loadSheetOwner"] !== [])
                    && (formProps["decisionMaker"] && formProps["decisionMaker"].value && formProps["decisionMaker"] !== [])
                    && formProps["conversionType"] !== "" && formProps["additionalProcessing"].length && formProps["dataSources"].length
                    && formProps["uniqueRecordsPreCleanup"] > 0 && formProps["uniqueRecordsPostCleanup"] > 0
                    && formReviewed && valueUpdated.current) { // TODO: make formReviewed a part of formProps?
                    setSubmitButtonDisabled(false);
                } else {
                    setSubmitButtonDisabled(true);
                }
            }
        }
    }, [checklistInfoLoaded.current, validLoadSheetNameEntered, formProps, formReviewed, valueUpdated, rendering]);

    /* try { */
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
                                    loadSheetName={handleFormCallback}
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
                                    // loadSheetName={handleLoadSheetNameCallback}
                                    submittedLoadSheetName={formProps["loadSheetName"]}
                                    personnelOptions={formProps["personnelOptions"]}
                                    invalidPersonnel={formProps["contributors"]}
                                    loadSheetOwner={handleFormCallback}
                                    submittedLoadSheetOwner={formProps["loadSheetOwner"]}
                                    decisionMaker={handleFormCallback}
                                    submittedDecisionMaker={formProps["decisionMaker"]}
                                    contributors={handleFormCallback}
                                    submittedContributors={formProps["contributors"]}
                                    invalidContributors={
                                        formProps["loadSheetOwner"].label && formProps["decisionMaker"].label
                                            ? Array.from(new Set(formProps["contributors"].concat([formProps["loadSheetOwner"], formProps["decisionMaker"]]))) // TODO: fix this roundabout way of doing things
                                            : formProps["loadSheetOwner"].label ? formProps["contributors"].concat(formProps["loadSheetOwner"])
                                                : formProps["decisionMaker"].label ? formProps["contributors"].concat(formProps["decisionMaker"])
                                                    : formProps["contributors"]
                                    }
                                    conversionType={handleFormCallback}
                                    // conversionType={handleConversionTypeCallback}
                                    submittedConversionType={formProps["conversionType"]}
                                    additionalProcessing={handleAdditionalProcessingCallback}
                                    submittedAdditionalProcessing={formProps["additionalProcessing"]}
                                    dataSources={handleFormCallback}
                                    submittedDataSources={formProps["dataSources"]}
                                    uniqueRecordsPreCleanup={handleUqRecordsPreCleanupCallback}
                                    submittedUniqueRecordsPreCleanup={formProps["uniqueRecordsPreCleanup"]}
                                    // uniqueRecordsPreCleanupLowerLimit={formProps["uniqueRecordsPostCleanup"]}
                                    uniqueRecordsPostCleanup={handleUqRecordsPostCleanupCallback}
                                    submittedUniqueRecordsPostCleanup={formProps["uniqueRecordsPostCleanup"]}
                                    // uniqueRecordsPostCleanupUpperLimit={formProps["uniqueRecordsPreCleanup"]}
                                    recordsPreCleanupNotes={handleRecordsPreCleanupNotesCallback}
                                    submittedRecordsPreCleanupNotes={formProps["recordsPreCleanupNotes"] ? formProps["recordsPreCleanupNotes"] : ""}
                                    recordsPostCleanupNotes={handleRecordsPostCleanupNotesCallback}
                                    submittedRecordsPostCleanupNotes={formProps["recordsPostCleanupNotes"] ? formProps["recordsPostCleanupNotes"] : ""}
                                    preConversionManipulation={handlePreConversionManipulationCallback}
                                    submittedPreConversionManipulation={formProps["preConversionManipulation"] ? formProps["preConversionManipulation"] : ""}
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
    /* } catch (err) {
        console.log("error caught:", err);
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
    } */
}

export default ViewPreConversionChecklist;