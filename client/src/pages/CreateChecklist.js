import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import CreateChecklistCard from "../components/CreateChecklistCard";
import Axios from "axios";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/CreateRequest.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";

function CreateChecklist() {
    // const navigate = useNavigate();
    const [rendering, setRendering] = useState(true);
    const [loadSheetName, setLoadSheetName] = useState("");
    const [personnelOptions, setPersonnelOptions] = useState([]);
    const [loadSheetOwner, setLoadSheetOwner] = useState("");
    const [decisionMaker, setDecisionMaker] = useState("");
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
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

    // Single select options
    const conversionTypeOptions = [
        { value: "M", label: "Manual" },
        { value: "D", label: "DMT" }
    ];

    const AdditionalProcessingOptions = [
        { value: "C", label: "Cleanup Needed" },
        { value: "D", label: "New Data to Be Added" },
        { value: "N", label: "N/A" }
    ];

    // Personnel functions
    const getPersonnel = () => {
        Axios.get("http://localhost:3001/get-all-personnel", {
        }).then((response) => {
            populatePersonnelList(response.data);
        });
    };

    const populatePersonnelList = (personnelList) => {
        if (personnelList.length > 1) {
            let tempArray = [];
            for (let i = 0; i < personnelList.length; i++) {
                if (personnelList[i].pers_id !== uid) {
                    let value = personnelList[i].pers_id;
                    let label = personnelList[i].pers_fname + " " + personnelList[i].pers_lname;
                    let personnel = {
                        "value": value,
                        "label": label
                    };
                    tempArray.push(personnel);
                }
            }
            setPersonnelOptions(tempArray);
            setRendering(false);
        }
    }

    // Selector callback handlers
    const handleLoadSheetNameCallback = (lsNameFromInput) => {
        setLoadSheetName(lsNameFromInput);
    }

    const handleLoadSheetOwnerCallback = (lsOwnerFromSelector) => {
        setLoadSheetOwner(lsOwnerFromSelector);
    }

    const handleDecisionMakerCallback = (decisionMakerFromSelector) => {
        setDecisionMaker(decisionMakerFromSelector);
    }

    const handleContributorsCallback = (contributorsFromSelector) => {
        setContributors(contributorsFromSelector)''
    }

    const handleConversionTypeCallback = (conversionTypeFromSelector) => {
        setScopeType(conversionTypeFromSelector);
    }

    const handleAdditionalProcessingCallback = (additionalProcessingFromSelector) => {
        setAdditionalProcessing(additionalProcessingFromSelector);
    }

    const handleDataSourcesCallback = (dataSourcesFromInput) => {
        setDataSources(dataSourcesFromInput);
    }

    const handleUqRecordsPreCleanupCallback = (uqRecordsPreCleanupFromInput) => {
        setUniqueRecordsPreCleanup(uqRecordsPreCleanupFromInput);
    }

    const handleUqRecordsPostCleanupCallback = (uqRecordsPostCleanupFromInput) => {
        setUniqueRecordsPostCleanup(uqRecordsPostCleanupFromInput);
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

    const handlePostConversionLoadingErrorsCallback = (postConversionLoadingErrorsFromInput) => {
        setPostConversionLoadingErrors(postConversionLoadingErrorsFromInput);
    }

    const handlePostConversionValidationResultsCallback = (postConversionValidationResultsFromInput) => {
        setPostConversionValidationResults(postConversionValidationResultsFromInput);
    }

    const handlePostConversionChangesCallback = (postConversionChangesFromInput) => {
        setPostConversionChanges(postConversionChangesFromInput);
    }

    const addConversionChecklist = (lsNameFromCallback) => {
        console.log("Adding request...");
        Axios.post("https://luniko-pe.herokuapp.com/create-request", {
            loadSheetName: lsNameFromCallback,
            loadSheetOwner: loadSheetOwner,
            decisionMaker: decisionMaker,
            conversionType: conversionType,
            additionalProcessing: additionalProcessing,
            dataSources: dataSources,
            uniqueRecordsPreCleanup: uniqueRecordsPreCleanup,
            uniqueRecordsPostCleanup: uniqueRecordsPostCleanup,
            recordsPreCleanupNotes: recordsPreCleanupNotes,
            recordsPostCleanupNotes: recordsPostCleanupNotes,
            postConversionLoadingErrors: postConversionLoadingErrors,
            postConversionValidationResults: postConversionValidationResults,
            postConversionChanges: postConversionChanges
        }).then((response) => {
            setSubmitted(true);
            console.log("Conversion checklist successfully added!!");
            if (contributors.length !== 0) {
                addContributions(response.data.insertId);
            } else {
                handleSuccessfulSubmit();
            }
        });
    };

    const addContributions = (conversionChecklistID) => {
        console.log("Moving on to contributions...")
        for (let i = 0; i < contributors.length; i++) {
            Axios.post("http://localhost:3001/create-contribution", {
                contributorID: contributors[i],
                reqID: conversionChecklistID
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
            getPersonnel();
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (loadSheetName !== "" && loadSheetOwner !== "" && decisionMaker !== ""
                && conversionType !== "" && additionalProcessing !== "" && dataSources !== ""
                && uniqueRecordsPreCleanup > 0 && uniqueRecordsPostCleanup > 0) {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }
        }
    }, [loadSheetName, loadSheetOwner, decisionMaker, conversionType, additionalProcessing,
        dataSources, uniqueRecordsPreCleanup, uniqueRecordsPostCleanup, rendering]);

    // left off here
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
                <div className="create-request">
                    <div className="create-request-container">
                        <div className="create-request-card">
                            <CreateRequestCard
                                uid={uid}
                                scopeTypeOptions={scopeOptions}
                                departmentOptions={deptOptions}
                                valueOptions={valueOptions}
                                identifierOptions={identifierOptions}
                                updatedCompany={handleCompanyCallback}
                                selectedScopeType={handleScopeCallback}
                                selectedDepartment={handleDeptCallback}
                                updatedDescription={handleDescriptionCallback}
                                selectedValue={handleValueCallback}
                                selectedIdentifiers={handleIdentifierCallback}
                                requestToSubmit={addRequest}
                                submitButtonDisabled={submitButtonDisabled}>
                            </CreateRequestCard>
                        </div>
                        {/* <input
                            className="request-textBox"
                            type="text"
                            value={company}
                            onChange={(event) => setCompany(event.target.value)}
                            maxLength={45}
                            required={true}
                            placeholder="Company Name">
                        </input>
                        <MaterialSingleSelect
                            placeholder="Scope Type"
                            singleSelectOptions={scopeOptions}
                            selectedValue={handleScopeCallback}>
                        </MaterialSingleSelect>
                        <MaterialSingleSelect
                            placeholder="Department"
                            singleSelectOptions={deptOptions}
                            selectedValue={handleDeptCallback}>
                        </MaterialSingleSelect>
                        <textarea
                            className="request-textBox"
                            type="text"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Description"
                            maxLength={500}
                            required={true}
                            style={{ marginTop: "10px", height: "150px" }}>
                        </textarea>
                        <MaterialSingleSelect
                            placeholder="Value"
                            singleSelectOptions={valueOptions}
                            selectedValue={handleValueCallback}>
                        </MaterialSingleSelect>
                        <MaterialMultiSelect
                            label="Identifiers"
                            placeholder="Add Identifiers"
                            multiSelectOptions={identifierOptions}
                            selectedValues={handleIdentifierCallback}
                            limitTags={1}>
                        </MaterialMultiSelect>
                        <button
                            className="submit-request-button"
                            disabled={disabled}
                            // TODO: this might not be super necessary
                            onClick={!submitted ? addRequest : null}
                            style={{ backgroundColor: submitButtonColor }}>
                            {submitButtonText}
                        </button> */}
                    </div>
                </div>
            </Fragment >
    )
}

export default CreateChecklist;