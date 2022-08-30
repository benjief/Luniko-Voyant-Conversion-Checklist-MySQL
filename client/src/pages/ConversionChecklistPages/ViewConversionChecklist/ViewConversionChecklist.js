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

    const handleError = useCallback(() => {
        setIsErrorThrown(true);

        // Delay is set up just in case an error is generated before the is fully-displayed
        // let delay = transitionElementOpacity === "100%" ? 500 : rendering ? 500 : 0;
        let delay = 0; // TODO: test this and amend if necessary

        if (rendering) {
            setRendering(false);
        }

        setTimeout(() => {
            setAlert(true);
        }, delay);
    }, [setIsErrorThrown, rendering]);

    const handleAlertClosed = () => {
        console.log("alert closed");
        setAlert(false);
        navigate("/");
    }

    useEffect(() => {
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchLoadSheetNamesAlreadyInDB();
            setRendering(false);
        }

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

        const runSecondaryReadAsyncFunctions = async (loadSheetName) => {
            isDataBeingFetched.current = true;
            await getConversionChecklistInfo(loadSheetName);
            setRendering(false);
        }

        const getConversionChecklistInfo = async (loadSheetName) => {
            try {
                async.current = true;
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-conversion-checklist-info/${loadSheetName}`, {
                    timeout: 5000
                })
                    .then(async res => {
                        async.current = false;
                        let conversionChecklistInfo = res.data[0];
                        conversionChecklistID.current = conversionChecklistInfo.cc_id;
                        await fetchAndWritePersonnelInfo("loadSheetOwner", conversionChecklistInfo.cc_load_sheet_owner);
                        await fetchAndWritePersonnelInfo("decisionMaker", conversionChecklistInfo.cc_decision_maker);
                        await fetchAndWriteSubmittedContributors();
                        await fetchAndWriteAdditionalProcessing();
                        await setFormProps(
                            prev => ({
                                ...prev,
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
            if (!isValidLoadSheetNameEntered && !isDataBeingFetched.current) {
                runPrimaryReadAsyncFunctions()
            } else if (!isDataBeingFetched.current) {
                runSecondaryReadAsyncFunctions(formProps["loadSheetName"]);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidLoadSheetNameEntered) {
                formProps["loadSheetName"].trim().length ? setIsRequestChecklistButtonDisabled(false) : setIsRequestChecklistButtonDisabled(true);
            }
        }
    }, [formProps, handleError, isValidLoadSheetNameEntered, rendering])

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    const validateChecklistNameEntered = () => {
        for (let i = 0; i < loadSheetNamesAlreadyInDB.current.length; i++) {
            let escapeRegExpMatch = formProps["loadSheetName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(loadSheetNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

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

    return (
        <Fragment>
            <LoadingWrapper
                rendering={rendering}
                transitionElementOpacity={transitionElementOpacity}
                transitionElementVisibility={transitionElementVisibility}>
            </LoadingWrapper>
            <AlertWrapper
                alert={alert}
                alertMessage={alertMessage.current}
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
