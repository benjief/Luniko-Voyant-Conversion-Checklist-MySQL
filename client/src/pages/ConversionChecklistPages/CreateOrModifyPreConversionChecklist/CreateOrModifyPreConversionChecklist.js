import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateOrModifyPreConversionChecklistCard from "../../../components/CreateOrModifyPreConversionChecklistCard";
import EnterLoadSheetNameCard from "../../../components/EnterLoadSheetNameCard";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useValidationErrorUpdate } from "../Context/ValidationErrorContext";
import * as DecoderFunctions from "../../../functional_components/DecoderFunctions";
import LoadingWrapper from "../../wrappers/LoadingWrapper/LoadingWrapper";
import AlertWrapper from "../../wrappers/AlertWrapper/AlertWrapper";
import CardWrapper from "../../wrappers/CardWrapper/CardWrapper";
import "../../../styles/CreateOrModifyPreConversionChecklist.css";
import "../../../styles/SelectorComponents.css";
import "../../../styles/InputComponents.css";
import "../../../styles/CardComponents.css";
import "../../../styles/AlertComponents.css";

/**
 * This page allows users to create or modify pre-conversion checklists. Load sheet names must be different than any other load sheet name already written to the database. Personnel and contributors that aren't already listed as options can be added (and will then be written to the database). Load sheet owners/decision makers and contributers are mutually exclusive.
 * @returns a page housing all of the components needed to implement the above functionality.
 */
function CreateOrModifyPreConversionChecklist() {
    const [rendering, setRendering] = useState(true);
    const { pageFunctionality } = useParams();
    const [isValidLoadSheetNameEntered, setIsValidLoadSheetNameEntered] = useState(false);
    const invalidLoadSheetNameError = useValidationErrorUpdate();
    const [isRequestChecklistButtonDisabled, setIsRequestChecklistButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const nonSelectorFormProps = useRef({   // props that aren't tied to selector components
        loadSheetName: "",
        dataSources: "",
        uniqueRecordsPreCleanup: "",
        uniqueRecordsPostCleanup: "",
        recordsPreCleanupNotes: "",
        recordsPostCleanupNotes: "",
        preConversionManipulation: "",
        isFormReviewed: pageFunctionality === "modify" ? true : false,
    });
    const [selectorFormProps, setSelectorFormProps] = useState({ // props that are tied to selector components
        personnelOptions: [],
        loadSheetOwner: { label: "", value: null },
        decisionMaker: { label: "", value: null },
        contributors: [],
        conversionType: { label: "", value: null },
        additionalProcessing: [],
    })
    const conversionChecklistID = useRef("");
    const newPersonnel = useRef([]);
    const [isSubmitOrUpdateButtonDisabled, setIsSubmitOrUpdateButtonDisabled] = useState(true);
    const [isReviewChecklistCheckboxDisabled, setIsReviewChecklistCheckboxDisabled] = useState(true);
    const async = useRef(false);
    const [displayFadingBalls, setDisplayFadingBalls] = useState(false);
    const [isErrorThrown, setIsErrorThrown] = useState(false);
    const [alert, setAlert] = useState(false);
    const wordForAlertMessage = useRef(pageFunctionality === "created" ? "submitted" : "updated");
    const alertMessage = useRef(`Conversion checklist successfully ${wordForAlertMessage.current}!`);
    const alertType = useRef("success-alert");
    const loadSheetNamesAlreadyInDB = useRef([]);
    const isDataBeingFetched = useRef(false);
    const isChecklistSubmitted = useRef(false);
    const wordForWriteErrorMessage = useRef(pageFunctionality === "create" ? "submit" : "update");

    const loadErrorMessage = "Apologies! We've encountered an error. Please attempt to re-load this page.";
    const writeErrorMessage = `Apologies! We've encountered an error. Please attempt to re-${wordForWriteErrorMessage.current} your conversion checklist.`;

    const navigate = useNavigate();

    /**
     * Displays an alert with the correct type of error. 
     * @param {string} errorType 
     */
    const handleError = useCallback((errorType) => {
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

    /**
     * Checks if all required form fields have been populated by the user. If all required fields have been populated, the "review checklist" radio button is activated. If not, it is set to disabled. Once the "review checklist" radio button has been checked by the user, the submit (or update) button is activated. If the "review checklist" radio button gets unchecked for whatever reason (whether that be the user unchecking it, or a required field being removed), the submit (or update) button will be disabled.
     */
    const checkIfRequiredFieldsArePopulated = useCallback(() => {
        if (pageFunctionality === "modify" && !isValidLoadSheetNameEntered) {
            nonSelectorFormProps.current["loadSheetName"].trim().length ? setIsRequestChecklistButtonDisabled(false) : setIsRequestChecklistButtonDisabled(true);
        } else if (nonSelectorFormProps.current["loadSheetName"]?.trim().length && selectorFormProps["loadSheetOwner"].value
            && selectorFormProps["decisionMaker"].value && selectorFormProps["conversionType"].value
            && selectorFormProps["additionalProcessing"].length && nonSelectorFormProps.current["dataSources"]?.trim().length
            && nonSelectorFormProps.current["uniqueRecordsPreCleanup"] > 0 && nonSelectorFormProps.current["uniqueRecordsPostCleanup"] > 0) {
            setIsReviewChecklistCheckboxDisabled(false);
            if (nonSelectorFormProps.current["isFormReviewed"]) {
                setIsSubmitOrUpdateButtonDisabled(false);
            } else {
                setIsSubmitOrUpdateButtonDisabled(true);
            }
        } else {
            setIsReviewChecklistCheckboxDisabled(true);
        }
    }, [isValidLoadSheetNameEntered, pageFunctionality, selectorFormProps])

    useEffect(() => {
        /**
         * Calls functions that gather information required for the initial page load. Once all required information is gathered, rendering is set to false and the page is displayed.
         */
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchAndWriteLoadSheetNamesAlreadyInDB();
            await fetchAndWritePersonnelAlreadyInDB();
            setRendering(false);
        }

        /**
         * Fetches load sheet names that are already stored in the database and writes them to loadSheetNamesAlreadyInDB. If a user is creating a pre-conversion checklist, all the load sheet names in the database are fetched and written. Alternatively, if the user is modifying an existing form, since the load sheet name is immutable once submitted, only pre-conversion load sheet names must be fetched by the page (so that only pre-conversion checklists are loadable).
         */
        const fetchAndWriteLoadSheetNamesAlreadyInDB = async () => {
            try {
                let dbFunction = pageFunctionality === "create" ? "get-all-ls-names" : "get-valid-pre-conversion-ls-names";
                async.current = true;
                await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/${dbFunction}`, {
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

        /**
         * Fetches and writes personnel that already exist in the database to the personnelOptions prop in selectorFormProps.
         */
        const fetchAndWritePersonnelAlreadyInDB = async () => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-all-personnel", {
                        timeout: 5000
                    })
                        .then(res => {
                            setSelectorFormProps(prev => ({ ...prev, personnelOptions: res.data.map(({ pers_id, pers_fname, pers_lname }) => ({ value: pers_id, label: [pers_fname, pers_lname].join(" ") })) }));
                            // setFormProps(
                            //     prev => ({ ...prev, personnelOptions: res.data.map(({ pers_id, pers_fname, pers_lname }) => ({ value: pers_id, label: [pers_fname, pers_lname].join(" ") })) })
                            // )
                            async.current = false;
                        });
                } catch (e) {
                    console.log("error caught:", e);
                    handleError("r");
                }
            }
        }

        /**
         * Calls functions that fetch and write information required for displaying a previously-submitted pre-conversion checklist.
         * @param {string} loadSheetName - the load sheet name corresponding to the checklist for which information is being fetched.
         */
        const runSecondaryReadAsyncFunctions = async (loadSheetName) => {
            isDataBeingFetched.current = true;
            await fetchAndWriteConversionChecklistInfo(loadSheetName);
            setRendering(false);
        }

        /**
         * Fetches and writes (/calls functions to write) pre-conversion checklist information to nonSelectorFormProps and selectorFormProps.
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
                        setSelectorFormProps(prev => ({
                            ...prev,
                            conversionType: { value: conversionChecklistInfo.cc_conversion_type, label: DecoderFunctions.getConversionType(conversionChecklistInfo.cc_conversion_type) },
                        }));
                        let copyOfFormProps = nonSelectorFormProps.current;
                        copyOfFormProps["loadSheetName"] = conversionChecklistInfo.cc_load_sheet_name;
                        copyOfFormProps["dataSources"] = conversionChecklistInfo.cc_data_sources;
                        copyOfFormProps["uniqueRecordsPreCleanup"] = conversionChecklistInfo.uq_records_pre_cleanup;
                        copyOfFormProps["uniqueRecordsPostCleanup"] = conversionChecklistInfo.uq_records_post_cleanup;
                        copyOfFormProps["recordsPreCleanupNotes"] = conversionChecklistInfo.cc_records_pre_cleanup_notes;
                        copyOfFormProps["recordsPostCleanupNotes"] = conversionChecklistInfo.cc_records_post_cleanup_notes;
                        copyOfFormProps["preConversionManipulation"] = conversionChecklistInfo.cc_pre_conversion_manipulation;
                        nonSelectorFormProps.current = copyOfFormProps;
                    });
            } catch (e) {
                console.log("error caught:", e);
                handleError("r");
            }
        }

        /**
         * Fetches personnel information from the database corresponding to a given personnel ID and writes that information to selectorFormProps. A personnel object of the form {value: personnelID, label: personnelName} is written to the correct field in selectorFormProps.
         * @param {string} field - the selectorFormProps field to be written to (e.g. loadSheetOwner or decisionMaker).
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
                            let dataToWrite = { value: personnelID, label: res.data[0].pers_name }; // an array is returned
                            setSelectorFormProps(prev => ({ ...prev, [field]: dataToWrite }));
                            // setFormProps(
                            //     prev => ({ ...prev, [field]: dataToWrite })
                            // );
                            async.current = false;
                        });
                } catch (e) {
                    console.log("error caught:", e);
                    handleError("r");
                }
            }
        }

        /**
         * Fetches information about contributors that have been submitted as part of a pre-conversion checklist. An array of personnel objects that have the form {value: personnelID, label: personnelName} is written to the correct field in selectorFormProps.
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
                            setSelectorFormProps(prev => ({ ...prev, contributors: dataToWrite }));
                            // setFormProps(
                            //     prev => ({ ...prev, contributors: dataToWrite })
                            // );
                            async.current = false;
                        });
                } catch (e) {
                    console.log("error caught:", e);
                    handleError("r");
                }
            }
        }

        /**
         * Fetches information about additional processing that has submitted as part of a pre-conversion checklist. An array of additional processing objects that have the form {value: ap_type, label: descriptor for ap_type (obtained from DecoderFunctions.js)} is written to the correct field in selectorFormProps.
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
                            setSelectorFormProps(prev => ({ ...prev, additionalProcessing: dataToWrite }));
                            // setFormProps(
                            //     prev => ({ ...prev, additionalProcessing: dataToWrite })
                            // );
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
            if ((pageFunctionality === "create" && !isDataBeingFetched.current)
                || (pageFunctionality === "modify" && !isValidLoadSheetNameEntered && !isDataBeingFetched.current)) {
                runPrimaryReadAsyncFunctions();
            } else if (pageFunctionality === "modify" && isValidLoadSheetNameEntered && !isDataBeingFetched.current) {
                runSecondaryReadAsyncFunctions(nonSelectorFormProps.current["loadSheetName"]);
            }
        } else {
            // makes page visible
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            checkIfRequiredFieldsArePopulated();
        }
    }, [checkIfRequiredFieldsArePopulated, handleError, selectorFormProps, isValidLoadSheetNameEntered, pageFunctionality, rendering])

    /**
     * When the user requests a load sheet name that has previously been written to the database, that load sheet name is validated (through a call to validateChecklistNameEntered). If the load sheet name entered is indeed valid, setValidLoadSheetName is set to true, as is rendering, and the "request checklist" button is disabled. Then, the useEffect hook carries out secondary read async functions to fetch/write all of the necessary checklist information to the page. If the load sheet name entered isn't valid, an error message is displayed.
     */
    const handleRequestChecklist = () => {
        if (!isValidLoadSheetNameEntered) {
            if (validateChecklistNameEntered()) {
                setIsValidLoadSheetNameEntered(true);
                isDataBeingFetched.current = false;
                setRendering(true);
                setIsRequestChecklistButtonDisabled(true);
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
            let escapeRegExpMatch = nonSelectorFormProps.current["loadSheetName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(loadSheetNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * When the user clicks on the submit (or update) button, the isChecklistSubmitted prop is set to true, and said button is disabled (to prevent multiple submission clicks). A set of fading balls is then displayed (to indicate that the page is working on a request), and the page's write functions are triggered through runWriteAysncFunctions.
     */
    const handleSubmitOrUpdate = () => { // TODO: abstract this function
        isChecklistSubmitted.current = true;
        setIsSubmitOrUpdateButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunctions();
    }

    /**
     * Calls a series of functions that write checklist information to the database. First, new personnel (entered by the user, who aren't already in the database) are gathered. Then, they are added to the databse (if they exist). After this, if a user has created a new conversion checklist, that checklist, along with the user's selected additional processing and any submitted contributors (if they exist) are written to the database. If a user is updating a checklist, any additional processing or contributors that were previously submitted are first removed from the database (since they're stored in separate tables), before being re-added, using updated information, and updating the previously-submitted checklist's fields. An alert is displayed once all of the called functions have run.
     */
    const runWriteAsyncFunctions = async () => {
        getNewPersonnel();
        try { // TODO: is try/catch block necessary, or can we use individual functions being called?
            for (let i = 0; i < newPersonnel.current.length; i++) {
                await addNewPersonnelToDB(newPersonnel.current[i]);
            }
            if (pageFunctionality === "create") {
                await addChecklistToDB();
                await runChecklistSideFunctions("create");
            } else {
                await runChecklistSideFunctions("update");
                await updateChecklistInDB();
            }
            setAlert(true);
        } catch (e) {
            console.log(e);
            handleError("w");
        }
    }

    /**
     * Newly-added personnel are assigned a value of -1. A newly-added load sheet owner is checked for, followed by a newly-added decision maker and contributors. Since load sheet owners and decision makers can be identical, an additional check is carried out to determine whether or not these are the same person. If they're not, two additional personnel will be added to the database. If they are, only one record will be added (since adding both would create redundancy). Note that all new personnel are assigned a UID, using uuidv4 (https://www.npmjs.com/package/uuid).
     */
    const getNewPersonnel = useCallback(() => {
        async.current = true;
        let newLoadSheetOwner = selectorFormProps["loadSheetOwner"].value === -1
            ? selectorFormProps["loadSheetOwner"]
            : null;
        let newDecisionMaker = selectorFormProps["decisionMaker"].value === -1
            ? (newLoadSheetOwner?.label !== selectorFormProps["decisionMaker"].label) // additional check
                ? selectorFormProps["decisionMaker"]
                : null
            : null;
        let newContributors = selectorFormProps["contributors"].filter((val) => {
            return val.value === -1;
        });
        let arrayOfNewPersonnel = [newLoadSheetOwner, newDecisionMaker].concat(newContributors);
        arrayOfNewPersonnel = arrayOfNewPersonnel.filter((val) => {
            return val !== null
        });
        newPersonnel.current = arrayOfNewPersonnel;
        async.current = false;
        assignUIDsToNewPersonnel();
    }, [selectorFormProps]);

    const assignUIDsToNewPersonnel = () => {
        for (let i = 0; i < newPersonnel.current.length; i++) {
            newPersonnel.current[i].value = uuidv4();
        }
    }

    /**
     * Writes new personnel to the database, using the UID assigned in getNewPersonnel (above), along with their first and last names, entered by the user.
     * @param {object} personnelToAdd - personnel object containing information for the personnel to be written to the database.
     */
    const addNewPersonnelToDB = async (personnelToAdd) => {
        if (!async.current) {
            let firstName = personnelToAdd.label.split(" ")[0];
            let lastName = personnelToAdd.label.substring(personnelToAdd.label.indexOf(" ") + 1);
            try {
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-personnel", {
                    pers_id: personnelToAdd.value,
                    pers_fname: firstName,
                    pers_lname: lastName,
                })
                    .then(res => {
                        async.current = false;
                    });
            } catch (err) {
                console.log("error caught:", err);
                handleError("w");
            }
        }
    }

    /**
     * Calls functions that remove records from the database and add additional processing/contributions records. If the user is writing a new checklist to the database, only the write functions are called. If the user is updating a pre-existing checklist, additional processing/contributions records are removed and re-written from/to the database before said checklist is updated.
     * @param {string} operation  - "create" or "update" depending on what the user is doing (i.e. creating or updating a checklist).
     */
    const runChecklistSideFunctions = async (operation) => {
        if (operation === "update") { // records are only removed if the user is updating a checklist
            await removeRecordsFromDB("additional-processing");
            await removeRecordsFromDB("contributions");
        }
        for (let i = 0; i < selectorFormProps["additionalProcessing"].length; i++) {
            await addAdditionalProcessingToDB(selectorFormProps["additionalProcessing"][i]);
        }
        for (let i = 0; i < selectorFormProps["contributors"].length; i++) {
            await addContributionsToDB(selectorFormProps["contributors"][i]);
        }
    }

    /**
     * Creates a new record by writing submitted checklist information to the database.
     */
    const addChecklistToDB = async () => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-checklist", {
                    loadSheetName: nonSelectorFormProps.current["loadSheetName"],
                    loadSheetOwner: selectorFormProps["loadSheetOwner"].value,
                    decisionMaker: selectorFormProps["decisionMaker"].value,
                    conversionType: selectorFormProps["conversionType"].value,
                    dataSources: nonSelectorFormProps.current["dataSources"],
                    uniqueRecordsPreCleanup: nonSelectorFormProps.current["uniqueRecordsPreCleanup"],
                    uniqueRecordsPostCleanup: nonSelectorFormProps.current["uniqueRecordsPostCleanup"],
                    recordsPreCleanupNotes: nonSelectorFormProps.current["recordsPreCleanupNotes"]?.length ? nonSelectorFormProps.current["recordsPreCleanupNotes"] : null,
                    recordsPostCleanupNotes: nonSelectorFormProps.current["recordsPostCleanupNotes"]?.length ? nonSelectorFormProps.current["recordsPostCleanupNotes"] : null,
                    preConversionManipulation: nonSelectorFormProps.current["preConversionManipulation"]?.length ? nonSelectorFormProps.current["preConversionManipulation"] : null,
                })
                    .then(res => {
                        async.current = false;
                        /* 
                        a conversion checklist ID is generated server-side and returned to be used while writing additional (processing 
                        contribution records.
                        */
                        conversionChecklistID.current = res.data.insertId;
                    });
            } catch (e) {
                console.log(e);
                handleError("w");
            }
        }
    }

    /**
     * Deletes records from the database. The Axios function called depends on the function input.
     * @param {string} processToExecute - "additional-processing" or "contributions" depending on what is to be deleted from the database.
     */
    const removeRecordsFromDB = async (processToExecute) => {
        const axiosProcessString = `${["https://voyant-conversion-checklist.herokuapp.com/remove-", processToExecute].join("")}/${conversionChecklistID.current}`;
        if (!async.current) {
            try {
                async.current = true;
                await Axios.delete(axiosProcessString, {
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

    /**
     * Writes a submitted additional processing record to the database, using the ID of the checklist being created/updated.
     * @param {object} additionalProcessingToAdd - object containing the additional processing record to be written.
     */
    const addAdditionalProcessingToDB = async (additionalProcessingToAdd) => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-additional-processing", {
                    checklistID: conversionChecklistID.current,
                    additionalProcessingType: additionalProcessingToAdd.value // only the value is written to the database
                })
                    .then(res => {
                        async.current = false;
                    });
            } catch (e) {
                console.log("error caught:", e);
                handleError("w");
            }
        }
    }

    /**
     * Writes a submitted contribution record to the database, using the ID of the checklist being created/updated.
     * @param {object} contributionToAdd - object containing the contribution record to be written. 
     */
    const addContributionsToDB = async (contributionToAdd) => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-contribution", {
                    checklistID: conversionChecklistID.current,
                    contributorID: contributionToAdd.value // only the value is written to the database
                }).then(res => {
                    async.current = false;
                });
            } catch (e) {
                console.log(e);
                handleError("w");
            }
        }
    }

    /**
     * Updates a checklist record in the database with newly-submitted information. Note that all information is overwritten, even if a particular field hasn't actually been changed.
     */
    const updateChecklistInDB = async () => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.put(`https://voyant-conversion-checklist.herokuapp.com/update-pre-conversion-checklist/${conversionChecklistID.current}`, {
                    loadSheetName: nonSelectorFormProps.current["loadSheetName"],
                    loadSheetOwner: selectorFormProps["loadSheetOwner"].value,
                    decisionMaker: selectorFormProps["decisionMaker"].value,
                    conversionType: selectorFormProps["conversionType"].value,
                    dataSources: nonSelectorFormProps.current["dataSources"],
                    uniqueRecordsPreCleanup: nonSelectorFormProps.current["uniqueRecordsPreCleanup"],
                    uniqueRecordsPostCleanup: nonSelectorFormProps.current["uniqueRecordsPostCleanup"],
                    recordsPreCleanupNotes: nonSelectorFormProps.current["recordsPreCleanupNotes"]?.length ? nonSelectorFormProps.current["recordsPreCleanupNotes"] : null,
                    recordsPostCleanupNotes: nonSelectorFormProps.current["recordsPostCleanupNotes"]?.length ? nonSelectorFormProps.current["recordsPostCleanupNotes"] : null,
                    preConversionManipulation: nonSelectorFormProps.current["preConversionManipulation"]?.length ? nonSelectorFormProps.current["preConversionManipulation"] : null,
                })
                    .then(res => {
                        async.current = false;
                        conversionChecklistID.current = res.data.insertId; // TODO: get rid of this?
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
            {pageFunctionality === "create" || (pageFunctionality === "modify" && isValidLoadSheetNameEntered)
                ? <CardWrapper
                    rendering={rendering}
                    alert={alert}
                    isErrorThrown={isErrorThrown}
                    preConversionChecklist={true}>
                    <CreateOrModifyPreConversionChecklistCard
                        nonSelectorFormProps={nonSelectorFormProps.current}
                        setSelectorFormProps={setSelectorFormProps}
                        checkIfRequiredFieldsArePopulated={checkIfRequiredFieldsArePopulated}
                        isModificationCard={pageFunctionality === "create" ? false : true}
                        existingLoadSheetName={nonSelectorFormProps.current["loadSheetName"]}
                        invalidLoadSheetNames={loadSheetNamesAlreadyInDB.current}
                        existingPersonnelOptions={selectorFormProps["personnelOptions"]}
                        invalidPersonnel={selectorFormProps["contributors"]}
                        existingLoadSheetOwner={selectorFormProps["loadSheetOwner"]}
                        existingDecisionMaker={selectorFormProps["decisionMaker"]}
                        existingContributors={selectorFormProps["contributors"]}
                        invalidContributors={
                            selectorFormProps["loadSheetOwner"].label && selectorFormProps["decisionMaker"].label
                                ? Array.from(new Set(selectorFormProps["contributors"].concat([selectorFormProps["loadSheetOwner"], selectorFormProps["decisionMaker"]])))
                                : selectorFormProps["loadSheetOwner"].label ? selectorFormProps["contributors"].concat(selectorFormProps["loadSheetOwner"])
                                    : selectorFormProps["decisionMaker"].label ? selectorFormProps["contributors"].concat(selectorFormProps["decisionMaker"])
                                        : selectorFormProps["contributors"]
                        }
                        existingConversionType={selectorFormProps["conversionType"]}
                        existingAdditionalProcessing={selectorFormProps["additionalProcessing"]}
                        existingDataSources={nonSelectorFormProps.current["dataSources"]}
                        existingUniqueRecordsPreCleanup={nonSelectorFormProps.current["uniqueRecordsPreCleanup"]}
                        existingUniqueRecordsPostCleanup={nonSelectorFormProps.current["uniqueRecordsPostCleanup"]}
                        existingRecordsPreCleanupNotes={nonSelectorFormProps.current["recordsPreCleanupNotes"]}
                        existingRecordsPostCleanupNotes={nonSelectorFormProps.current["recordsPostCleanupNotes"]}
                        existingPreConversionManipulation={nonSelectorFormProps.current["preConversionManipulation"]}
                        isCheckboxDisabled={isReviewChecklistCheckboxDisabled || async.current}
                        isSubmitOrUpdateButtonDisabled={isSubmitOrUpdateButtonDisabled}
                        isCancelButtonDisabled={async.current}
                        submitOrUpdateChecklist={handleSubmitOrUpdate}
                        displayFadingBalls={displayFadingBalls}>
                    </CreateOrModifyPreConversionChecklistCard>
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
                                        titleString={"pre-"}
                                        useSetFormProps={false}
                                        useRefHookFormProps={nonSelectorFormProps.current}
                                        checkIfRequiredFieldsArePopulated={checkIfRequiredFieldsArePopulated}
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

export default CreateOrModifyPreConversionChecklist;
