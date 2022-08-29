import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateOrModifyPostConversionChecklistCard from "../../../components/CreateOrModifyPostConversionChecklistCard";
import EnterLoadSheetNameCard from "../../../components/EnterLoadSheetNameCard";
import Axios from "axios";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import LoadingWrapper from "../../wrappers/LoadingWrapper/LoadingWrapper";
import AlertWrapper from "../../wrappers/AlertWrapper/AlertWrapper";
import CardWrapper from "../../wrappers/CardWrapper/CardWrapper";
import "../../../styles/CreateOrModifyPostConversionChecklist.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/AlertComponents.css";

function CreateOrModifyPostConversionChecklist() {
    const [rendering, setRendering] = useState(true);
    const { pageFunctionality } = useParams();
    const [isValidLoadSheetNameEntered, setIsValidLoadSheetNameEntered] = useState(false);
    const invalidChecklistNameError = useValidationErrorUpdate();
    const [isRequestChecklistButtonDisabled, setIsRequestChecklistButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [formProps, setFormProps] = useState({
        loadSheetName: "",
        postConversionLoadingErrors: "",
        postConversionValidationResults: "",
        postConversionChanges: "",
        isFormReviewed: false,
        isFormApproved: false,
    });
    const conversionChecklistID = useRef("");
    const [isSubmitOrUpdateButtonDisabled, setIsSubmitOrUpdateButtonDisabled] = useState(true);
    const [isReviewChecklistCheckboxDisabled, setIsReviewChecklistCheckboxDisabled] = useState(true);
    const [isApproveChecklistCheckboxDisabled, setIsApproveChecklistCheckboxDisabled] = useState(true);
    const async = useRef(false);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const wordForAlertMessage = useRef(pageFunctionality === "created" ? "submitted" : "updated");
    const alertMessage = useRef(`Conversion checklist successfully ${wordForAlertMessage.current}!`);
    const alertType = useRef("success-alert");
    const validLoadSheetNames = useRef([]);
    const isDataBeingFetched = useRef(false);
    const isChecklistSubmitted = useRef(false);
    const wordForWriteErrorMessage = useRef(pageFunctionality === "create" ? "submit" : "update");

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const writeErrorMessage = `Apologies! We've encountered an error. Please attempt to re-${wordForWriteErrorMessage.current} your conversion checklist.`;

    const navigate = useNavigate();

    const handleError = useCallback((errorType) => {
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage
            : alertMessage.current = writeErrorMessage;

        // Delay is set up just in case an error is generated before the is fully-displayed
        // let delay = transitionElementOpacity === "100%" ? 500 : rendering ? 500 : 0;
        let delay = 0; // TODO: test this and amend if necessary

        if (rendering) {
            setRendering(false);
        }

        setTimeout(() => {
            setAlert(true);
        }, delay);
    }, [setIsErrorThrown, writeErrorMessage, rendering]);

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
                let dbFunction = pageFunctionality === "create" ? "get-valid-pre-conversion-ls-names" : "get-valid-post-conversion-ls-names";
                async.current = true;
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/${dbFunction}`, {
                    timeout: 5000
                })
                    .then(res => {
                        validLoadSheetNames.current = res.data.map(({ cc_load_sheet_name }) => cc_load_sheet_name.toLowerCase());
                        async.current = false;
                    });
            } catch (e) {
                console.log("error caught:", e);
                handleError("r");
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
                        await setFormProps(
                            prev => ({
                                ...prev,
                                postConversionLoadingErrors: conversionChecklistInfo.cc_post_conversion_loading_errors,
                                postConversionValidationResults: conversionChecklistInfo.cc_post_conversion_validation_results,
                                postConversionChanges: conversionChecklistInfo.cc_post_conversion_changes,
                            })
                        );
                    });
            } catch (e) {
                console.log("error caught:", e);
                handleError("r");
            }
        }

        if (rendering) {
            if ((!isValidLoadSheetNameEntered && !isDataBeingFetched.current)) {
                runPrimaryReadAsyncFunctions();
            } else if (isValidLoadSheetNameEntered && !isDataBeingFetched.current) {
                runSecondaryReadAsyncFunctions(formProps["loadSheetName"]);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            // console.log(formProps);
            if (!isValidLoadSheetNameEntered) {
                formProps["loadSheetName"].trim().length ? setIsRequestChecklistButtonDisabled(false) : setIsRequestChecklistButtonDisabled(true);
            } else if (!isChecklistSubmitted.current) {
                if (formProps["postConversionLoadingErrors"]?.trim().length && formProps["postConversionValidationResults"]?.trim().length && formProps["postConversionChanges"]?.trim().length) {
                    setIsReviewChecklistCheckboxDisabled(false);
                    setIsApproveChecklistCheckboxDisabled(false);
                } else {
                    setIsReviewChecklistCheckboxDisabled(true);
                    setIsApproveChecklistCheckboxDisabled(true);
                }
                if (formProps["isFormReviewed"] && formProps["isFormApproved"]) {
                    setIsSubmitOrUpdateButtonDisabled(false);
                } else {
                    setIsSubmitOrUpdateButtonDisabled(true);
                }
            }
        }
    }, [formProps, handleError, isValidLoadSheetNameEntered, pageFunctionality, rendering])

    const handleRequestChecklist = () => {
        if (!isValidLoadSheetNameEntered) {
            if (validateChecklistNameEntered()) {
                setIsValidLoadSheetNameEntered(true);
                isDataBeingFetched.current = false;
                setRendering(true);
                setIsSubmitOrUpdateButtonDisabled(true);
            } else {
                invalidChecklistNameError("Invalid load sheet name");
            }
        }
    }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    const validateChecklistNameEntered = () => {
        for (let i = 0; i < validLoadSheetNames.current.length; i++) {
            let escapeRegExpMatch = formProps["loadSheetName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(validLoadSheetNames.current[i])) {
                return true;
            }
        }
        return false;
    }

    const handleSubmitOrUpdate = () => {
        isChecklistSubmitted.current = true;
        setIsSubmitOrUpdateButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunction();
    }

    const runWriteAsyncFunction = async () => {
        await updateChecklistInDB();
        setAlert(true);
    }

    const updateChecklistInDB = async () => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.put(`https://voyant-conversion-checklist.herokuapp.com/update-post-conversion-checklist/${conversionChecklistID.current}`, {
                    postConversionLoadingErrors: formProps["postConversionLoadingErrors"]?.length ? formProps["postConversionLoadingErrors"] : null,
                    postConversionValidationResults: formProps["postConversionValidationResults"]?.length ? formProps["postConversionValidationResults"] : null,
                    postConversionChanges: formProps["postConversionChanges"]?.length ? formProps["postConversionChanges"] : null,
                })
                    .then(res => {
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("w");
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
                    isErrorThrown={isErrorThrown}
                    preConversionChecklist={true}>
                    <CreateOrModifyPostConversionChecklistCard
                        setFormProps={setFormProps}
                        isModificationCard={pageFunctionality === "create" ? false : true}
                        existingLoadSheetName={formProps["loadSheetName"]}
                        invalidLoadSheetNames={validLoadSheetNames.current}
                        isReviewCheckboxDisabled={isReviewChecklistCheckboxDisabled || async.current}
                        isApproveCheckboxDisabled={isApproveChecklistCheckboxDisabled || async.current}
                        isSubmitOrUpdateButtonDisabled={isSubmitOrUpdateButtonDisabled}
                        isCancelButtonDisabled={async.current}
                        submitOrUpdateChecklist={handleSubmitOrUpdate}
                        displayFadingBalls={displayFadingBalls}>
                    </CreateOrModifyPostConversionChecklistCard>
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
                                        titleString={pageFunctionality === "create" ? "pre-" : "post-"}
                                        setFormProps={setFormProps}
                                        requestChecklist={handleRequestChecklist}
                                        isSubmitButtonDisabled={isRequestChecklistButtonDisabled}>
                                    </EnterLoadSheetNameCard>
                                </div>
                            </div>
                        </div>}
                </Fragment>}
        </Fragment>
    )
};

export default CreateOrModifyPostConversionChecklist;
