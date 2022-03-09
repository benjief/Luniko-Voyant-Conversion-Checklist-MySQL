import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import EnterLoadSheetNameCard from "../components/EnterLoadSheetNameCard";
import ViewPreConversionChecklistCard from "../components/ViewPreConversionChecklistCard";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/ViewPreConversionChecklist.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function ViewPreConversionChecklist() {
    // const navigate = useNavigate();
    const [rendering, setRendering] = useState(true);
    const [enterLoadSheetNameDisplay, setEnterLoadSheetNameDisplay] = useState("visible");
    const [viewPreConversionChecklistDisplay, setViewPreConversionChecklistDisplay] = useState("none");
    const [validLoadSheetNames, setValidLoadSheetNames] = useState([]);
    const [validLoadSheetNameEntered, setValidLoadSheetNameEntered] = useState(false);
    const [invalidLoadSheetNameError, setInvalidLoadSheetNameError] = useState("");
    const [loadSheetName, setLoadSheetName] = useState("");
    const [personnelOptions, setPersonnelOptions] = useState([]);
    // const [lsOwnerAndDecisionMakerOptions, setLSOwnerAndDecisionMakerOptions] = useState([]);
    const [newPersonnel, setNewPersonnel] = useState([]);
    const [loadSheetOwner, setLoadSheetOwner] = useState([]);
    const [decisionMaker, setDecisionMaker] = useState([]);
    const [submittedContributors, setSubmittedContributors] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [conversionType, setConversionType] = useState("");
    const [additionalProcessing, setAdditionalProcessing] = useState("");
    const [dataSources, setDataSources] = useState("");
    const [uniqueRecordsPreCleanup, setUniqueRecordsPreCleanup] = useState(0);
    const [uniqueRecordsPostCleanup, setUniqueRecordsPostCleanup] = useState(0); // Needs to be <= pre #
    const [recordsPreCleanupNotes, setRecordsPreCleanupNotes] = useState("");
    const [recordsPostCleanupNotes, setRecordsPostCleanupNotes] = useState("");
    const [preConversionManipulation, setPreConversionManipulation] = useState("");
    const [postConversionLoadingErrors, setPostConversionLoadingErrors] = useState("");
    const [postConversionValidationResults, setPostConversionValidationResults] = useState("");
    const [postConversionChanges, setPostConversionChanges] = useState("");
    const [formReviewed, setFormReviewed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [valueUpdated, setValueUpdated] = useState(false);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
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

    const getValidLoadSheetNames = async () => {
        await Axios.get("http://localhost:3001/get-valid-unapproved-ls-names", {
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
            setValidLoadSheetNames(...tempArray);
        }
        setRendering(false);
    }

    const getConversionChecklistInfo = async (loadSheetName) => {
        await Axios.get(`http://localhost:3001/get-conversion-checklist-info/${loadSheetName}`, {
        }).then((response) => {
            getSubmittedContributors(response.data.cc_id);
            populateSubmittedFields(response.data);
        })
    }

    const populateSubmittedFields = (conversionChecklistInfo) => {
        new Promise(resolve => {
            setLoadSheetOwner(conversionChecklistInfo.cc_load_sheet_owner);
            setDecisionMaker(conversionChecklistInfo.cc_decision_maker);
            setConversionType(conversionChecklistInfo.cc_conversion_type);
            setAdditionalProcessing(conversionChecklistInfo.cc_additional_processing);
            setDataSources(conversionChecklistInfo.cc_data_sources);
            setUniqueRecordsPreCleanup(conversionChecklistInfo.uq_records_pre_cleanup);
            setUniqueRecordsPostCleanup(conversionChecklistInfo.uq_records_post_cleanup);
            setRecordsPreCleanupNotes(conversionChecklistInfo.cc_records_pre_cleanup_notes);
            setRecordsPostCleanupNotes(conversionChecklistInfo.cc_records_post_cleanup_notes);
            setPreConversionManipulation(conversionChecklistInfo.cc_pre_conversion_manipulation);
        }).then(() => {
            getPersonnel();
        })
    }

    // Personnel functions
    const getSubmittedContributors = async (ccID) => {
        await Axios.get(`http://localhost:3001/get-submitted-contributors/${ccID}`, {
        }).then((response) => {
            populateSubmittedContributorsList(response.data);
        });
    }

    const populateSubmittedContributorsList = (submittedContributorsList) => {
        if (submittedContributorsList.length) {
            let tempArray = [];
            for (let i = 0; i < tempArray.length; i++) {
                let uid = submittedContributorsList[i].pers_id;
                let name = submittedContributorsList[i].pers_name;
                let personnel = {
                    "value": uid,
                    "label": name
                };
                tempArray.push(personnel);
            }
            setSubmittedContributors(...tempArray);
        }
    }

    const getPersonnel = async () => {
        // console.log("fetching personnel!");
        await Axios.get("http://localhost:3001/get-all-personnel", {
        }).then((response) => {
            populatePersonnelList(response.data);
        });
    }

    const populatePersonnelList = (personnelList) => {
        if (personnelList.length) { // TODO: change this in other implementations where you had length > 1?
            let tempArray = [];
            for (let i = 0; i < personnelList.length; i++) {
                let uid = personnelList[i].pers_id;
                let name = personnelList[i].pers_fname + " " + personnelList[i].pers_lname; // TODO: change this (query-side) and CONCAT'd name?
                let personnel = {
                    "value": uid,
                    "label": name
                };
                tempArray.push(personnel);
            }
            setPersonnelOptions(...tempArray);
        }
        // console.log("personnel fetched!");
        setRendering(false);
    }

    const checkValueUpdated = () => {
        if (!valueUpdated) {
            setValueUpdated(true);
            setFormReviewed(false);
        }
    }

    const handleLoadSheetNameCallback = (lsNameFromInput) => {
        setLoadSheetName(lsNameFromInput);
        setInvalidLoadSheetNameError("")
        checkValueUpdated();
    }

    const checkLoadSheetNameEntered = () => {
        return validLoadSheetNames.includes(loadSheetName.toLowerCase());
    }

    const handleLoadSheetOwnerCallback = (lsOwnerFromSelector) => {
        setLoadSheetOwner(lsOwnerFromSelector);
        checkValueUpdated();
    }

    const handleDecisionMakerCallback = (decisionMakerFromSelector) => {
        setDecisionMaker(decisionMakerFromSelector);
        checkValueUpdated();
    }

    const handleContributorsCallback = (contributorsFromSelector) => {
        setContributors(contributorsFromSelector);
        checkValueUpdated();
    }

    const handleConversionTypeCallback = (conversionTypeFromSelector) => {
        setConversionType(conversionTypeFromSelector);
        checkValueUpdated();
    }

    const handleAdditionalProcessingCallback = (additionalProcessingFromSelector) => {
        setAdditionalProcessing(additionalProcessingFromSelector);
        checkValueUpdated();
    }

    const handleDataSourcesCallback = (dataSourcesFromInput) => {
        setDataSources(dataSourcesFromInput);
        checkValueUpdated();
    }

    const handleUqRecordsPreCleanupCallback = (uqRecordsPreCleanupFromInput) => {
        setUniqueRecordsPreCleanup(uqRecordsPreCleanupFromInput);
        checkValueUpdated();
    }

    const handleUqRecordsPostCleanupCallback = (uqRecordsPostCleanupFromInput) => {
        setUniqueRecordsPostCleanup(uqRecordsPostCleanupFromInput);
        checkValueUpdated();
    }

    const handleRecordsPreCleanupNotesCallback = (recordsPreCleanupNotesFromInput) => {
        setRecordsPreCleanupNotes(recordsPreCleanupNotesFromInput);
        checkValueUpdated();
    }

    const handleRecordsPostCleanupNotesCallback = (recordsPostCleanupNotesFromInput) => {
        setRecordsPostCleanupNotes(recordsPostCleanupNotesFromInput);
        checkValueUpdated();
    }

    const handlePreConversionManipulationCallback = (preConversionManipulationFromInput) => {
        setPreConversionManipulation(preConversionManipulationFromInput);
        checkValueUpdated();
    }

    const handleCheckboxCallback = (checkedFromCheckbox) => {
        setFormReviewed(checkedFromCheckbox);
    }

    // const handlePostConversionLoadingErrorsCallback = (postConversionLoadingErrorsFromInput) => {
    //     setPostConversionLoadingErrors(postConversionLoadingErrorsFromInput);
    // }

    // const handlePostConversionValidationResultsCallback = (postConversionValidationResultsFromInput) => {
    //     setPostConversionValidationResults(postConversionValidationResultsFromInput);
    // }

    // const handlePostConversionChangesCallback = (postConversionChangesFromInput) => {
    //     setPostConversionChanges(postConversionChangesFromInput);
    // }

    const handleOnClickSubmit = async (submitted) => {
        if (!validLoadSheetNameEntered && submitted) {
            if (checkLoadSheetNameEntered()) {
                setValidLoadSheetNameEntered(true)
                setRendering(true);
                setEnterLoadSheetNameDisplay("none");
                setSubmitButtonDisabled(true);
            } else {
                setInvalidLoadSheetNameError("Invalid load sheet name");
            }
        } else {
            if (submitted) {
                await assignUIDsToNewPersonnel();
                await addNewPersonnelToDB();
                addConversionChecklist();
            }
        }
    }

    const assignUIDsToNewPersonnel = () => {
        console.log("Assigning UIDs...");
        new Promise(resolve => {
            if (loadSheetOwner.value === -1) {
                loadSheetOwner.value = uuidv4();
                newPersonnel.push(loadSheetOwner);
                setNewPersonnel(newPersonnel);
            }
            if (decisionMaker.value === -1) {
                // Don't want to try and add duplicate personnel to DB
                decisionMaker.value = (decisionMaker.label.toLowerCase() === loadSheetOwner.label.toLowerCase()) ?
                    loadSheetOwner.value
                    : uuidv4();
                newPersonnel.push(decisionMaker);
                setNewPersonnel(newPersonnel);
            }
            for (let i = 0; i < contributors.length; i++) {
                if (contributors[i].value === -1) {
                    contributors[i].value = uuidv4();
                    newPersonnel.push(contributors[i]);
                }
            }
            setNewPersonnel(newPersonnel);
        });
        console.log("UIDs assigned...")
    }

    const addNewPersonnelToDB = () => {
        console.log("Adding personnel to DB...");
        new Promise(resolve => {
            // console.log(newPersonnel);
            for (let i = 0; i < newPersonnel.length; i++) {
                let name = newPersonnel[i].label;
                let firstName = name.split(" ")[0];
                let lastName = name.substring(name.indexOf(" ") + 1);
                Axios.post("http://localhost:3001/add-personnel", {
                    pers_id: newPersonnel[i].value,
                    pers_fname: firstName,
                    pers_lname: lastName
                })
            }
        });
        console.log("Personnel added to DB...");
    }

    const addConversionChecklist = () => {
        console.log("Adding checklist...");
        Axios.post("http://localhost:3001/add-checklist", {
            loadSheetName: loadSheetName,
            loadSheetOwner: loadSheetOwner.value,
            decisionMaker: decisionMaker.value,
            conversionType: conversionType,
            additionalProcessing: additionalProcessing,
            dataSources: dataSources,
            uniqueRecordsPreCleanup: uniqueRecordsPreCleanup,
            uniqueRecordsPostCleanup: uniqueRecordsPostCleanup,
            recordsPreCleanupNotes: recordsPreCleanupNotes === "" ? null : recordsPreCleanupNotes,
            recordsPostCleanupNotes: recordsPostCleanupNotes === "" ? null : recordsPostCleanupNotes,
            preConversionManipulation: preConversionManipulation === "" ? null : preConversionManipulation
        }).then((response) => {
            setSubmitted(true);
            console.log("Pre-conversion checklist successfully added!!");
            if (contributors.length !== 0) {
                console.log(response.data);
                addContributions(response.data.insertId);
            } else {
                handleSuccessfulSubmit();
            }
        });
    };

    const addContributions = (conversionChecklistID) => {
        console.log("Moving on to contributions...");
        for (let i = 0; i < contributors.length; i++) {
            Axios.post("http://localhost:3001/add-contribution", {
                checklistID: conversionChecklistID,
                contributorID: contributors[i].value
            }).then((response) => {
                console.log("Contribution successfully added!");
                handleSuccessfulSubmit();
            });
        };
    };

    const handleSuccessfulSubmit = () => {
        // setTimeout(() => {
        //     setSubmitButtonText("Request Submitted!");
        // }, 500);
        setTimeout(() => {
            navigate("/");
        }, 1000);
    }

    useEffect(() => {
        if (rendering) {
            if (!validLoadSheetNameEntered) {
                getValidLoadSheetNames();
            } else {
                getPersonnel();
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!validLoadSheetNameEntered) {
                loadSheetName.trim() !== "" ? setSubmitButtonDisabled(false) : setSubmitButtonDisabled(true);
            } else {
                setViewPreConversionChecklistDisplay("visible");
                if (loadSheetName.trim() !== "" && loadSheetOwner !== {} && decisionMaker !== {}
                    && conversionType !== "" && additionalProcessing !== "" && dataSources !== {}
                    && uniqueRecordsPreCleanup > 0 && uniqueRecordsPostCleanup > 0 && formReviewed
                    && valueUpdated) {
                    setSubmitButtonDisabled(false);
                } else {
                    setSubmitButtonDisabled(true);
                }
            }
        }
    }, [validLoadSheetNameEntered, loadSheetName, loadSheetOwner, decisionMaker, conversionType, additionalProcessing,
        dataSources, uniqueRecordsPreCleanup, uniqueRecordsPostCleanup, formReviewed, valueUpdated, rendering]);

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
                <div
                    className="enter-valid-load-sheet-name"
                    style={{ display: enterLoadSheetNameDisplay }}>
                    <div className="enter-valid-load-sheet-name-container">
                        <div className="enter-valid-load-sheet-name-card">
                            <EnterLoadSheetNameCard
                                loadSheetName={handleLoadSheetNameCallback}
                                submitted={handleOnClickSubmit}
                                submitButtonDisabled={submitButtonDisabled}
                                textAuthenticationError={invalidLoadSheetNameError}>
                            </EnterLoadSheetNameCard>
                        </div>
                    </div>
                </div>
                <div
                    className="view-pre-conversion-checklist"
                    style={{ display: viewPreConversionChecklistDisplay }}>
                    <div className="view-pre-conversion-checklist-container">
                        <div className="view-pre-conversion-checklist-card">
                            <ViewPreConversionChecklistCard
                                conversionTypeOptions={conversionTypeOptions}
                                additionalProcessingOptions={additionalProcessingOptions}
                                loadSheetName={handleLoadSheetNameCallback}
                                submittedLoadSheetName={loadSheetName}
                                personnelOptions={personnelOptions}
                                invalidPersonnel={[submittedContributors, contributors]}
                                // loadSheetOwnerOptions={loadSheetOwnerOptions}
                                // decisionMakerOptions={decisionMakerOptions}
                                // contributorOptions={contributorOptions}
                                loadSheetOwner={handleLoadSheetOwnerCallback}
                                submittedLoadSheetOwner={loadSheetOwner}
                                decisionMaker={handleDecisionMakerCallback}
                                submittedDecisionMaker={decisionMaker}
                                // invalidPersonnel={contributors}
                                contributors={handleContributorsCallback}
                                invalidContributors={
                                    loadSheetOwner.label && decisionMaker.label ? [submittedContributors, loadSheetOwner, decisionMaker]
                                        : loadSheetOwner.label ? [submittedContributors, loadSheetOwner]
                                            : decisionMaker.label ? [submittedContributors, decisionMaker]
                                                : [submittedContributors]
                                }
                                conversionType={handleConversionTypeCallback}
                                submittedConversionType={conversionType}
                                additionalProcessing={handleAdditionalProcessingCallback}
                                submittedAdditionalProcessing={additionalProcessing}
                                dataSources={handleDataSourcesCallback}
                                submittedDataSources={dataSources}
                                uniqueRecordsPreCleanup={handleUqRecordsPreCleanupCallback}
                                submittedUniqueRecordsPreCleanup={uniqueRecordsPreCleanup}
                                uniqueRecordsPreCleanupLowerLimit={uniqueRecordsPostCleanup}
                                uniqueRecordsPostCleanup={handleUqRecordsPostCleanupCallback}
                                submittedUniqueRecordsPostCleanup={uniqueRecordsPostCleanup}
                                uniqueRecordsPostCleanupUpperLimit={uniqueRecordsPreCleanup}
                                recordsPreCleanupNotes={handleRecordsPreCleanupNotesCallback}
                                submittedRecordsPreCleanupNotes={recordsPreCleanupNotes}
                                recordsPostCleanupNotes={handleRecordsPostCleanupNotesCallback}
                                submittedRecordsPostCleanupNotes={recordsPostCleanupNotes}
                                preConversionManipulation={handlePreConversionManipulationCallback}
                                submittedPreConversionManipulation={preConversionManipulation}
                                // postConversionLoadingErrors={handlePostConversionLoadingErrorsCallback}
                                // postConversionValidationResults={handlePostConversionValidationResultsCallback}
                                // postConversionChanges={handlePostConversionChangesCallback}
                                checked={handleCheckboxCallback}
                                updateButtonDisabled={submitButtonDisabled}
                                updated={handleOnClickSubmit}>
                            </ViewPreConversionChecklistCard>
                        </div>
                    </div>
                </div>
            </Fragment >
    )
}

export default ViewPreConversionChecklist;