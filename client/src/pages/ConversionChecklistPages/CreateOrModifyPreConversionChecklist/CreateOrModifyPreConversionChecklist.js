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

function CreateOrModifyPreConversionChecklist() {
    const [rendering, setRendering] = useState(true);
    const { pageFunctionality } = useParams();
    const [isValidLoadSheetNameEntered, setIsValidLoadSheetNameEntered] = useState(false);
    const invalidLoadSheetNameError = useValidationErrorUpdate();
    const [isRequestChecklistButtonDisabled, setIsRequestChecklistButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const optionalFormProps = useRef({
        // loadSheetName: "",
        // personnelOptions: [],
        // loadSheetOwner: { label: "", value: null },
        // decisionMaker: { label: "", value: null },
        // contributors: [],
        // conversionType: { label: "", value: null },
        // additionalProcessing: [],
        // dataSources: "",
        // uniqueRecordsPreCleanup: "",
        // uniqueRecordsPostCleanup: "",
        recordsPreCleanupNotes: "",
        recordsPostCleanupNotes: "",
        preConversionManipulation: "",
        // isFormReviewed: pageFunctionality === "modify" ? true : false,
    });
    const [requiredFormProps, setRequiredFormProps] = useState({
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
        isFormReviewed: pageFunctionality === "modify" ? true : false,
    })
    const conversionChecklistID = useRef("");
    const newPersonnel = useRef([]);
    // const [newPersonnel, setNewPersonnel] = useState([]);
    // const [isFormReviewed, setIsFormReviewed] = useState(false);
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

    // const checkIfRequiredFieldsArePopulated = useCallback(() => {
    //     console.log("checking fields");
    //     if (optionalFormProps.current["loadSheetName"]?.trim().length && requiredFormProps["loadSheetOwner"].value?.length
    //         && requiredFormProps["decisionMaker"].value?.length && optionalFormProps.current["conversionType"].value?.length
    //         && requiredFormProps["additionalProcessing"].length && optionalFormProps.current["dataSources"]?.trim().length
    //         && optionalFormProps.current["uniqueRecordsPreCleanup"] > 0 && optionalFormProps.current["uniqueRecordsPostCleanup"] > 0) {
    //         console.log("all required fields filled in");
    //         setIsReviewChecklistCheckboxDisabled(false);
    //     } else {
    //         console.log("all required fields NOT filled in");
    //         if (!isReviewChecklistCheckboxDisabled) {
    //             setIsReviewChecklistCheckboxDisabled(true);
    //         }
    //     }
    // }, [requiredFormProps, isReviewChecklistCheckboxDisabled])

    useEffect(() => {
        const runPrimaryReadAsyncFunctions = async () => {
            isDataBeingFetched.current = true;
            await fetchLoadSheetNamesAlreadyInDB();
            await fetchPersonnelAlreadyInDB();
            setRendering(false);
        }

        const fetchLoadSheetNamesAlreadyInDB = async () => {
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

        const fetchPersonnelAlreadyInDB = async () => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get("https://voyant-conversion-checklist.herokuapp.com/get-all-personnel", {
                        timeout: 5000
                    })
                        .then(res => {
                            setRequiredFormProps(prev => ({ ...prev, personnelOptions: res.data.map(({ pers_id, pers_fname, pers_lname }) => ({ value: pers_id, label: [pers_fname, pers_lname].join(" ") })) }));
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
                        setRequiredFormProps(prev => ({
                            ...prev,
                            conversionType: { value: conversionChecklistInfo.cc_conversion_type, label: DecoderFunctions.getConversionType(conversionChecklistInfo.cc_conversion_type) },
                            dataSources: conversionChecklistInfo.cc_data_sources,
                            uniqueRecordsPreCleanup: conversionChecklistInfo.uq_records_pre_cleanup,
                            uniqueRecordsPostCleanup: conversionChecklistInfo.uq_records_post_cleanup,
                        }));
                        let copyOfFormProps = optionalFormProps.current;
                        copyOfFormProps["recordsPreCleanupNotes"] = conversionChecklistInfo.cc_records_pre_cleanup_notes;
                        copyOfFormProps["recordsPostCleanupNotes"] = conversionChecklistInfo.cc_records_post_cleanup_notes;
                        copyOfFormProps["preConversionManipulation"] = conversionChecklistInfo.cc_pre_conversion_manipulation;
                        optionalFormProps.current = copyOfFormProps;
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
                            setRequiredFormProps(prev => ({ ...prev, [field]: dataToWrite }));
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

        const fetchAndWriteSubmittedContributors = async () => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-submitted-contributors/${conversionChecklistID.current}`, {
                        timeout: 5000
                    })
                        .then(res => {
                            let dataToWrite = res.data.map(({ pers_id, pers_name }) => ({ value: pers_id, label: pers_name }));
                            setRequiredFormProps(prev => ({ ...prev, contributors: dataToWrite }));
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

        const fetchAndWriteAdditionalProcessing = async () => {
            if (!async.current) {
                try {
                    async.current = true;
                    await Axios.get(`https://voyant-conversion-checklist.herokuapp.com/get-additional-processing/${conversionChecklistID.current}`, {
                        timeout: 5000
                    })
                        .then(res => {
                            let dataToWrite = res.data.map(({ ap_type }) => ({ value: ap_type, label: DecoderFunctions.getAdditionalProcessingType(ap_type) }));
                            setRequiredFormProps(prev => ({ ...prev, additionalProcessing: dataToWrite }));
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
            if ((pageFunctionality === "create" && !isDataBeingFetched.current)
                || (pageFunctionality === "modify" && !isValidLoadSheetNameEntered && !isDataBeingFetched.current)) {
                runPrimaryReadAsyncFunctions();
            } else if (pageFunctionality === "modify" && isValidLoadSheetNameEntered && !isDataBeingFetched.current) {
                runSecondaryReadAsyncFunctions(requiredFormProps["loadSheetName"]);
            }
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (pageFunctionality === "modify" && !isValidLoadSheetNameEntered) {
                requiredFormProps["loadSheetName"].trim().length ? setIsRequestChecklistButtonDisabled(false) : setIsRequestChecklistButtonDisabled(true);
            } else if (!isChecklistSubmitted.current) {
                if (requiredFormProps["loadSheetName"]?.trim().length && requiredFormProps["loadSheetOwner"].value?.length
                    && requiredFormProps["decisionMaker"].value?.length && requiredFormProps["conversionType"].value?.length
                    && requiredFormProps["additionalProcessing"].length && requiredFormProps["dataSources"]?.trim().length) {
                    setIsReviewChecklistCheckboxDisabled(false);
                } else {
                    setIsReviewChecklistCheckboxDisabled(true);
                }
                if (requiredFormProps["isFormReviewed"]) {
                    setIsSubmitOrUpdateButtonDisabled(false);
                } else {
                    setIsSubmitOrUpdateButtonDisabled(true);
                }
            }
        }
    }, [requiredFormProps, handleError, isValidLoadSheetNameEntered, pageFunctionality, rendering])

    const handleRequestChecklist = () => {
        if (!isValidLoadSheetNameEntered) {
            if (validateChecklistNameEntered()) {
                setIsValidLoadSheetNameEntered(true);
                isDataBeingFetched.current = false;
                setRendering(true);
                setIsRequestChecklistButtonDisabled(true);
            } else {
                invalidLoadSheetNameError("Invalid load sheet name");
            }
        }
    }

    // adapted from https://stackoverflow.com/questions/60440139/check-if-a-string-contains-exact-match
    const validateChecklistNameEntered = () => {
        for (let i = 0; i < loadSheetNamesAlreadyInDB.current.length; i++) {
            let escapeRegExpMatch = requiredFormProps["loadSheetName"].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (new RegExp(`(?:^|s|$)${escapeRegExpMatch}(?:^|s|$)`).test(loadSheetNamesAlreadyInDB.current[i])) {
                return true;
            }
        }
        return false;
    }

    const handleSubmitOrUpdate = () => {
        isChecklistSubmitted.current = true;
        setIsSubmitOrUpdateButtonDisabled(true);
        setDisplayFadingBalls(true);
        runWriteAsyncFunctions();
    }

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

    const getNewPersonnel = useCallback(() => {
        async.current = true;
        let newLoadSheetOwner = requiredFormProps["loadSheetOwner"].value === -1
            ? requiredFormProps["loadSheetOwner"]
            : null;
        let newDecisionMaker = requiredFormProps["decisionMaker"].value === -1
            ? (newLoadSheetOwner?.label !== requiredFormProps["decisionMaker"].label)
                ? requiredFormProps["decisionMaker"]
                : null
            : null;
        let newContributors = requiredFormProps["contributors"].filter((val) => {
            return val.value === -1;
        });
        let arrayOfNewPersonnel = [newLoadSheetOwner, newDecisionMaker].concat(newContributors);
        arrayOfNewPersonnel = arrayOfNewPersonnel.filter((val) => {
            return val !== null
        });
        newPersonnel.current = arrayOfNewPersonnel;
        async.current = false;
        assignUIDsToNewPersonnel();
    }, [requiredFormProps]);

    const assignUIDsToNewPersonnel = () => {
        for (let i = 0; i < newPersonnel.current.length; i++) {
            newPersonnel.current[i].value = uuidv4();
        }
    }

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

    const runChecklistSideFunctions = async (operation) => {
        if (operation === "update") {
            await removeRecordsFromDB("additional-processing");
            await removeRecordsFromDB("contributions");
        }
        for (let i = 0; i < requiredFormProps["additionalProcessing"].length; i++) {
            await addAdditionalProcessingToDB(requiredFormProps["additionalProcessing"][i]);
        }
        for (let i = 0; i < requiredFormProps["contributors"].length; i++) {
            await addContributionsToDB(requiredFormProps["contributors"][i]);
        }
    }

    const addChecklistToDB = async () => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-checklist", {
                    loadSheetName: requiredFormProps["loadSheetName"],
                    loadSheetOwner: requiredFormProps["loadSheetOwner"].value,
                    decisionMaker: requiredFormProps["decisionMaker"].value,
                    conversionType: requiredFormProps["conversionType"].value,
                    dataSources: requiredFormProps["dataSources"],
                    uniqueRecordsPreCleanup: requiredFormProps["uniqueRecordsPreCleanup"],
                    uniqueRecordsPostCleanup: requiredFormProps["uniqueRecordsPostCleanup"],
                    recordsPreCleanupNotes: optionalFormProps.current["recordsPreCleanupNotes"]?.length ? optionalFormProps.current["recordsPreCleanupNotes"] : null,
                    recordsPostCleanupNotes: optionalFormProps.current["recordsPostCleanupNotes"]?.length ? optionalFormProps.current["recordsPostCleanupNotes"] : null,
                    preConversionManipulation: optionalFormProps.current["preConversionManipulation"]?.length ? optionalFormProps.current["preConversionManipulation"] : null,
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

    const addAdditionalProcessingToDB = async (additionalProcessingToAdd) => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-additional-processing", {
                    checklistID: conversionChecklistID.current,
                    additionalProcessingType: additionalProcessingToAdd.value
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

    const addContributionsToDB = async (contributionToAdd) => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.post("https://voyant-conversion-checklist.herokuapp.com/add-contribution", {
                    checklistID: conversionChecklistID.current,
                    contributorID: contributionToAdd.value
                }).then(res => {
                    async.current = false;
                });
            } catch (e) {
                console.log(e);
                handleError("w");
            }
        }
    }

    const updateChecklistInDB = async () => {
        if (!async.current) {
            try {
                async.current = true;
                await Axios.put(`https://voyant-conversion-checklist.herokuapp.com/update-pre-conversion-checklist/${conversionChecklistID.current}`, {
                    loadSheetName: requiredFormProps["loadSheetName"],
                    loadSheetOwner: requiredFormProps["loadSheetOwner"].value,
                    decisionMaker: requiredFormProps["decisionMaker"].value,
                    conversionType: requiredFormProps["conversionType"].value,
                    dataSources: requiredFormProps["dataSources"],
                    uniqueRecordsPreCleanup: requiredFormProps["uniqueRecordsPreCleanup"],
                    uniqueRecordsPostCleanup: requiredFormProps["uniqueRecordsPostCleanup"],
                    recordsPreCleanupNotes: optionalFormProps.current["recordsPreCleanupNotes"]?.length ? optionalFormProps.current["recordsPreCleanupNotes"] : null,
                    recordsPostCleanupNotes: optionalFormProps.current["recordsPostCleanupNotes"]?.length ? optionalFormProps.current["recordsPostCleanupNotes"] : null,
                    preConversionManipulation: optionalFormProps.current["preConversionManipulation"]?.length ? optionalFormProps.current["preConversionManipulation"] : null,
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
                        optionalFormProps={optionalFormProps.current}
                        setRequiredFormProps={setRequiredFormProps}
                        // checkFields={checkIfRequiredFieldsArePopulated}
                        isModificationCard={pageFunctionality === "create" ? false : true}
                        existingLoadSheetName={requiredFormProps["loadSheetName"]}
                        invalidLoadSheetNames={loadSheetNamesAlreadyInDB.current}
                        existingPersonnelOptions={requiredFormProps["personnelOptions"]}
                        invalidPersonnel={requiredFormProps["contributors"]}
                        existingLoadSheetOwner={requiredFormProps["loadSheetOwner"]}
                        existingDecisionMaker={requiredFormProps["decisionMaker"]}
                        existingContributors={requiredFormProps["contributors"]}
                        invalidContributors={
                            requiredFormProps["loadSheetOwner"].label && requiredFormProps["decisionMaker"].label
                                ? Array.from(new Set(requiredFormProps["contributors"].concat([requiredFormProps["loadSheetOwner"], requiredFormProps["decisionMaker"]]))) // TODO: fix this roundabout way of doing things
                                : requiredFormProps["loadSheetOwner"].label ? requiredFormProps["contributors"].concat(requiredFormProps["loadSheetOwner"])
                                    : requiredFormProps["decisionMaker"].label ? requiredFormProps["contributors"].concat(requiredFormProps["decisionMaker"])
                                        : requiredFormProps["contributors"]
                        }
                        existingConversionType={requiredFormProps["conversionType"]}
                        existingAdditionalProcessing={requiredFormProps["additionalProcessing"]}
                        existingDataSources={requiredFormProps["dataSources"]}
                        existingUniqueRecordsPreCleanup={requiredFormProps["uniqueRecordsPreCleanup"]}
                        existingUniqueRecordsPostCleanup={requiredFormProps["uniqueRecordsPostCleanup"]}
                        existingRecordsPreCleanupNotes={optionalFormProps.current["recordsPreCleanupNotes"]}
                        existingRecordsPostCleanupNotes={optionalFormProps.current["recordsPostCleanupNotes"]}
                        existingPreConversionManipulation={optionalFormProps.current["preConversionManipulation"]}
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
                                        setFormProps={setRequiredFormProps}
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
