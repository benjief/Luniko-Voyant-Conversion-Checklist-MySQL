import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EnterLoadSheetNameCard from "../../../components/EnterLoadSheetNameCard";
import ViewConversionChecklistCard from "../../../components/ViewConversionChecklistCard";
import Axios from "axios";
import LoadingWrapper from "../../wrappers/LoadingWrapper/LoadingWrapper";
import AlertWrapper from "../../wrappers/AlertWrapper/AlertWrapper";
import CardWrapper from "../../wrappers/CardWrapper/CardWrapper";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import * as DecoderFunctions from "../../../functional_components/DecoderFunctions";
import "../../../styles/ViewConversionChecklist.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/AlertComponents.css";

/**
 * This page allows users to view all checklists stored in the database, regardless of what state they're at (i.e. pre-/post-conversion or completed).
 * @returns a page housing all of the components needed to implement the above functionality.
 */
function ViewConversionChecklist() {
    const [rendering, setRendering] = useState(true);
    const [isValidLoadSheetNameEntered, setIsValidLoadSheetNameEntered] = useState(false);
    const invalidLoadSheetNameError = useValidationErrorUpdate();
    const [isRequestChecklistButtonDisabled, setIsRequestChecklistButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [formProps, setFormProps] = useState({
        loadSheetName: "",
        personnelOptions: [],
        loadSheetOwner: { label: "", value: null },
        decisionMaker: { label: "", value: null },
        contributors: [],
        conversionType: { label: "", value: null },
        additionalProcessing: [],
        dataSources: "",
        uniqueRecordsPreCleanup: "",
        uniqueRecordsPostCleanup: "",
        recordsPreCleanupNotes: "",
        recordsPostCleanupNotes: "",
        preConversionManipulation: "",
        postConversionLoadingErrors: "",
        postConversionValidationResults: "",
        postConversionChanges: "",
        isFormApproved: false,
    });
    const conversionChecklistID = useRef("");
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const alertType = useRef("error-alert");
    const loadSheetNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);

    const alertMessage = "Apologies! We've encountered an error. Please attempt to re-load  this page.";

    const navigate = useNavigate();

    /**
     * Displays an alert with the correct type of error. 
     * @param {string} errorType 
     */
    const handleError = useCallback(() => {
        setIsErrorThrown(true);

        if (rendering) {
            setRendering(false);
        }

        setAlert(true);
    }, [setIsErrorThrown, rendering]);

    /**
     * Closes an alert that is on display and redirects the user to the app homepage.
     */
    const handleAlertClosed = () => {
        console.log("alert closed");
        setAlert(false);
        navigate("/");
    }

    useEffect(() => {
        /**
         * Calls functions that gather information required for the initial page load.
         */
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchLoadSheetNamesAlreadyInDB();
            setRendering(false);
        }

        /**
         * Fetches load sheet names that are already stored in the database and writes them to loadSheetNamesAlreadyInDB. Because this page allows users to view any checklist that exists in the database, all existing load sheet names are fetched/written.
         */
        const fetchLoadSheetNamesAlreadyInDB = async () => {
            try {
                async.current = true;
                await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-all-ls-names", {
                    timeout: 5000
                })
                    .then(res => {
                        loadSheetNamesAlreadyInDB.current = res.data.map(({ cc_load_sheet_name }) => cc_load_sheet_name.toLowerCase());
                        async.current = false;
                    });
            } catch (e) {
                console.log("error caught:", e);
                handleError();
            }
        }

        /**
         * Calls functions that fetch and write information required for displaying a checklist.
         * @param {string} loadSheetName - the load sheet name corresponding to the checklist for which information is being fetched.
         */
        const runSecondaryReadAsyncFunctions = async (loadSheetName) => {
            isDataBeingFetched.current = true;
            await fetchAndWriteConversionChecklistInfo(loadSheetName);
            setRendering(false);
        }

        /**
         * Fetches and writes checklist information to formProps. All fields are fetched/written, regardless of whether or not they contain information other than NULL.
         * @param {string} loadSheetName - the load sheet name corresponding to the checklist for which information is being fetched.
         */
        const fetchAndWriteConversionChecklistInfo = async (loadSheetName) => {
            try {
                async.current = true;
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-conversion-checklist-info/${loadSheetName}`, {
                    timeout: 5000
                })
                    .then(async res => {
                        async.current = false;
                        let conversionChecklistInfo = res.data[0];
                        conversionChecklistID.current = conversionChecklistInfo.cc_id;
                        // these functions assist in fetching and writing information that requires further Axios calls to props
                        await fetchAndWritePersonnelInfo("loadSheetOwner", conversionChecklistInfo.cc_load_sheet_owner);
                        await fetchAndWritePersonnelInfo("decisionMaker", conversionChecklistInfo.cc_decision_maker);
                        await fetchAndWriteSubmittedContributors();
                        await fetchAndWriteAdditionalProcessing();
                        // these props can be written in place
                        await setFormProps(
                            prev => ({
                                ...prev,
                                loadSheetName: conversionChecklistInfo.cc_load_sheet_name,
                                conversionType: { value: conversionChecklistInfo.cc_conversion_type, label: DecoderFunctions.getConversionType(conversionChecklistInfo.cc_conversion_type) },
                                dataSources: conversionChecklistInfo.cc_data_sources,
                                uniqueRecordsPreCleanup: conversionChecklistInfo.uq_records_pre_cleanup,
                                uniqueRecordsPostCleanup: conversionChecklistInfo.uq_records_post_cleanup,
                                recordsPreCleanupNotes: conversionChecklistInfo.cc_records_pre_cleanup_notes,
                                recordsPostCleanupNotes: conversionChecklistInfo.cc_records_post_cleanup_notes,
                                preConversionManipulation: conversionChecklistInfo.cc_pre_conversion_manipulation,
                                postConversionLoadingErrors: conversionChecklistInfo.cc_post_conversion_loading_errors,
                                postConversionValidationResults: conversionChecklistInfo.cc_post_conversion_validation_results,
                                postConversionChanges: conversionChecklistInfo.cc_post_conversion_changes,
                                isFormApproved: conversionChecklistInfo.is_approved.data[0] ? true : false,
                            })
                        );
                    });
            } catch (e) {
                console.log("error caught:", e);
                handleError("r");
            }
        }

        /**
         * Fetches personnel information from the database corresponding to a given personnel ID and writes that information to formProps. A personnel object of the form {value: personnelID, label: personnelName} is written to the correct field in formProps.
         * @param {string} field - the formProps field to be written to (e.g. loadSheetOwner or decisionMaker).
         * @param {string} personnelID - a string containing the personnel used to fetch information from the database.
         */
        const fetchAndWritePersonnelInfo = async (field, personnelID) => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-personnel-info/${personnelID}`, {
                        timeout: 5000
                    })
                        .then(res => {
                            let dataToWrite = { value: personnelID, label: res.data[0].pers_name };
                            setFormProps(
                                prev => ({ ...prev, [field]: dataToWrite })
                            );
                            async.current = false;
                        });
                } catch (e) {
                    console.log("error caught:", e);
                    handleError("r");
                }
            }
        }

        /**
         * Fetches information about contributors that have been submitted as part of a checklist. An array of personnel objects that have the form {value: personnelID, label: personnelName} is written to the correct field in formProps.
         */
        const fetchAndWriteSubmittedContributors = async () => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-submitted-contributors/${conversionChecklistID.current}`, {
                        timeout: 5000
                    })
                        .then(res => {
                            let dataToWrite = res.data.map(({ pers_id, pers_name }) => ({ value: pers_id, label: pers_name }));
                            setFormProps(
                                prev => ({ ...prev, contributors: dataToWrite })
                            );
                            async.current = false;
                        });
                } catch (e) {
                    console.log("error caught:", e);
                    handleError("r");
                }
            }
        }

        /**
         * Fetches information about additional processing that has submitted as part of a checklist. An array of additional processing objects that have the form {value: ap_type, label: descriptor for ap_type (obtained from DecoderFunctions.js)} is written to the correct field in formProps. 
         */
        const fetchAndWriteAdditionalProcessing = async () => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-additional-processing/${conversionChecklistID.current}`, {
                        timeout: 5000
                    })
                        .then(res => {
                            let dataToWrite = res.data.map(({ ap_type }) => ({ value: ap_type, label: DecoderFunctions.getAdditionalProcessingType(ap_type) }));
                            setFormProps(
                                prev => ({ ...prev, additionalProcessing: dataToWrite })
                            );
                            async.current = false;
                        });
                } catch (e) {
                    console.log("error caught:", e);
                    handleError("r");
                }
            }
        }

        if (rendering) {
            // runs fetch/write functions, depending on the page's state
            if (!isValidLoadSheetNameEntered && !isDataBeingFetched.current) {
                runPrimaryReadAsyncFunctions()
            } else if (!isDataBeingFetched.current) {
                runSecondaryReadAsyncFunctions(formProps["loadSheetName"]);
            }
        } else {
            // makes page visible
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidLoadSheetNameEntered) {
                formProps["loadSheetName"].trim().length ? setIsRequestChecklistButtonDisabled(false) : setIsRequestChecklistButtonDisabled(true);
            }
        }
    }, [formProps, handleError, isValidLoadSheetNameEntered, rendering])

    /**
     * When a user requests a load sheet name that has previously been written to the database, that load sheet name is validated (through a call to validateChecklistNameEntered). If the load sheet name entered is indeed valid, setValidLoadSheetName is set to true, as is rendering, and the "request checklist" button is disabled. Then, the useEffect hook carries out secondary read async functions to fetch/write all of the necessary checklist information to the page. If the load sheet name entered isn't valid, an error message is displayed.
     */
    const handleRequestChecklist = () => {
        if (!isValidLoadSheetNameEntered) {
            if (validateChecklistNameEntered()) {
                setIsValidLoadSheetNameEntered(true);
                isDataBeingFetched.current = false;
                setIsRequestChecklistButtonDisabled(true);
                setRendering(true);
            } else {
                invalidLoadSheetNameError("Invalid load sheet name");
            }
        }
    }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    /**
    * Compares the load sheet name entered by the user to load sheet names obtained by the page's primary read functions. If the entered load sheet name is matched against the set of valid load sheet names (this will depend on the page and what kind of checklist is being retrieved), the function returns true. If not, it returns false.
     * @returns true if the entered load sheet name is matched against the set of valid load sheet names, false otherwise.
     */
    const validateChecklistNameEntered = () => {
        for (let i = 0; i < loadSheetNamesAlreadyInDB.current.length; i++) {
            let escapeRegExpMatch = formProps["loadSheetName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(loadSheetNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

    return (
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transitionElementVisibility}>
            </LoadingWrapper>
            <AlertWrapper
                alert={alert}
                alertMessage={alertMessage}
                handleAlertClosed={handleAlertClosed}
                alertType={alertType.current}>
            </AlertWrapper>
            {isValidLoadSheetNameEntered
                ? <CardWrapper
                    rendering={rendering}
                    alert={alert}
                    isErrorThrown={isErrorThrown}>
                    <ViewConversionChecklistCard
                        loadSheetName={formProps["loadSheetName"]}
                        loadSheetOwner={formProps["loadSheetOwner"]}
                        decisionMaker={formProps["decisionMaker"]}
                        contributors={formProps["contributors"]}
                        conversionType={formProps["conversionType"]}
                        additionalProcessing={formProps["additionalProcessing"]}
                        dataSources={formProps["dataSources"]}
                        uniqueRecordsPreCleanup={formProps["uniqueRecordsPreCleanup"]}
                        uniqueRecordsPostCleanup={formProps["uniqueRecordsPostCleanup"]}
                        recordsPreCleanupNotes={formProps["recordsPreCleanupNotes"]}
                        recordsPostCleanupNotes={formProps["recordsPostCleanupNotes"]}
                        preConversionManipulation={formProps["preConversionManipulation"]}
                        postConversionLoadingErrors={formProps["postConversionLoadingErrors"]}
                        postConversionValidationResults={formProps["postConversionValidationResults"]}
                        postConversionChanges={formProps["postConversionChanges"]}
                        isFormApproved={formProps["isFormApproved"]}>
                    </ViewConversionChecklistCard>
                </CardWrapper>
                : <Fragment>
                    {isErrorThrown
                        ? <div></div>
                        : <div className="enter-valid-load-sheet-name">
                            <div className="enter-valid-load-sheet-name-container">
                                <div className="page-message">
                                    Retrieve Your Conversion Checklist Below:
                                </div>
                                <div className="enter-valid-load-sheet-name-card">
                                    <EnterLoadSheetNameCard
                                        setFormProps={setFormProps}
                                        requestChecklist={handleRequestChecklist}
                                        isSubmitButtonDisabled={isRequestChecklistButtonDisabled}
                                        isUserViewingConversionChecklist={true}>
                                    </EnterLoadSheetNameCard>
                                </div>
                            </div>
                        </div>}
                </Fragment>
            }
        </Fragment >
    );
}

export default ViewConversionChecklist;
