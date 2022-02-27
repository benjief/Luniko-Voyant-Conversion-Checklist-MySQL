import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import CreatePreConversionChecklistCard from "../components/CreatePreConversionChecklistCard";
import Axios from "axios";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/CreatePreConversionChecklist.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function CreatePreConversionChecklist() {
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

    // Personnel functions
    const getPersonnel = () => {
        console.log("fetching personnel!");
        Axios.get("http://localhost:3001/get-all-personnel", {
        }).then((response) => {
            console.log(response.data);
            populatePersonnelList(response.data);
        });
    };

    const populatePersonnelList = (personnelList) => {
        if (personnelList.length > 1) {
            let tempArray = [];
            for (let i = 0; i < personnelList.length; i++) {
                let uid = personnelList[i].pers_id;
                let name = personnelList[i].pers_fname + " " + personnelList[i].pers_lname;
                let personnel = {
                    "uid": uid,
                    "name": name
                };
                tempArray.push(personnel);
            }
            setPersonnelOptions(tempArray);
        }
        setRendering(false);
    }

    // Selector callback handlers
    const handleLoadSheetNameCallback = (lsNameFromInput) => {
        setLoadSheetName(lsNameFromInput);
    }

    const handleLoadSheetOwnerCallback = (lsOwnerFromSelector) => {
        setLoadSheetOwner(lsOwnerFromSelector);
        setPersonnelOptions(personnelOptions.filter((val) => {
            return val.value !== lsOwnerFromSelector;
        }));
    }

    const handleDecisionMakerCallback = (decisionMakerFromSelector) => {
        setDecisionMaker(decisionMakerFromSelector);
        setPersonnelOptions(personnelOptions.filter((val) => {
            return val.value !== decisionMakerFromSelector;
        }));
    }

    const handleContributorsCallback = (contributorsFromSelector) => {
        setContributors(contributorsFromSelector);
        for (let i = 0; i < contributorsFromSelector.length; i++) {
            setPersonnelOptions(personnelOptions.filter((val) => {
                return val.value !== contributorsFromSelector[i];
            }));
        }
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
                <div className="create-pre-conversion-checklist">
                    <div className="create-pre-conversion-checklist-container">
                        <div className="create-pre-conversion-checklist-card">
                            <CreatePreConversionChecklistCard
                                conversionTypeOptions={conversionTypeOptions}
                                additionalProcessingOptions={additionalProcessingOptions}
                                loadSheetName={handleLoadSheetNameCallback}
                                personnelOptions={personnelOptions}
                                loadSheetOwner={handleLoadSheetOwnerCallback}
                                decisionMaker={handleDecisionMakerCallback}
                                contributors={handleContributorsCallback}
                                conversionType={handleConversionTypeCallback}
                                additionalProcessing={handleAdditionalProcessingCallback}
                                dataSources={handleDataSourcesCallback}
                                uniqueRecordsPreCleanup={handleUqRecordsPreCleanupCallback}
                                uniqueRecordsPostCleanup={handleUqRecordsPostCleanupCallback}
                                recordsPreCleanupNotes={handleRecordsPreCleanupNotesCallback}
                                recordsPostCleanupNotes={handleRecordsPostCleanupNotesCallback}
                                preConversionManipulation={handlePreConversionManipulationCallback}
                                postConversionLoadingErrors={handlePostConversionLoadingErrorsCallback}
                                postConversionValidationResults={handlePostConversionValidationResultsCallback}
                                postConversionChanges={handlePostConversionChangesCallback}
                                submitButtonDisabled={submitButtonDisabled}>
                            </CreatePreConversionChecklistCard>
                        </div>
                    </div>
                </div>
            </Fragment >
    )
}

export default CreatePreConversionChecklist;