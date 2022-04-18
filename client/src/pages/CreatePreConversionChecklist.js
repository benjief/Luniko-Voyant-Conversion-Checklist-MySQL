import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import CreatePreConversionChecklistCard from "../components/CreatePreConversionChecklistCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/CreatePreConversionChecklist.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function CreatePreConversionChecklist() {
    // const navigate = useNavigate();
    const [rendering, setRendering] = useState(true);
    const [loadSheetName, setLoadSheetName] = useState("");
    // const [existingLoadSheetNames, setExistingLoadSheetNames] = useState([]);
    const existingLoadSheetNames = useRef([]);
    const [personnelOptions, setPersonnelOptions] = useState([]);
    const conversionChecklistID = useRef("");
    // const [lsOwnerAndDecisionMakerOptions, setLSOwnerAndDecisionMakerOptions] = useState([]);
    const [newPersonnel, setNewPersonnel] = useState([]);
    const [loadSheetOwner, setLoadSheetOwner] = useState({});
    const [decisionMaker, setDecisionMaker] = useState({});
    const [contributors, setContributors] = useState([]);
    const [conversionType, setConversionType] = useState("");
    const [additionalProcessing, setAdditionalProcessing] = useState([]);
    // const additionalProcessing = useRef([]);
    const [dataSources, setDataSources] = useState("");
    // const dataSources = useRef("");
    const [uniqueRecordsPreCleanup, setUniqueRecordsPreCleanup] = useState(0);
    const [uniqueRecordsPostCleanup, setUniqueRecordsPostCleanup] = useState(0);
    // const [recordsPreCleanupNotes, setRecordsPreCleanupNotes] = useState("");
    const recordsPreCleanupNotes = useRef("");
    // const [recordsPostCleanupNotes, setRecordsPostCleanupNotes] = useState("");
    const recordsPostCleanupNotes = useRef("");
    // const [preConversionManipulation, setPreConversionManipulation] = useState("");
    const preConversionManipulation = useRef("");
    const [formReviewed, setFormReviewed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const activeError = useRef(false);
    const [alert, setAlert] = useState(false);
    // const [alertType, setAlertType] = useState("success-alert");
    const alertType = useRef("success-alert");
    // const [alertMessage, setAlertMessage] = useState("Pre-conversion checklist successfully created!");
    const alertMessage = useRef("Pre-conversion checklist successfully submitted!");
    const loadErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to re-load this page.");
    const writeErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to re-submit your checklist.");
    const [displaySubmitButtonWorkingIcon, setDisplaySubmitButtonWorkingIcon] = useState(false);
    const async = useRef("false");

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

    const runReadAsyncFunctions = async () => {
        await getExistingLoadSheetNames();
        await getPersonnel();
        setRendering(false);
    }

    const getExistingLoadSheetNames = async () => {
        try {
            console.log("fetching existing load sheet names");
            async.current = true;
            await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-all-ls-names", {
            }).then(response => {
                populateExistingLoadSheetNamesList(response.data);
            });
        } catch (err) {
            console.log("error caught: ", err);
            handleError("r");
        }
    }

    const populateExistingLoadSheetNamesList = (existingLoadSheetNamesList) => {
        try {
            console.log("populating existing load sheet names list");
            let tempArray = [];
            for (let i = 0; i < existingLoadSheetNamesList.length; i++) {
                tempArray.push(existingLoadSheetNamesList[i].cc_load_sheet_name.toLowerCase());
            }
            existingLoadSheetNames.current = tempArray;
            console.log("existing load sheet names set");
            async.current = false;
        } catch (err) {
            console.log("error caught: ", err);
            handleError("r");
        }
    }

    const getPersonnel = async () => {
        if (!async.current) {
            try {
                console.log("fetching personnel!");
                async.current = true;
                await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-all-personnel", {
                }).then(response => {
                    populatePersonnelList(response.data);
                });
            } catch (err) {
                console.log("error caught: ", err);
                handleError("r");
            }
        }
    }

    const populatePersonnelList = (personnelList) => {
        try {
            console.log("populating personnel list");
            let tempArray = [];
            for (let i = 0; i < personnelList.length; i++) {
                let uid = personnelList[i].pers_id;
                let name = personnelList[i].pers_fname + " " + personnelList[i].pers_lname;
                let personnel = {
                    "value": uid,
                    "label": name
                };
                tempArray.push(personnel);
            }
            setPersonnelOptions([...tempArray]);
            async.current = false;
        } catch (err) {
            console.log("error caught: ", err);
            handleError("r");
        }
        setRendering(false);
    }

    const handleLoadSheetNameCallback = (loadSheetNameFromInput) => {
        setLoadSheetName(loadSheetNameFromInput);
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
        // setRecordsPreCleanupNotes(recordsPreCleanupNotesFromInput);
        recordsPreCleanupNotes.current = recordsPreCleanupNotesFromInput;
    }

    const handleRecordsPostCleanupNotesCallback = (recordsPostCleanupNotesFromInput) => {
        // setRecordsPostCleanupNotes(recordsPostCleanupNotesFromInput);
        recordsPostCleanupNotes.current = recordsPostCleanupNotesFromInput;
    }

    const handlePreConversionManipulationCallback = (preConversionManipulationFromInput) => {
        // setPreConversionManipulation(preConversionManipulationFromInput);
        preConversionManipulation.current = preConversionManipulationFromInput;
    }

    const handleCheckboxCallback = (checkedFromCheckbox) => {
        setFormReviewed(checkedFromCheckbox);
    }

    const handleOnClickSubmit = async (submitted) => {
        setSubmitButtonDisabled(true);
        setDisplaySubmitButtonWorkingIcon(true);
        if (submitted) {
            setSubmitButtonDisabled(true);
            setDisplaySubmitButtonWorkingIcon(true);
            runWriteAsyncFunctions();
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
            await addConversionChecklist();
            for (let i = 0; i < additionalProcessing.length; i++) {
                await addAdditionalProcessing(additionalProcessing[i]);
            }
            for (let i = 0; i < contributors.length; i++) {
                await addContributions(contributors[i]);
            }
            setAlert(true);
        } catch (err) {
            handleError("w");
        }
    }

    const assignUIDsToNewPersonnel = () => {
        console.log("assigning UIDs");
        try {
            // TODO: split these up into 3 helper functions?
            async.current = true;
            // throw new Error("error");
            let tempArray = [];
            if (loadSheetOwner.value === -1) {
                loadSheetOwner.value = uuidv4();
                tempArray.push(loadSheetOwner);
                setNewPersonnel(tempArray);
            }
            if (decisionMaker.value === -1) {
                // Don't want to try and add duplicate personnel to DB
                decisionMaker.value = (decisionMaker.label.toLowerCase() === loadSheetOwner.label.toLowerCase()) ?
                    loadSheetOwner.value
                    : uuidv4();
                tempArray.push(decisionMaker);
                setNewPersonnel(tempArray);
            }
            for (let i = 0; i < contributors.length; i++) {
                if (contributors[i].value === -1) {
                    contributors[i].value = uuidv4();
                    tempArray.push(contributors[i]);
                }
            }
            async.current = false;
            return tempArray;
        } catch (err) {
            console.log("error caught: ", err);
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

    const addConversionChecklist = async () => {
        if (!async.current) {
            try {
                console.log("Adding checklist...");
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-checklist", {
                    loadSheetName: loadSheetName,
                    loadSheetOwner: loadSheetOwner.value,
                    decisionMaker: decisionMaker.value,
                    conversionType: conversionType,
                    dataSources: dataSources,
                    uniqueRecordsPreCleanup: uniqueRecordsPreCleanup,
                    uniqueRecordsPostCleanup: uniqueRecordsPostCleanup,
                    recordsPreCleanupNotes: recordsPreCleanupNotes.current === null ? null : recordsPreCleanupNotes.current === "" ? null : recordsPreCleanupNotes.current,
                    recordsPostCleanupNotes: recordsPostCleanupNotes.current === null ? null : recordsPostCleanupNotes.current === "" ? null : recordsPostCleanupNotes.current,
                    preConversionManipulation: preConversionManipulation.current === null ? null : preConversionManipulation.current === "" ? null : preConversionManipulation.current
                }).then(response => {
                    async.current = false;
                    conversionChecklistID.current = response.data.insertId;
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
                // Remove checklist from the DB if additional processing can't be written
                await Axios.delete(`https://voyant-conversion-checklist.herokuapp.com/remove-checklist/${conversionChecklistID.current}`, {
                }).then(response => {
                    console.log("error caught: ", err);
                    handleError("w");
                });
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
                // Remove checklist from the DB if contributions can't be written
                await Axios.delete(`https://voyant-conversion-checklist.herokuapp.com/remove-checklist/${conversionChecklistID.current}`, {
                }).then(response => {
                    console.log("error caught: ", err);
                    handleError("w");
                });
            }
        }
    }

    // const handleSuccessfulSubmit = () => {
    //     // setTimeout(() => {
    //     //     setSubmitButtonText("Request Submitted!");
    //     // }, 500);
    //     setTimeout(() => {
    //         navigate("/");
    //     }, 1000);
    // }

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
            runReadAsyncFunctions();
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (loadSheetName.trim() !== "" && (loadSheetOwner.value && loadSheetOwner !== [])
                && (decisionMaker.value && decisionMaker !== [])
                && conversionType !== "" && additionalProcessing.length && dataSources.length
                && uniqueRecordsPreCleanup > 0 && uniqueRecordsPostCleanup > 0
                && formReviewed) {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }
        }
    }, [loadSheetName, loadSheetOwner, decisionMaker, conversionType, additionalProcessing,
        dataSources, uniqueRecordsPreCleanup, uniqueRecordsPostCleanup, formReviewed, rendering]);

    /* try { */
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
            activeError.current
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
                    <div className="create-pre-conversion-checklist">
                        <div className="page-message">
                            Please Fill In the Fields Below:
                        </div>
                        <div className="create-pre-conversion-checklist-container">
                            <div className="create-pre-conversion-checklist-card">
                                <CreatePreConversionChecklistCard
                                    conversionTypeOptions={conversionTypeOptions}
                                    additionalProcessingOptions={additionalProcessingOptions}
                                    loadSheetName={handleLoadSheetNameCallback}
                                    personnelOptions={personnelOptions}
                                    invalidPersonnel={contributors}
                                    invalidLoadSheetNames={existingLoadSheetNames.current}
                                    // loadSheetOwnerOptions={loadSheetOwnerOptions}
                                    // decisionMakerOptions={decisionMakerOptions}
                                    // contributorOptions={contributorOptions}
                                    loadSheetOwner={handleLoadSheetOwnerCallback}
                                    decisionMaker={handleDecisionMakerCallback}
                                    // invalidPersonnel={contributors}
                                    contributors={handleContributorsCallback}
                                    invalidContributors={
                                        loadSheetOwner.label && decisionMaker.label ? [loadSheetOwner, decisionMaker]
                                            : loadSheetOwner.label ? [loadSheetOwner]
                                                : decisionMaker.label ? [decisionMaker]
                                                    : []
                                    }
                                    conversionType={handleConversionTypeCallback}
                                    additionalProcessing={handleAdditionalProcessingCallback}
                                    dataSources={handleDataSourcesCallback}
                                    uniqueRecordsPreCleanup={handleUqRecordsPreCleanupCallback}
                                    uniqueRecordsPreCleanupLowerLimit={uniqueRecordsPostCleanup}
                                    uniqueRecordsPostCleanup={handleUqRecordsPostCleanupCallback}
                                    uniqueRecordsPostCleanupUpperLimit={uniqueRecordsPreCleanup}
                                    recordsPreCleanupNotes={handleRecordsPreCleanupNotesCallback}
                                    recordsPostCleanupNotes={handleRecordsPostCleanupNotesCallback}
                                    preConversionManipulation={handlePreConversionManipulationCallback}
                                    // postConversionLoadingErrors={handlePostConversionLoadingErrorsCallback}
                                    // postConversionValidationResults={handlePostConversionValidationResultsCallback}
                                    // postConversionChanges={handlePostConversionChangesCallback}
                                    checked={handleCheckboxCallback}
                                    submitButtonDisabled={submitButtonDisabled}
                                    submitted={handleOnClickSubmit}
                                    displayFadingBalls={displaySubmitButtonWorkingIcon}>
                                </CreatePreConversionChecklistCard>
                            </div>
                        </div>
                    </div>
                </Fragment >
    )
    /* } catch (err) {
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
    } */
}

export default CreatePreConversionChecklist;