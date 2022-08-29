import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialSingleSelect from './MaterialSingleSelect';
import MaterialSingleSelectFreeSolo from './MaterialSingleSelectFreeSolo';
import MaterialTextField from './MaterialTextField';
import MaterialMultiSelect from './MaterialMultiSelect';
import MaterialMultiSelectFreeSolo from './MaterialMultiSelectFreeSolo';
import MaterialCheckBox from './MaterialCheckBox';
import SubmitButton from './SubmitButton';
// import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

const conversionTypeOptions = [
    { value: "M", label: "Manual" },
    { value: "D", label: "DMT" }
];

const additionalProcessingOptions = [
    { value: "C", label: "Cleanup Needed" },
    { value: "D", label: "New Data to Be Added" },
    { value: "N", label: "N/A" }
];

function CreateOrModifyPreConversionChecklistCard({
    setFormProps,
    isModificationCard,
    existingLoadSheetName,
    invalidLoadSheetNames,
    existingPersonnelOptions,
    invalidPersonnel,
    existingLoadSheetOwner,
    existingDecisionMaker,
    existingContributors,
    invalidContributors,
    existingConversionType,
    existingAdditionalProcessing,
    existingDataSources,
    existingUniqueRecordsPreCleanup,
    existingUniqueRecordsPostCleanup,
    existingRecordsPreCleanupNotes,
    existingRecordsPostCleanupNotes,
    existingPreConversionManipulation,
    isCheckboxDisabled,
    isSubmitOrUpdateButtonDisabled,
    isCancelButtonDisabled,
    submitOrUpdateChecklist,
    displayFadingBalls,
}) {
    const expanded = true;
    const formUpdated = React.useRef(false);

    const handleOnChange = (returnedObject) => {
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
        formUpdated.current = true;
    }

    const handleOnCheckOrDecheck = React.useCallback((checkState) => {
        formUpdated.current = false;
        setFormProps(
            prev => ({ ...prev, isFormReviewed: checkState })
        );
    }, [setFormProps]);

    return (
        <div>
            <Card
                sx={{
                    // minWidth: 1,
                    // maxWidth: 1,
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
                            <MaterialSingleSelectFreeSolo
                                className="add-personnel-dialog" //TODO: are class names needed?
                                label="Load Sheet Owner"
                                placeholder="Who is this load sheet's owner?"
                                singleSelectOptions={existingPersonnelOptions.filter(obj => obj.value !== existingLoadSheetOwner.value)}
                                invalidOptions={invalidPersonnel}
                                selectedValue={handleOnChange}
                                required={true}
                                defaultValue={existingLoadSheetOwner}
                                field="loadSheetOwner">
                            </MaterialSingleSelectFreeSolo>
                            <MaterialSingleSelectFreeSolo
                                className="add-personnel-dialog"
                                label="Decision Maker"
                                placeholder="Who is the decision maker?"
                                singleSelectOptions={existingPersonnelOptions.filter(element => element.value !== existingDecisionMaker.value)}
                                invalidOptions={invalidPersonnel}
                                selectedValue={handleOnChange}
                                required={true}
                                defaultValue={existingDecisionMaker}
                                field="decisionMaker">
                            </MaterialSingleSelectFreeSolo>
                            <MaterialMultiSelectFreeSolo
                                className="add-contributors-dialog"
                                label="Add Other Contributors"
                                placeholder="Who else was involved?"
                                defaultValue={existingContributors}
                                multiSelectOptions={existingPersonnelOptions}
                                selectedValues={handleOnChange}
                                invalidOptions={invalidContributors}
                                required={false}
                                field="contributors">
                            </MaterialMultiSelectFreeSolo>
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
                                multiSelectOptions={additionalProcessingOptions}
                                selectedValues={handleOnChange}
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
                forceOff={formUpdated.current}
                userChecked={handleOnCheckOrDecheck}
                defaultChecked={isModificationCard ? true : false}
                disabled={isCheckboxDisabled}>
            </MaterialCheckBox>
            <SubmitButton
                className={"submit-or-update-checklist-button"}
                submitButtonText={isModificationCard ? "Update" : "Submit"}
                displayFadingBalls={displayFadingBalls}
                handleOnClick={true}
                handleOnClickFunction={submitOrUpdateChecklist}
                isSubmitButtonDisabled={isSubmitOrUpdateButtonDisabled}>
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
    setFormProps: PropTypes.func,
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
    setFormProps: () => { },
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