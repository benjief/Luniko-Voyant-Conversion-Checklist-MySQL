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
    const [contributorOptions, setContributorOptions] = useState([]);
    const [loadSheetOwner, setLoadSheetOwner] = useState([]);
    const [decisionMaker, setDecisionMaker] = useState([]);
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
    const getPersonnel = async () => {
        console.log("fetching personnel!");
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
            setPersonnelOptions(tempArray);
            setContributorOptions(tempArray);
        }
        console.log("personnel fetched!");
        setRendering(false);
    }

    // Selector callback handlers
    const filterContributorOptions = (selectedOption) => {
        setContributorOptions(personnelOptions.filter((val) => {
            return val !== selectedOption;
        }));
    }

    const filterPersonnelOptions = (selectedOptions) => {
        getPersonnel().then(() => {
            for (let i = 0; i < selectedOptions.length; i++) {
                setPersonnelOptions(personnelOptions.filter((val) => {
                    return val !== selectedOptions[i];
                }));
            }
        })
    }

    const handleLoadSheetNameCallback = (lsNameFromInput) => {
        setLoadSheetName(lsNameFromInput);
    }

    const handleLoadSheetOwnerCallback = (lsOwnerFromSelector) => {
        setLoadSheetOwner(lsOwnerFromSelector);
        filterContributorOptions(lsOwnerFromSelector);
    }

    const handleDecisionMakerCallback = (decisionMakerFromSelector) => {
        setDecisionMaker(decisionMakerFromSelector);
        filterContributorOptions(decisionMakerFromSelector);
    }

    const handleContributorsCallback = (contributorsFromSelector) => {
        setContributors(contributorsFromSelector);
        filterPersonnelOptions(contributorsFromSelector);
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

    const addNewPersonnel = () => {
        if (loadSheetOwner.value === -1) {
            console.log("Adding new load sheet owner...");
            addPersonnelToDB(loadSheetOwner.label);
        }
        if (decisionMaker.value === -1) {
            console.log("Adding new decision maker...");
            addPersonnelToDB(decisionMaker.label)
        }
        for (let i = 0; i < contributors.length; i++) {
            if (contributors[i].value === -1) {
                console.log("Adding new contributor...");
                addPersonnelToDB(contributors[i].label);
            }
        }
    }

    const addPersonnelToDB = (name) => {
        let firstName = name.split(" ")[0];
        let lastName = name.substring(name.indexOf(" "));
        Axios.post("http://localhost:3001/add-personnel", {
            pers_fname: firstName,
            pers_lname: lastName
        })
    }

    const addConversionChecklist = (submitted) => {
        if (submitted) {
            console.log("Adding checklist...");
            Axios.post("http://localhost:3001/add-checklist", {
                loadSheetName: loadSheetName,
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
        }
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
            console.log(personnelOptions);
            if (loadSheetName !== "" && loadSheetOwner !== "" && decisionMaker !== ""
                && conversionType !== "" && additionalProcessing !== "" && dataSources !== ""
                && uniqueRecordsPreCleanup > 0 && uniqueRecordsPostCleanup > 0) {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }
        }
    }, [loadSheetName, loadSheetOwner, decisionMaker, conversionType, additionalProcessing,
        dataSources, uniqueRecordsPreCleanup, uniqueRecordsPostCleanup, rendering, personnelOptions]);

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
                                contributorOptions={contributorOptions}
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