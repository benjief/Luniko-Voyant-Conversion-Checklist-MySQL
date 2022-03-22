import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import CreatePreConversionChecklistCard from "../components/CreatePreConversionChecklistCard";
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
    const [existingLoadSheetNames, setExistingLoadSheetNames] = useState([]);
    const [personnelOptions, setPersonnelOptions] = useState([]);
    // const [lsOwnerAndDecisionMakerOptions, setLSOwnerAndDecisionMakerOptions] = useState([]);
    const [newPersonnel, setNewPersonnel] = useState([]);
    const [loadSheetOwner, setLoadSheetOwner] = useState({});
    const [decisionMaker, setDecisionMaker] = useState({});
    const [contributors, setContributors] = useState([]);
    const [conversionType, setConversionType] = useState("");
    const [additionalProcessing, setAdditionalProcessing] = useState("");
    const [dataSources, setDataSources] = useState("");
    const [uniqueRecordsPreCleanup, setUniqueRecordsPreCleanup] = useState(0);
    const [uniqueRecordsPostCleanup, setUniqueRecordsPostCleanup] = useState(0); // Needs to be <= pre #
    const [recordsPreCleanupNotes, setRecordsPreCleanupNotes] = useState("");
    const [recordsPostCleanupNotes, setRecordsPostCleanupNotes] = useState("");
    const [preConversionManipulation, setPreConversionManipulation] = useState("");
    const [formReviewed, setFormReviewed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
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

    const getExistingLoadSheetNames = async () => {
        await Axios.get("http://localhost:3001/get-all-ls-names", {
        }).then((response) => {
            populateExistingLoadSheetNamesList(response.data);
            getPersonnel();
        });
    }

    const populateExistingLoadSheetNamesList = (existingLSNamesList) => {
        if (existingLSNamesList.length) {
            let tempArray = [];
            for (let i = 0; i < existingLSNamesList.length; i++) {
                tempArray.push(existingLSNamesList[i].cc_load_sheet_name.toLowerCase());
            }
            setExistingLoadSheetNames([...tempArray]);
        }
    }

    // Personnel functions
    const getPersonnel = async () => {
        // console.log("fetching personnel!");
        await Axios.get("http://localhost:3001/get-all-personnel", {
        }).then((response) => {
            populatePersonnelList(response.data);
        });
    };

    const populatePersonnelList = (personnelList) => {
        if (personnelList.length) { // TODO: change this in other implementations where you had length > 1?
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
        }
        // console.log("personnel fetched!");
        setRendering(false);
    }


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
        if (submitted) {
            await assignUIDsToNewPersonnel();
            await addNewPersonnelToDB();
            addConversionChecklist();
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
                if (!decisionMaker.label.toLowerCase() === loadSheetOwner.label.toLowerCase()) {
                    decisionMaker.value = uuidv4();
                }
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
            getExistingLoadSheetNames();
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            // console.log(loadSheetOwner);
            if (loadSheetName.trim() !== "" && loadSheetOwner !== {} && decisionMaker !== {}
                && conversionType !== "" && additionalProcessing !== "" && dataSources !== {}
                && uniqueRecordsPreCleanup > 0 && uniqueRecordsPostCleanup > 0 && formReviewed) {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }
        }
    }, [loadSheetName, loadSheetOwner, decisionMaker, conversionType, additionalProcessing,
        dataSources, uniqueRecordsPreCleanup, uniqueRecordsPostCleanup, formReviewed, rendering]);

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
                <div className="create-pre-conversion-checklist">
                    <div className="create-pre-conversion-checklist-container">
                        <div className="create-pre-conversion-checklist-card">
                            <CreatePreConversionChecklistCard
                                conversionTypeOptions={conversionTypeOptions}
                                additionalProcessingOptions={additionalProcessingOptions}
                                loadSheetName={handleLoadSheetNameCallback}
                                personnelOptions={personnelOptions}
                                invalidPersonnel={contributors}
                                invalidLoadSheetNames={existingLoadSheetNames}
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
                                submitted={handleOnClickSubmit}>
                            </CreatePreConversionChecklistCard>
                        </div>
                    </div>
                </div>
            </Fragment >
    )
}

export default CreatePreConversionChecklist;