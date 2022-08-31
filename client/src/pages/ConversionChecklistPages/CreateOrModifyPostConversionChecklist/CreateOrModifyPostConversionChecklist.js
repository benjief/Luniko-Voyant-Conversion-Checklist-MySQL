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

/**
 * This page allows users to create or modify post-conversion checklists. Note that once a post-conversion checklist has been submitted, the checklist is classified as such, and the pre-conversion component of this checklist will no longer be modifiable. Furthermore, once a post-conversion checklist has been approved by an IT director, it is marked as completed and will no longer be modifiable.
 * @returns a page housing all of the components needed to implement the above functionality.
 */
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
        isFormReviewed: pageFunctionality === "modify" ? true : false,
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

    /**
     * Displays an alert with the correct type of error (success or error). 
     * @param {string} errorType 
     */
    const handleError = useCallback((errorType) => { // TODO: abstract this function
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage // read error message
            : alertMessage.current = writeErrorMessage; // write error message

        if (rendering) {
            setRendering(false);
        }

        setAlert(true);
    }, [setIsErrorThrown, writeErrorMessage, rendering]);

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
         * Fetches load sheet names that are already stored in the database and writes them to validLoadSheetNames. If the user is creating a post-conversion checklist, pre-conversion load sheet names will be fetched and written. If the user is updating a post-conversion checklist, post-conversion load sheet names will be fetched and written.
         */
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

        /**
         * Calls functions that fetch and write information required for displaying a post-conversion checklist. Note that this function runs regardless of whether the user is creating a new post-conversion checklist, or updating one that was previously-submitted.
         * @param {string} loadSheetName - the load sheet name corresponding to the checklist for which information is being fetched.
         */
        const runSecondaryReadAsyncFunctions = async (loadSheetName) => {
            isDataBeingFetched.current = true;
            await fetchAndWriteConversionChecklistInfo(loadSheetName);
            setRendering(false);
        }

        /**
         * Fetches and writes post-conversion checklist information to formProps.
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
            // runs fetch/write functions, depending on the page's state
            if ((!isValidLoadSheetNameEntered && !isDataBeingFetched.current)) {
                runPrimaryReadAsyncFunctions();
            } else if (isValidLoadSheetNameEntered && !isDataBeingFetched.current) {
                runSecondaryReadAsyncFunctions(formProps["loadSheetName"]);
            }
        } else {
            // makes page visible
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
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
                if (formProps["isFormReviewed"]) {
                    setIsSubmitOrUpdateButtonDisabled(false);
                } else {
                    setIsSubmitOrUpdateButtonDisabled(true);
                }
            }
        }
    }, [formProps, handleError, isValidLoadSheetNameEntered, pageFunctionality, rendering])

    /**
     * When a user requests a load sheet name that has previously been written to the database, that load sheet name is validated (through a call to validateChecklistNameEntered). If the load sheet name entered is indeed valid (given the page's state), setValidLoadSheetName is set to true, as is rendering, and the "request checklist" button is disabled. Then, the useEffect hook carries out secondary read async functions to fetch/write all of the necessary checklist information to the page. If the load sheet name entered isn't valid, an error message is displayed.
     */
    const handleRequestChecklist = () => {
        if (!isValidLoadSheetNameEntered) {
            if (validateChecklistNameEntered()) {
                setIsValidLoadSheetNameEntered(true);
                isDataBeingFetched.current = false;
                setRendering(true);
                setIsRequestChecklistButtonDisabled(true);
            } else {
                // this is a context variable
                invalidChecklistNameError("Invalid load sheet name");
            }
        }
    }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    /**
     * Compares the load sheet name entered by the user to load sheet names obtained by the page's primary read functions. If the entered load sheet name is matched against the set of valid load sheet names (this will depend on the page and what kind of checklist is being retrieved), the function returns true. If not, it returns false.
     * @returns true if the entered load sheet name is matched against the set of valid load sheet names, false otherwise.
     */
    const validateChecklistNameEntered = () => {
        for (let i = 0; i < validLoadSheetNames.current.length; i++) {
            let escapeRegExpMatch = formProps["loadSheetName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(validLoadSheetNames.current[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * When the user clicks on the submit (or update) button, the isChecklistSubmitted prop is set to true, and said button is disabled (to prevent multiple submission clicks). A set of fading balls is then displayed (to indicate that the page is working on a request), and the page's write functions are triggered through runWriteAysncFunctions.
     */
    const handleSubmitOrUpdate = () => {
        isChecklistSubmitted.current = true;
        setIsSubmitOrUpdateButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunction();
    }

    /**
     * Literally just calls updateChecklistInDB before displaying an alert.
     */
    const runWriteAsyncFunction = async () => {
        await updateChecklistInDB();
        setAlert(true);
    }

    /**
     * Updates a checklist record in the database with newly-submitted information. A post-conversion checklist is defined in the database by having its post-conversion fields filled out (i.e. not NULL). These fields exist as soon as a pre-conversion checklist is created. As such, creating a new post-conversion checklist and updating one will both update a pre-existing (pre- or post-conversion) checklist. Essentially,every record stored in the checklist table is just a checklist, regardless of what state it is in. Note that all information is overwritten, even if a particular field hasn't actually been changed. 
     */
    const updateChecklistInDB = async () => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.put(`https://voyant-conversion-checklist.herokuapp.com/update-post-conversion-checklist/${conversionChecklistID.current}`, {
                    postConversionLoadingErrors: formProps["postConversionLoadingErrors"]?.length ? formProps["postConversionLoadingErrors"] : null,
                    postConversionValidationResults: formProps["postConversionValidationResults"]?.length ? formProps["postConversionValidationResults"] : null,
                    postConversionChanges: formProps["postConversionChanges"]?.length ? formProps["postConversionChanges"] : null,
                    approvedByITDirector: formProps["isFormApproved"]
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
                        existingPostConversionLoadingErrors={formProps["postConversionLoadingErrors"]}
                        existingPostConversionValidationResults={formProps["postConversionValidationResults"]}
                        existingPostConversionChanges={formProps["postConversionChanges"]}
                        isReviewCheckboxDisabled={isReviewChecklistCheckboxDisabled || async.current}
                        isApproveCheckboxDisabled={isApproveChecklistCheckboxDisabled || async.current}
                        isFormApproved={formProps["isFormApproved"]}
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
