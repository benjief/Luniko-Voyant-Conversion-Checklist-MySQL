import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MaterialSingleSelect from './MaterialSingleSelect';
import MaterialSingleSelectFreeSolo from './MaterialSingleSelectFreeSolo';
import MaterialTextField from './MaterialTextField';
import MaterialMultiSelect from './MaterialMultiSelect';
import MaterialSingleSelectWithValue from './MaterialSingleSelectWithValue';
import MaterialMultiSelectFreeSolo from './MaterialMultiSelectFreeSolo';
import MaterialCheckBox from './MaterialCheckBox';
// import BootstrapPopover from "../components/BootstrapPopover";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function ViewPreConversionChecklistCard({
    conversionTypeOptions = [],
    additionalProcessingOptions = [],
    loadSheetName = "",
    submittedLoadSheetName = "",
    personnelOptions = [],
    contributorOptions = [],
    loadSheetOwner = "",
    submittedLoadSheetOwner = "",
    decisionMaker = "",
    submittedDecisionMaker = "",
    invalidPersonnel = [],
    contributors = [],
    invalidContributors = [],
    // latestContributor = "",
    conversionType = "",
    submittedConversionType = "",
    additionalProcessing = "",
    submittedAdditionalProcessing = "",
    dataSources = "",
    submittedDataSources = "",
    uniqueRecordsPreCleanup = 0,
    submittedUniqueRecordsPreCleanup = 0,
    uniqueRecordsPreCleanupLowerLimit = null,
    uniqueRecordsPostCleanup = 0,
    submittedUniqueRecordsPostCleanup = 0,
    uniqueRecordsPostCleanupUpperLimit = null,
    recordsPreCleanupNotes = "",
    submittedRecordsPreCleanupNotes = "",
    recordsPostCleanupNotes = "",
    submittedRecordsPostCleanupNotes = "",
    preConversionManipulation = "",
    submittedPreConversionManipulation = "",
    // postConversionLoadingErrors = "",
    // postConversionValidationResults = "",
    // postConversionChanges = "",
    checked = true,
    valueUpdated = false,
    updated = false,
    updateButtonDisabled = true
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [updateButtonColor, setUpdateButtonColor] = React.useState("#BFBFBF");

    const handleOnChangeLoadSheetName = (updatedText) => {
        loadSheetName(updatedText);
        valueUpdated(true);
    }

    const handleOnSelectLoadSheetOwner = (valueFromSelector) => {
        loadSheetOwner(valueFromSelector);
        valueUpdated(true);
    }

    const handleOnSelectDecisionMaker = (valueFromSelector) => {
        decisionMaker(valueFromSelector);
        valueUpdated(true);
    }

    const handleOnSelectContributors = (valuesFromSelector) => {
        contributors(valuesFromSelector);
        valueUpdated(true);
    }

    const handleOnSelectConversionType = (valueFromSelector) => {
        conversionType(valueFromSelector);
        valueUpdated(true);
    }

    const handleOnSelectAdditionalProcessing = (valueFromSelector) => {
        additionalProcessing(valueFromSelector);
        valueUpdated(true);
    }

    const handleOnChangeDataSources = (updatedText) => {
        dataSources(updatedText);
        valueUpdated(true);
    }

    const handleOnChangeUniqueRecordsPreCleanup = (updatedValue) => {
        uniqueRecordsPreCleanup(updatedValue);
        valueUpdated(true);
    }

    const handleOnChangeUniqueRecordsPostCleanup = (updatedValue) => {
        uniqueRecordsPostCleanup(updatedValue);
        valueUpdated(true);
    }

    const handleOnChangeRecordsPreCleanupNotes = (updatedText) => {
        recordsPreCleanupNotes(updatedText);
        valueUpdated(true);
    }

    const handleOnChangeRecordsPostCleanupNotes = (updatedText) => {
        recordsPostCleanupNotes(updatedText);
        valueUpdated(true);
    }

    const handleOnChangePreConversionManipulation = (updatedText) => {
        preConversionManipulation(updatedText);
        valueUpdated(true);
    }

    // const handleOnChangePostConversionLoadingErrors = (updatedText) => {
    //     postConversionLoadingErrors(updatedText);
    // }

    // const handleOnChangePostConversionValidationResults = (updatedText) => {
    //     postConversionValidationResults(updatedText);
    // }

    // const handleOnChangePostConversionChanges = (updatedText) => {
    //     postConversionChanges(updatedText);
    // }

    const handleOnChangeCheck = (checkedFromCheckbox) => {
        checked(checkedFromCheckbox);
    }

    const handleUpdateChecklist = () => {
        updated(true);
    }

    React.useEffect(() => {
        if (!updateButtonDisabled) {
            setUpdateButtonColor("var(--lunikoBlue)");
        } else {
            setUpdateButtonColor("#BFBFBF");
        }
    }, [updateButtonDisabled]);

    return (
        <Card
            sx={{
                // minWidth: 1,
                // maxWidth: 1,
                maxHeight: "calc(100vh - 96.52px)",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoOrange)",
                marginBottom: "20px"
            }}>
            <div className="card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    // subheaderTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    // avatar={
                    //     <Avatar sx={{
                    //         bgcolor: "var(--lunikoBlue)"
                    //     }}
                    //         aria-label="status">
                    //         {statusAbbreviation}
                    //     </Avatar>
                    // }
                    title={<strong>Pre-Conversion Checklist</strong>}
                />
                {/* < CardActions
                disableSpacing
                style={{ justifyContent: "center", height: "40px", padding: 0, paddingBottom: "10px" }}>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    style={{ marginLeft: 0 }}
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions > */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        {/* <Typography
                        paragraph>
                        <strong>Updatable Fields</strong>
                    </Typography> */}
                        <MaterialTextField
                            label="Load Sheet Name"
                            characterLimit={45}
                            placeholder="Load Sheet Name"
                            inputValue={handleOnChangeLoadSheetName}
                            multiline={false}
                            required={true}
                            showCharCounter={true}
                            defaultValue={submittedLoadSheetName}
                            disabled={true}>
                        </MaterialTextField>
                        <MaterialSingleSelectFreeSolo
                            className="add-personnel-dialog"
                            label="Load Sheet Owner"
                            placeholder="Who is this load sheet's owner?"
                            singleSelectOptions={personnelOptions}
                            invalidOptions={invalidPersonnel}
                            selectedValue={handleOnSelectLoadSheetOwner}
                            required={true}
                            defaultValue={submittedLoadSheetOwner}>
                        </MaterialSingleSelectFreeSolo>
                        <MaterialSingleSelectFreeSolo
                            className="add-personnel-dialog"
                            label="Decision Maker"
                            placeholder="Who is the decision maker?"
                            singleSelectOptions={personnelOptions}
                            invalidOptions={invalidPersonnel}
                            selectedValue={handleOnSelectDecisionMaker}
                            required={true}
                            defaultValue={submittedDecisionMaker}>
                        </MaterialSingleSelectFreeSolo>
                        {/* <MaterialMultiSelect
                            label="Other Contributors"
                            placeholder="Who else was involved?"
                            singleSelectOptions={personnelOptions}
                            selectedValues={handleOnSelectContributors}
                            required={false}>
                        </MaterialMultiSelect> */}
                        <MaterialMultiSelectFreeSolo
                            className="add-contributors-dialog"
                            label="Add Other Contributors"
                            placeholder="Who else was involved?"
                            multiSelectOptions={personnelOptions}
                            selectedValues={handleOnSelectContributors}
                            invalidOptions={invalidContributors}
                            required={false}>
                        </MaterialMultiSelectFreeSolo>
                        <MaterialSingleSelectWithValue
                            label="Conversion Type"
                            placeholder="Conversion Type"
                            singleSelectOptions={conversionTypeOptions}
                            selectedValue={handleOnSelectConversionType}
                            required={true}
                            defaultValue={submittedConversionType}>
                        </MaterialSingleSelectWithValue>
                        <MaterialSingleSelectWithValue
                            label="Additional Processing"
                            placeholder="Additional Processing"
                            singleSelectOptions={additionalProcessingOptions}
                            selectedValue={handleOnSelectAdditionalProcessing}
                            required={true}
                            id="additional-processing"
                            defaultValue={submittedAdditionalProcessing}>
                        </MaterialSingleSelectWithValue>
                        <MaterialTextField
                            className="data-sources"
                            label="Data Sources"
                            characterLimit={1000}
                            placeholder="What are the sources of data?"
                            inputValue={handleOnChangeDataSources}
                            multiline={true}
                            required={true}
                            showCharCounter={true}
                            defaultValue={submittedDataSources}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Unique Records Pre-Cleanup"
                            // characterLimit={10}
                            placeholder="Approximate number of unique records pre-cleanup"
                            inputValue={handleOnChangeUniqueRecordsPreCleanup}
                            multiline={false}
                            required={true}
                            type="number"
                            limitRangeOfInputs={true}
                            lowerLimitValue={uniqueRecordsPreCleanupLowerLimit}
                            negativeNumbersAllowed={false}
                            defaultValue={submittedUniqueRecordsPreCleanup}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Unique Records Post-Cleanup"
                            // characterLimit={10}
                            placeholder="Enter the approximate number of unique records post-cleanup."
                            inputValue={handleOnChangeUniqueRecordsPostCleanup}
                            multiline={false}
                            required={true}
                            type="number"
                            limitRangeOfInputs={true}
                            upperLimitValue={uniqueRecordsPostCleanupUpperLimit}
                            negativeNumbersAllowed={false}
                            defaultValue={submittedUniqueRecordsPostCleanup}>
                        </MaterialTextField>
                        <MaterialTextField
                            className="pre-cleanup-notes"
                            label="Pre-Cleanup Notes"
                            characterLimit={1000}
                            placeholder="Is there anything worth noting about the pre-cleanup state of the data?"
                            inputValue={handleOnChangeRecordsPreCleanupNotes}
                            multiline={true}
                            required={false}
                            type="text"
                            showCharCounter={true}
                            defaultValue={submittedRecordsPreCleanupNotes}>
                        </MaterialTextField>
                        <MaterialTextField
                            className="post-cleanup-notes"
                            label="Post-Cleanup Notes"
                            // characterLimit={10}
                            placeholder="Is there anything worth noting about the post-cleanup state of the data?"
                            inputValue={handleOnChangeRecordsPostCleanupNotes}
                            multiline={true}
                            required={false}
                            type="text"
                            showCharCounter={true}
                            defaultValue={submittedRecordsPostCleanupNotes}>
                        </MaterialTextField>
                        <MaterialTextField
                            className="pre-conversion-manipulation"
                            label="Pre-Conversion Manipulation"
                            characterLimit={1000}
                            placeholder="Describe your pre-conversion processing methodology. How was the addition of new data/processing carried out?"
                            inputValue={handleOnChangePreConversionManipulation}
                            multiline={true}
                            required={false}
                            type="text"
                            showCharCounter={true}
                            defaultValue={submittedPreConversionManipulation}>
                        </MaterialTextField>
                        <MaterialCheckBox
                            label="Reviewed by Load Sheet Owner and Decision Maker"
                            checked={handleOnChangeCheck}
                            defaultChecked={true}>
                        </MaterialCheckBox>
                        <button
                            className="update-checklist-button"
                            onClick={handleUpdateChecklist}
                            disabled={updateButtonDisabled}
                            style={{ backgroundColor: updateButtonColor }}>
                            Update
                        </button>
                        {/* <div className="popover-container">
                            <BootstrapPopover
                                popoverText=
                                {[<strong>All identifiers </strong>, "added to this request will be ",
                                    "able to view it and receive updates pertaining to it."]}>
                            </BootstrapPopover>
                        </div> */}
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}