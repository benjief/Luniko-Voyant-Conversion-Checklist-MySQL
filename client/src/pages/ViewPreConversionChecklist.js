import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import EnterLoadSheetNameCard from "../components/EnterLoadSheetNameCard";
import ViewPreConversionChecklistCard from "../components/ViewPreConversionChecklistCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getConversionType, getAdditionalProcessing } from "../components/DecoderFunctions";
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
    const [conversionChecklistID, setConversionChecklistID] = useState("");
    const [personnelOptions, setPersonnelOptions] = useState([]);
    // const [personnelOptionsMap, setPersonnelOptionsMap] = useState(new Map());
    // const [lsOwnerAndDecisionMakerOptions, setLSOwnerAndDecisionMakerOptions] = useState([]);
    const [newPersonnel, setNewPersonnel] = useState([]);
    const [loadSheetOwner, setLoadSheetOwner] = useState([]);
    const [decisionMaker, setDecisionMaker] = useState([]);
    const [submittedContributors, setSubmittedContributors] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [conversionType, setConversionType] = useState("");
    const [additionalProcessing, setAdditionalProcessing] = useState("");
    const [dataSources, setDataSources] = useState("");
    const [uniqueRecordsPreCleanup, setUniqueRecordsPreCleanup] = useState(Number.MAX_SAFE_INTEGER);
    const [uniqueRecordsPostCleanup, setUniqueRecordsPostCleanup] = useState(1); // Needs to be <= pre #
    const [recordsPreCleanupNotes, setRecordsPreCleanupNotes] = useState("");
    const [recordsPostCleanupNotes, setRecordsPostCleanupNotes] = useState("");
    const [preConversionManipulation, setPreConversionManipulation] = useState("");
    const [forceCheckboxOff, setForceCheckboxOff] = useState(false);
    const [formReviewed, setFormReviewed] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [valueUpdated, setValueUpdated] = useState(false);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);
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
        setRendering(false);
    }

    const getConversionChecklistInfo = async (loadSheetName) => {
        await Axios.get(`http://localhost:3001/get-pre-conversion-checklist-info/${loadSheetName}`, {
        }).then((response) => {
            getPersonnelInfo(response.data[0]);
            getSubmittedContributors(response.data[0].cc_id);
        })
    }

    const getSubmittedContributors = async (conversionChecklistID) => {
        await Axios.get(`http://localhost:3001/get-submitted-contributors/${conversionChecklistID}`, {
        }).then((response) => {
            populateSubmittedContributorsList(response.data);
        });
    }

    const populateSubmittedContributorsList = (submittedContributorsList) => {
        new Promise(resolve => {
            if (submittedContributorsList.length) {
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
                setSubmittedContributors([...tempArray]);
            }
        });
    }

    // const populateSubmittedLSOwnerAndDecisionMakerFields = (conversionChecklistInfo) => {
    //     new Promise(resolve => {
    //         let lsOwnerUID = conversionChecklistInfo.cc_load_sheet_owner;
    //         let decisionMakerUID = conversionChecklistInfo.cc_decision_maker;
    //         let lsOwnerName = personnelOptionsMap.get(lsOwnerUID);
    //         let decisionMakerName = personnelOptionsMap.get(decisionMakerUID);
    //         setLoadSheetOwner({ "value": lsOwnerUID, "label": lsOwnerName });
    //         setDecisionMaker({ "value": decisionMakerUID, "label": decisionMakerName });
    //     });
    //     populateSubmittedFields(conversionChecklistInfo);
    // }

    const getPersonnelInfo = async (conversionChecklistInfo) => {
        new Promise(resolve => {
            let loadSheetOwner = conversionChecklistInfo.cc_load_sheet_owner;
            let decisionMaker = conversionChecklistInfo.cc_decision_maker;
            let conversionChecklistPersonnel = [loadSheetOwner, decisionMaker];

            for (let i = 0; i < conversionChecklistPersonnel.length; i++) {
                Axios.get(`http://localhost:3001/get-personnel-info/${conversionChecklistPersonnel[i]}`, {
                }).then((response) => {
                    let name = response.data[0].pers_name;
                    let personnel = {
                        "value": conversionChecklistPersonnel[i],
                        "label": name
                    };
                    i === 0 ? setLoadSheetOwner(personnel) : setDecisionMaker(personnel);
                });
            }
        });
        // console.log("load sheet owner and decision maker fields populated...");
        populateSubmittedFields(conversionChecklistInfo);
    }

    const populateSubmittedFields = (conversionChecklistInfo) => {
        // console.log("populating other submitted fields");
        new Promise(resolve => {
            // setLoadSheetOwner(conversionChecklistInfo.cc_load_sheet_owner);
            // setDecisionMaker(conversionChecklistInfo.cc_decision_maker);
            setConversionChecklistID(conversionChecklistInfo.cc_id);
            setConversionType(conversionChecklistInfo.cc_conversion_type);
            setAdditionalProcessing(conversionChecklistInfo.cc_additional_processing);
            setDataSources(conversionChecklistInfo.cc_data_sources);
            setUniqueRecordsPreCleanup(conversionChecklistInfo.uq_records_pre_cleanup);
            setUniqueRecordsPostCleanup(conversionChecklistInfo.uq_records_post_cleanup);
            setRecordsPreCleanupNotes(conversionChecklistInfo.cc_records_pre_cleanup_notes);
            setRecordsPostCleanupNotes(conversionChecklistInfo.cc_records_post_cleanup_notes);
            setPreConversionManipulation(conversionChecklistInfo.cc_pre_conversion_manipulation);
        });
        getPersonnel();
    }

    const getPersonnel = async () => {
        await Axios.get("http://localhost:3001/get-all-personnel", {
        }).then((response) => {
            populatePersonnelList(response.data);
        });
    }

    const populatePersonnelList = (personnelList) => {
        new Promise(resolve => {
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
                setPersonnelOptions([...tempArray]);
            }
        });
        setViewPreConversionChecklistDisplay("visible");
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

    const handleLoadSheetOwnerCallback = (lsOwnerFromSelector) => {
        setLoadSheetOwner(lsOwnerFromSelector);
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
        setUniqueRecordsPreCleanup(uqRecordsPreCleanupFromInput ? uqRecordsPreCleanupFromInput : Number.MAX_SAFE_INTEGER);
    }

    const handleUqRecordsPostCleanupCallback = (uqRecordsPostCleanupFromInput) => {
        setUniqueRecordsPostCleanup(uqRecordsPostCleanupFromInput ? uqRecordsPostCleanupFromInput : 1);
    }

    const handleRecordsPreCleanupNotesCallback = (recordsPreCleanupNotesFromInput) => {
        setRecordsPreCleanupNotes(recordsPreCleanupNotesFromInput);
    }

    const handleRecordsPostCleanupNotesCallback = (recordsPostCleanupNotesFromInput) => {
        setRecordsPostCleanupNotes(recordsPostCleanupNotesFromInput);
    }

    const handlePreConversionManipulationCallback = (preConversionManipulationFromInput) => {
        setPreConversionManipulation(preConversionManipulationFromInput);
    }

    const handleCheckboxCallback = (checkedFromCheckbox) => {
        setFormReviewed(checkedFromCheckbox);
        setForceCheckboxOff(false);
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
                setInvalidLoadSheetNameError("Invalid pre-conversion load sheet name");
            }
        } else {
            if (submitted) {
                await assignUIDsToNewPersonnel();
                await addNewPersonnelToDB();
                updateConversionChecklist();
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

    const updateConversionChecklist = () => {
        console.log("Updating checklist...");
        Axios.put(`http://localhost:3001/update-pre-conversion-checklist/${conversionChecklistID}`, {
            loadSheetName: loadSheetName,
            loadSheetOwner: loadSheetOwner.value,
            decisionMaker: decisionMaker.value,
            conversionType: conversionType,
            additionalProcessing: additionalProcessing,
            dataSources: dataSources,
            uniqueRecordsPreCleanup: uniqueRecordsPreCleanup,
            uniqueRecordsPostCleanup: uniqueRecordsPostCleanup,
            recordsPreCleanupNotes: recordsPreCleanupNotes === null ? null : recordsPreCleanupNotes.trim() === "" ? null : recordsPreCleanupNotes,
            recordsPostCleanupNotes: recordsPostCleanupNotes === null ? null : recordsPostCleanupNotes.trim() === "" ? null : recordsPostCleanupNotes,
            preConversionManipulation: preConversionManipulation === null ? null : preConversionManipulation.trim() === "" ? null : preConversionManipulation
        }).then((response) => {
            setSubmitted(true);
            console.log("Pre-conversion checklist successfully updated!");
            if (contributors.length !== 0) {
                addContributions(conversionChecklistID);
            } else {
                // handleSuccessfulUpdate();
                setAlert(true);
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
                // handleSuccessfulUpdate();
                setAlert(true);
            });
        };
    };

    // const handleSuccessfulUpdate = () => {
    //     // setTimeout(() => {
    //     //     setSubmitButtonText("Request Submitted!");
    //     // }, 500);
    //     setTimeout(() => {
    //         navigate("/");
    //     }, 1000);
    // }

    const handleValueUpdated = () => {
        setValueUpdated(true);
        setForceCheckboxOff(true);
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
                // console.log(loadSheetOwner);
                if (loadSheetName.trim() !== "" && loadSheetOwner !== {} && decisionMaker !== {}
                    && conversionType !== "" && additionalProcessing !== "" && dataSources !== {}
                    && (uniqueRecordsPreCleanup > 0 && uniqueRecordsPreCleanup >= uniqueRecordsPostCleanup)
                    && (uniqueRecordsPostCleanup > 0 && uniqueRecordsPostCleanup <= uniqueRecordsPreCleanup)
                    && formReviewed && valueUpdated) {
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
                {alert
                    ? <div className="alert-container">
                        <PositionedSnackbar
                            message="Pre-conversion checklist successfully updated!"
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
                                input={<u>pre-</u>}>
                            </EnterLoadSheetNameCard>
                        </div>
                    </div>
                </div>
                <div
                    className="view-pre-conversion-checklist"
                    style={{ display: viewPreConversionChecklistDisplay }}>
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
                                invalidPersonnel={submittedContributors.concat(contributors)}
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
                                    loadSheetOwner.label && decisionMaker.label
                                        ? Array.from(new Set(submittedContributors.concat([loadSheetOwner, decisionMaker]))) // TODO: fix this roundabout way of doing things
                                        : loadSheetOwner.label ? submittedContributors.concat(loadSheetOwner)
                                            : decisionMaker.label ? submittedContributors.concat(decisionMaker)
                                                : submittedContributors
                                }
                                conversionType={handleConversionTypeCallback}
                                submittedConversionType={getConversionType(conversionType)}
                                additionalProcessing={handleAdditionalProcessingCallback}
                                submittedAdditionalProcessing={getAdditionalProcessing(additionalProcessing)}
                                dataSources={handleDataSourcesCallback}
                                submittedDataSources={dataSources}
                                uniqueRecordsPreCleanup={handleUqRecordsPreCleanupCallback}
                                submittedUniqueRecordsPreCleanup={uniqueRecordsPreCleanup}
                                uniqueRecordsPreCleanupLowerLimit={uniqueRecordsPostCleanup}
                                uniqueRecordsPostCleanup={handleUqRecordsPostCleanupCallback}
                                submittedUniqueRecordsPostCleanup={uniqueRecordsPostCleanup}
                                uniqueRecordsPostCleanupUpperLimit={uniqueRecordsPreCleanup}
                                recordsPreCleanupNotes={handleRecordsPreCleanupNotesCallback}
                                submittedRecordsPreCleanupNotes={recordsPreCleanupNotes ? recordsPreCleanupNotes : ""}
                                recordsPostCleanupNotes={handleRecordsPostCleanupNotesCallback}
                                submittedRecordsPostCleanupNotes={recordsPostCleanupNotes ? recordsPostCleanupNotes : ""}
                                preConversionManipulation={handlePreConversionManipulationCallback}
                                submittedPreConversionManipulation={preConversionManipulation ? preConversionManipulation : ""}
                                // postConversionLoadingErrors={handlePostConversionLoadingErrorsCallback}
                                // postConversionValidationResults={handlePostConversionValidationResultsCallback}
                                // postConversionChanges={handlePostConversionChangesCallback}
                                forceCheckboxOff={forceCheckboxOff}
                                checked={handleCheckboxCallback}
                                valueUpdated={handleValueUpdated}
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