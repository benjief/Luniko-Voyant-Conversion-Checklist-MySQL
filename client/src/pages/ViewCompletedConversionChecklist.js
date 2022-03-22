import React, { Fragment, useEffect, useState } from "react";
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
    // const navigate = useNavigate();
    const [rendering, setRendering] = useState(true);
    const [enterLoadSheetNameDisplay, setEnterLoadSheetNameDisplay] = useState("visible");
    const [viewCompletedConversionChecklistDisplay, setViewCompletedConversionChecklistDisplay] = useState("none");
    const [validLoadSheetNames, setValidLoadSheetNames] = useState([]);
    const [validLoadSheetNameEntered, setValidLoadSheetNameEntered] = useState(false);
    const [invalidLoadSheetNameError, setInvalidLoadSheetNameError] = useState("");
    const [loadSheetName, setLoadSheetName] = useState("");
    const [loadSheetOwner, setLoadSheetOwner] = useState([]);
    const [decisionMaker, setDecisionMaker] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [conversionType, setConversionType] = useState("");
    const [additionalProcessing, setAdditionalProcessing] = useState("");
    const [postConversionLoadingErrors, setPostConversionLoadingErrors] = useState("");
    const [postConversionValidationResults, setPostConversionValidationResults] = useState("");
    const [postConversionChanges, setPostConversionChanges] = useState("");
    const [conversionChecklistID, setConversionChecklistID] = useState("");
    const [dataSources, setDataSources] = useState("");
    const [uniqueRecordsPreCleanup, setUniqueRecordsPreCleanup] = useState(0);
    const [uniqueRecordsPostCleanup, setUniqueRecordsPostCleanup] = useState(0); // Needs to be <= pre #
    const [recordsPreCleanupNotes, setRecordsPreCleanupNotes] = useState("");
    const [recordsPostCleanupNotes, setRecordsPostCleanupNotes] = useState("");
    const [preConversionManipulation, setPreConversionManipulation] = useState("");
    const [existingLoadSheetNames, setExistingLoadSheetNames] = useState([]);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

    const getValidLoadSheetNames = async () => {
        await Axios.get("http://localhost:3001/get-valid-post-conversion-ls-names", {
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
        setViewCompletedConversionChecklistDisplay("visible");
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

    const getConversionChecklistInfo = async (loadSheetName) => {
        await Axios.get(`http://localhost:3001/get-all-conversion-checklist-info/${loadSheetName}`, {
        }).then((response) => {
            getPersonnelInfo(response.data[0]);
        });
    }

    const getPersonnelInfo = async (conversionChecklistInfo) => {
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
        populateSubmittedFields(conversionChecklistInfo);
    }

    const populateSubmittedFields = (conversionChecklistInfo) => {
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
            setConversionChecklistID(conversionChecklistInfo.cc_id);
            setPostConversionLoadingErrors(conversionChecklistInfo.cc_post_conversion_loading_errors);
            setPostConversionValidationResults(conversionChecklistInfo.cc_post_conversion_validation_results);
            setPostConversionChanges(conversionChecklistInfo.cc_post_conversion_changes);
        });
        getContributors(conversionChecklistInfo.cc_id);
    }

    const getContributors = async (conversionChecklistID) => {
        await Axios.get(`http://localhost:3001/get-submitted-contributors/${conversionChecklistID}`, {
        }).then((response) => {
            populateContributorsList(response.data);
        });
    }

    const populateContributorsList = (contributorsList) => {
        new Promise(resolve => {
            if (contributorsList.length) {
                let tempArray = [];
                for (let i = 0; i < contributorsList.length; i++) {
                    tempArray.push(contributorsList[i].pers_name);
                }
                setContributors([...tempArray]);
            }
        });
        setRendering(false);
    }

    const handleOnClickSubmit = async (submitted) => {
        if (submitted) {
            if (!validLoadSheetNameEntered && submitted) {
                if (checkLoadSheetNameEntered()) {
                    setValidLoadSheetNameEntered(true)
                    setRendering(true);
                    setEnterLoadSheetNameDisplay("none");
                    setSubmitButtonDisabled(true);
                } else {
                    setInvalidLoadSheetNameError("Invalid post-conversion load sheet name");
                }
            }
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
            if (!validLoadSheetNameEntered) {
                loadSheetName.trim() !== "" ? setSubmitButtonDisabled(false) : setSubmitButtonDisabled(true);
            }
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
        }
    }, [loadSheetName, rendering]);


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
                                textAuthenticationError={invalidLoadSheetNameError}
                                input="post">
                            </EnterLoadSheetNameCard>
                        </div>
                    </div>
                </div>
                <div className="view-completed-conversion-checklist"
                    style={{ display: viewCompletedConversionChecklistDisplay }}>
                    <div className="page-message">
                        View Your Completed Checklist Below:
                    </div>
                    <div className="view-completed-conversion-checklist-container">
                        <div className="view-completed-conversion-checklist-card">
                            <ViewCompletedConversionChecklistCard
                                loadSheetName={loadSheetName}
                                loadSheetOwner={loadSheetOwner}
                                decisionMaker={decisionMaker}
                                contributors={contributors}
                                conversionType={DecoderFunctions.getConversionType(conversionType)}
                                additionalProcessing={DecoderFunctions.getAdditionalProcessing(additionalProcessing)}
                                dataSources={dataSources}
                                uniqueRecordsPreCleanup={uniqueRecordsPreCleanup}
                                uniqueRecordsPostCleanup={uniqueRecordsPostCleanup}
                                recordsPreCleanupNotes={recordsPreCleanupNotes}
                                recordsPostCleanupNotes={recordsPostCleanupNotes}
                                preConversionManipulation={preConversionManipulation}
                                postConversionLoadingErrors={postConversionLoadingErrors}
                                postConversionValidationResults={postConversionValidationResults}
                                postConversionChanges={postConversionChanges}>
                            </ViewCompletedConversionChecklistCard>
                        </div>
                    </div>
                </div>
            </Fragment >
    )
}

export default ViewCompletedConversionChecklist;