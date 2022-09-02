import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EnterLoadSheetNameCard from "../../../components/EnterLoadSheetNameCard";
import Axios from "axios";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import LoadingWrapper from "../../wrappers/LoadingWrapper/LoadingWrapper";
import AlertWrapper from "../../wrappers/AlertWrapper/AlertWrapper";
import CardWrapper from "../../wrappers/CardWrapper/CardWrapper";
import "../../../styles/DeleteConversionChecklist.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/AlertComponents.css";

/**
 * This page allows users to delete pre-/post-conversion or completed conversion checklists.
 * @returns a page housing all of the components needed to implement the above functionality.
 */
function DeleteConversionChecklist() {
    const [rendering, setRendering] = useState(true);
    const [isValidLoadSheetNameEntered, setIsValidLoadSheetNameEntered] = useState(false);
    const invalidLoadSheetNameError = useValidationErrorUpdate();
    const [isDeleteChecklistButtonDisabled, setIsDeleteChecklistButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [formProps, setFormProps] = useState({
        loadSheetName: "",
    });
    const conversionChecklistID = useRef("");
    const async = useRef(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const alertMessage = useRef("Conversion checklist successfully deleted!");
    const alertType = useRef("success-alert");
    const loadSheetNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const deleteErrorMessage = "Apologies! We were unable to remove the requested conversion checklist. Please try again.";

    const navigate = useNavigate();

    /**
     * Displays an alert with the correct type of error. 
     * @param {string} errorType 
     */
    const handleError = useCallback((errorType) => { // TODO: abstract this function
        setIsErrorThrown(true);
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage // read error message
            : alertMessage.current = deleteErrorMessage; // deletion error message

        if (rendering) {
            setRendering(false);
        }

        setAlert(true);
    }, [setIsErrorThrown, deleteErrorMessage, rendering]);

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
            await fetchAndWriteLoadSheetNamesAlreadyInDB();
            setRendering(false);
        }

        /**
         * Fetches load sheet names that are already stored in the database and writes them to validLoadSheetNames. If the user is creating a post-conversion checklist, pre-conversion load sheet names will be fetched and written. If the user is updating a post-conversion checklist, post-conversion load sheet names will be fetched and written.
         */
        const fetchAndWriteLoadSheetNamesAlreadyInDB = async () => {
            try {
                async.current = true;
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-all-ls-names`, {
                    timeout: 5000
                })
                    .then(res => {
                        loadSheetNamesAlreadyInDB.current = res.data.map(({ cc_load_sheet_name }) => cc_load_sheet_name.toLowerCase());
                        async.current = false;
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
            }
        } else {
            // makes page visible
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!isValidLoadSheetNameEntered) {
                formProps["loadSheetName"].trim().length ? setIsDeleteChecklistButtonDisabled(false) : setIsDeleteChecklistButtonDisabled(true);
            }
        }
    }, [formProps, handleError, isValidLoadSheetNameEntered, rendering])

    /**
     * When the user requests to delete a checklist that has previously been written to the database, that checklist's name is validated (through a call to validateChelistNameEntered). If the checklist name entered is indeed valid, isValidLoadSheetNameEntered is set to true, and functions are called to delete the checklist and its associated testing sessions, before a successful deletion alert is displayed. If the checklist name entered isn't valid, an error message is displayed.
     */
    const handleDeleteChecklist = async () => {
        if (!isValidLoadSheetNameEntered) {
            if (validateChecklistNameEntered()) {
                console.log("valid load sheet name entered");
                setIsValidLoadSheetNameEntered(true);
                isDataBeingFetched.current = false;
                setIsDeleteChecklistButtonDisabled(true);
                setDisplayFadingBalls(true);
                await runSecondaryReadAsyncFunctions(formProps["loadSheetName"]);
                await deleteConversionChecklist();
                setAlert(true);
            } else {
                invalidLoadSheetNameError("Invalid load sheet name"); // context variable
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

    /**
    * Calls functions that fetch and write information required for deleting a checklist from the database. 
    * @param {string} loadSheetName - the load sheet name corresponding to the checklist being deleted.
    */
    const runSecondaryReadAsyncFunctions = async (loadSheetName) => {
        isDataBeingFetched.current = true;
        await fetchAndWriteConversionChecklistID(loadSheetName);
        setRendering(false);
    }

    /**
     * Fetches the ID of the checklist to be deleted and writes it conversionChecklistID.
     * @param {string} loadSheetName - the load sheet name corresponding to the checklist being deleted.
     */
    const fetchAndWriteConversionChecklistID = async (loadSheetName) => {
        try {
            async.current = true;
            await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-conversion-checklist-info/${loadSheetName}`, {
                timeout: 5000
            })
                .then(async res => {
                    async.current = false;
                    let conversionChecklistInfo = res.data[0];
                    conversionChecklistID.current = conversionChecklistInfo.cc_id;
                });
        } catch (e) {
            console.log("error caught:", e);
            handleError("r");
        }
    }

    /**
     * Deletes the specified conversion checklist from the database.
     */
    const deleteConversionChecklist = async () => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.delete(`https://voyant-conversion-checklist.herokuapp.com/remove-checklist/${conversionChecklistID.current}`, {
                    timeout: 5000
                })
                    .then(res => {
                        async.current = false;
                    });
            } catch (e) {
                console.log(e);
                handleError("d");
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
            <CardWrapper
                rendering={rendering}
                alert={alert}
                isErrorThrown={isErrorThrown}
                isUserDeletingChecklist={true}>
                <EnterLoadSheetNameCard
                    setFormProps={setFormProps}
                    requestChecklist={handleDeleteChecklist}
                    isSubmitButtonDisabled={isDeleteChecklistButtonDisabled}
                    isDeletionForm={true}
                    displayFadingBalls={displayFadingBalls}>
                </EnterLoadSheetNameCard>
            </CardWrapper>
        </Fragment>
    )
};

export default DeleteConversionChecklist;
