import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialSingleSelect from './MaterialSingleSelect';
import MaterialMultiSelectFreeSoloForNames from './MaterialMultiSelectFreeSoloForNames';
import MaterialTextField from './MaterialTextField';
import MaterialMultiSelect from './MaterialMultiSelect';
import MaterialSingleSelectFreeSoloForNames from './MaterialSingleSelectFreeSoloForNames';
import MaterialCheckBox from './MaterialCheckBox';
import SubmitButton from './SubmitButton';

// pre-defined selector options
const conversionTypeOptions = [
    { value: "M", label: "Manual" },
    { value: "D", label: "DMT" }
];

// these two sets of additional processing options are mutually exclusive
const additionalProcessingOptions_1 = [
    { value: "C", label: "Cleanup Needed" },
    { value: "D", label: "New Data to Be Added" },
];

const additionalProcessingOptions_2 = [
    { value: "N", label: "N/A" }
];

// fields (form props) that are tied to selector components
const selectorFields = [
    "personnelOptions", "loadSheetOwner", "decisionMaker",
    "contributors", "conversionType", "additionalProcessing",
];

/**
 * This card houses all of the fields required to submit a pret-conversion checklist.
 * @returns said card.
 */
function CreateOrModifyPreConversionChecklistCard({
    nonSelectorFormProps, // object containing form props NOT tied to selector components
    setSelectorFormProps, // function to handle setting form props tied to selector components
    checkIfRequiredFieldsArePopulated, // function used to check whether or not all required fields are populated
    isModificationCard, // whether or not the card is being used to update a checklist
    existingLoadSheetName,
    invalidLoadSheetNames, // array containing load sheet names that can't be used (i.e. already exist in the database)
    existingPersonnelOptions,
    invalidPersonnel, // array containing invalid load sheet owners/decision makers (i.e. contributors for this checklist)
    existingLoadSheetOwner,
    existingDecisionMaker,
    existingContributors,
    invalidContributors, // array containing invalid contributors (i.e. the load sheet owner/decision maker for this checklist)
    existingConversionType,
    existingAdditionalProcessing,
    existingDataSources,
    existingUniqueRecordsPreCleanup,
    existingUniqueRecordsPostCleanup,
    existingRecordsPreCleanupNotes,
    existingRecordsPostCleanupNotes,
    existingPreConversionManipulation,
    isCheckboxDisabled, // whether or not the review form checkbox is disabled
    isSubmitOrUpdateButtonDisabled, // whether or not the submit (or update) button is disabled
    isCancelButtonDisabled, // whether or not the cancel button is disabled
    submitOrUpdateChecklist, // function to handle checklist submission/updating
    displayFadingBalls, // whether or not fading balls are displayed (to indicate that the page is writing checklist information)
}) {
    const expanded = true;
    const [formUpdated, setFormUpdated] = React.useState(false);
    const forceUpdateButtonDisabled = React.useRef(true);

    // React.useEffect(() => {
    //     console.log(isCheckboxDisabled);
    // }, [isCheckboxDisabled]);

    /**
     * Handles changes to a card field (form prop). The corresponding field (form prop) in the page housing this card is updated with the value entered. Note that the method by which props are updated is different for those tied to selector components and those that aren't. forceUpdateButtonDisabled is a prop used to ensure that the update button is disabled until an update has been made to the form by the user.
     * @param {object} returnedObject - the object containing the field to be updated and the value to which that field should be updated.
     */
    const handleOnChange = (returnedObject) => {
        // props tied to selector components (using a useState hook in the page containing this card)
        if (selectorFields.includes(returnedObject.field)) {
            setSelectorFormProps(
                prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
            );
        } else {
            // props NOT tied to selector components (using a useRef hook in page containing this card)
            let copyOfFormProps = nonSelectorFormProps;
            copyOfFormProps[returnedObject.field] = returnedObject.value;
            nonSelectorFormProps = copyOfFormProps;
        }
        checkIfRequiredFieldsArePopulated();
        setFormUpdated(true);
        // timeout needed to avoid a tiny blip in button functionality
        setTimeout(() => {
            if (forceUpdateButtonDisabled.current) {
                forceUpdateButtonDisabled.current = false;
            }
        }, 10);
    }

    /**
     * Handles changes to a form checkbox/radio button. The corresponding field (form prop) in the page housing this card is updated with the check state (i.e. checked/unchecked, or true/false).
     * @param {boolean} checkState - true or false, depending on the state of the checkbox/radio button.
     */
    const handleOnCheckOrDecheck = (checkState) => {
        // console.log(checkState);
        setFormUpdated(false);
        let copyOfFormProps = nonSelectorFormProps;
        copyOfFormProps["isFormReviewed"] = checkState;
        nonSelectorFormProps = copyOfFormProps;
        checkIfRequiredFieldsArePopulated();
    }

    return (
        <div>
            <Card
                sx={{
                    maxHeight: "calc(100vh - 328.52px)",
                    overflowY: "scroll",
                    borderRadius: "10px",
                    boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                    transition: "0.5s",
                    backgroundColor: "var(--lunikoMidGrey)",
                    marginBottom: "20px"
                }}>
                <div className="card-content">
                    <CardHeader
                        titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif" }}
                        title={<strong>Pre-Conversion Checklist</strong>}
                    />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <MaterialTextField
                                label="Load Sheet Name"
                                disabled={isModificationCard}
                                characterLimit={45}
                                placeholder="Load Sheet Name"
                                defaultValue={existingLoadSheetName}
                                inputValue={handleOnChange}
                                required={true}
                                showCharCounter={true}
                                requiresTextValidation={true}
                                isTextValidationCaseSensitive={false}
                                invalidInputs={invalidLoadSheetNames}
                                invalidInputMsg="Load sheet name already exists"
                                field="loadSheetName">
                            </MaterialTextField>
                            <MaterialSingleSelectFreeSoloForNames
                                className="add-personnel-dialog" //TODO: are class names needed?
                                label="Load Sheet Owner"
                                placeholder="Who is this load sheet's owner?"
                                singleSelectOptions={existingPersonnelOptions.filter(obj => obj.value !== existingLoadSheetOwner.value)}
                                invalidOptions={invalidPersonnel}
                                selectedValue={handleOnChange}
                                required={true}
                                defaultValue={existingLoadSheetOwner}
                                field="loadSheetOwner">
                            </MaterialSingleSelectFreeSoloForNames>
                            <MaterialSingleSelectFreeSoloForNames
                                className="add-personnel-dialog"
                                label="Decision Maker"
                                placeholder="Who is the decision maker?"
                                singleSelectOptions={existingPersonnelOptions.filter(element => element.value !== existingDecisionMaker.value)}
                                invalidOptions={invalidPersonnel}
                                selectedValue={handleOnChange}
                                required={true}
                                defaultValue={existingDecisionMaker}
                                field="decisionMaker">
                            </MaterialSingleSelectFreeSoloForNames>
                            <MaterialMultiSelectFreeSoloForNames
                                className="add-contributors-dialog"
                                label="Add Other Contributors"
                                placeholder="Who else was involved?"
                                defaultValue={existingContributors}
                                multiSelectOptions={existingPersonnelOptions}
                                selectedValues={handleOnChange}
                                invalidOptions={invalidContributors}
                                required={false}
                                field="contributors">
                            </MaterialMultiSelectFreeSoloForNames>
                            <MaterialSingleSelect
                                label="Conversion Type"
                                placeholder="Conversion Type"
                                defaultValue={existingConversionType}
                                singleSelectOptions={conversionTypeOptions}
                                selectedValue={handleOnChange}
                                required={true}
                                field="conversionType">
                            </MaterialSingleSelect>
                            <MaterialMultiSelect
                                label="Additional Processing"
                                placeholder="Additional Processing"
                                defaultValue={existingAdditionalProcessing}
                                multiSelectOptions={additionalProcessingOptions_1.concat(additionalProcessingOptions_2)}
                                selectedValues={handleOnChange}
                                invalidOptions={
                                    existingAdditionalProcessing?.map(({ value }) => value).length
                                        ? existingAdditionalProcessing?.map(({ value }) => value).includes("N") ? additionalProcessingOptions_1
                                            : additionalProcessingOptions_2
                                        : []
                                }
                                required={true}
                                id="additional-processing"
                                field="additionalProcessing">
                            </MaterialMultiSelect>
                            <MaterialTextField
                                className="data-sources"
                                label="Data Sources"
                                characterLimit={1000}
                                placeholder="What are the sources of data?"
                                inputValue={handleOnChange}
                                multiline={true}
                                required={true}
                                showCharCounter={true}
                                defaultValue={existingDataSources}
                                field="dataSources">
                            </MaterialTextField>
                            <MaterialTextField
                                label="Unique Records Pre-Cleanup"
                                placeholder="Approximate number of unique records pre-cleanup"
                                inputValue={handleOnChange}
                                required={true}
                                type="number"
                                negativeNumbersAllowed={false}
                                zerosAllowed={false}
                                fractionsAllowed={false}
                                defaultValue={existingUniqueRecordsPreCleanup}
                                field="uniqueRecordsPreCleanup">
                            </MaterialTextField>
                            <MaterialTextField
                                label="Unique Records Post-Cleanup"
                                placeholder="Enter the approximate number of unique records post-cleanup."
                                inputValue={handleOnChange}
                                required={true}
                                type="number"
                                negativeNumbersAllowed={false}
                                zerosAllowed={false}
                                fractionsAllowed={false}
                                defaultValue={existingUniqueRecordsPostCleanup}
                                field="uniqueRecordsPostCleanup">
                            </MaterialTextField>
                            <MaterialTextField
                                className="pre-cleanup-notes"
                                label="Pre-Cleanup Notes"
                                characterLimit={1000}
                                placeholder="Is there anything worth noting about the pre-cleanup state of the data?"
                                inputValue={handleOnChange}
                                multiline={true}
                                type="text"
                                showCharCounter={true}
                                defaultValue={existingRecordsPreCleanupNotes}
                                field="recordsPreCleanupNotes">
                            </MaterialTextField>
                            <MaterialTextField
                                className="post-cleanup-notes"
                                label="Post-Cleanup Notes"
                                placeholder="Is there anything worth noting about the post-cleanup state of the data?"
                                inputValue={handleOnChange}
                                multiline={true}
                                type="text"
                                showCharCounter={true}
                                defaultValue={existingRecordsPostCleanupNotes}
                                field="recordsPostCleanupNotes">
                            </MaterialTextField>
                            <MaterialTextField
                                className="pre-conversion-manipulation"
                                label="Pre-Conversion Manipulation"
                                characterLimit={1000}
                                placeholder="Describe your pre-conversion processing methodology. How was the addition of new data/processing carried out?"
                                inputValue={handleOnChange}
                                multiline={true}
                                type="text"
                                showCharCounter={true}
                                defaultValue={existingPreConversionManipulation}
                                field="preConversionManipulation">
                            </MaterialTextField>
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            <MaterialCheckBox
                label="Reviewed by Load Sheet Owner and Decision Maker"
                isForcedOff={formUpdated}
                userChecked={handleOnCheckOrDecheck}
                defaultChecked={isModificationCard ? true : false}
                isDisabled={isCheckboxDisabled}>
            </MaterialCheckBox>
            <SubmitButton
                className={"submit-or-update-checklist-button"}
                submitButtonText={isModificationCard ? "Update" : "Submit"}
                displayFadingBalls={displayFadingBalls}
                handleOnClick={true}
                handleOnClickFunction={submitOrUpdateChecklist}
                isSubmitButtonDisabled={isSubmitOrUpdateButtonDisabled || (isModificationCard && forceUpdateButtonDisabled.current)}>
            </SubmitButton>
            <Link to={`/`}>
                <button
                    className="cancel-button"
                    disabled={isCancelButtonDisabled}>
                    Cancel
                </button>
            </Link>
        </div>
    );
}

CreateOrModifyPreConversionChecklistCard.propTypes = {
    nonSelectorFormProps: PropTypes.object,
    setSelectorFormProps: PropTypes.func,
    checkIfRequiredFieldsArePopulated: PropTypes.func,
    isModificationCard: PropTypes.bool,
    existingLoadSheetName: PropTypes.string,
    invalidLoadSheetNames: PropTypes.array,
    existingPersonnelOptions: PropTypes.array,
    invalidPersonnel: PropTypes.array,
    existingLoadSheetOwner: PropTypes.object,
    existingDecisionMaker: PropTypes.object,
    existingContributors: PropTypes.array,
    invalidContributors: PropTypes.array,
    existingConversionType: PropTypes.object,
    existingAdditionalProcessing: PropTypes.array,
    existingDataSources: PropTypes.string,
    existingUniqueRecordsPreCleanup: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    existingUniqueRecordsPostCleanup: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    existingRecordsPreCleanupNotes: PropTypes.string,
    existingRecordsPostCleanupNotes: PropTypes.string,
    existingPreConversionManipulation: PropTypes.string,
    isCheckboxDisabled: PropTypes.bool,
    isSubmitOrUpdateButtonDisabled: PropTypes.bool,
    isCancelButtonDisabled: PropTypes.bool,
    submitOrUpdateChecklist: PropTypes.func,
    displayFadingBalls: PropTypes.bool,
}

CreateOrModifyPreConversionChecklistCard.defaultProps = {
    nonSelectorFormProps: {},
    setSelectorFormProps: () => { },
    checkIfRequiredFieldsArePopulated: () => { },
    isModificationCard: false,
    existingLoadSheetName: "",
    invalidLoadSheetNames: [],
    existingPersonnelOptions: [],
    invalidPersonnel: [],
    existingLoadSheetOwner: {},
    existingDecisionMaker: {},
    existingContributors: [],
    invalidContributors: [],
    existingConversionType: {},
    existingAdditionalProcessing: [],
    existingDataSources: "",
    existingUniqueRecordsPreCleanup: "",
    existingUniqueRecordsPostCleanup: "",
    existingRecordsPreCleanupNotes: "",
    existingRecordsPostCleanupNotes: "",
    existingPreConversionManipulation: "",
    isCheckboxDisabled: true,
    isSubmitOrUpdateButtonDisabled: true,
    isCancelButtonDisabled: false,
    submitOrUpdateChecklist: () => { },
    displayFadingBalls: false,
}


export default CreateOrModifyPreConversionChecklistCard;