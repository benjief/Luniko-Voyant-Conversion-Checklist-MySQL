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
import MaterialTextField from './MaterialTextField';
import MaterialMultiSelect from './MaterialMultiSelect';
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

export default function CreatePreConversionChecklistCard({
    conversionTypeOptions = [],
    additionalProcessingOptions = [],
    loadSheetName = "",
    personnelOptions = [],
    loadSheetOwner = "",
    decisionMaker = "",
    contributors = [],
    conversionType = "",
    additionalProcessing = "",
    dataSources = "",
    uniqueRecordsPreCleanup = 0,
    uniqueRecordsPostCleanup = 0,
    recordsPreCleanupNotes = "",
    recordsPostCleanupNotes = "",
    preConversionManipulation = "",
    postConversionLoadingErrors = "",
    postConversionValidationResults = "",
    postConversionChanges = "",
    submitted = false,
    submitButtonDisabled = true
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [submitButtonColor, setSubmitButtonColor] = React.useState("#BFBFBF");

    const handleOnChangeLoadSheetName = (updatedText) => {
        loadSheetName(updatedText);
    }

    const handleOnSelectLoadSheetOwner = (valueFromSelector) => {
        loadSheetOwner(valueFromSelector);
    }

    const handleOnSelectDecisionMaker = (valueFromSelector) => {
        decisionMaker(valueFromSelector);
    }

    const handleOnSelectContributors = (valuesFromSelector) => {
        contributors(valuesFromSelector);
    }

    const handleOnSelectConversionType = (valueFromSelector) => {
        conversionType(valueFromSelector);
    }

    const handleOnSelectAdditionalProcessing = (valueFromSelector) => {
        additionalProcessing(valueFromSelector);
    }

    const handleOnChangeDataSources = (updatedText) => {
        dataSources(updatedText);
    }

    const handleOnChangeUniqueRecordsPreCleanup = (updatedValue) => {
        uniqueRecordsPreCleanup(updatedValue);
    }

    const handleOnChangeUniqueRecordsPostCleanup = (updatedValue) => {
        uniqueRecordsPostCleanup(updatedValue);
    }

    const handleOnChangeRecordsPreCleanupNotes = (updatedText) => {
        recordsPreCleanupNotes(updatedText);
    }

    const handleOnChangeRecordsPostCleanupNotes = (updatedText) => {
        recordsPostCleanupNotes(updatedText);
    }

    const handleOnChangePreConversionManipulation = (updatedText) => {
        preConversionManipulation(updatedText);
    }

    const handleOnChangePostConversionLoadingErrors = (updatedText) => {
        postConversionLoadingErrors(updatedText);
    }

    const handleOnChangePostConversionValidationResults = (updatedText) => {
        postConversionValidationResults(updatedText);
    }

    const handleOnChangePostConversionChanges = (updatedText) => {
        postConversionChanges(updatedText);
    }

    const handleSubmitChecklist = () => {
        submitted(true);
    }

    React.useEffect(() => {
        if (!submitButtonDisabled) {
            setSubmitButtonColor("var(--lunikoBlue)");
        } else {
            setSubmitButtonColor("#BFBFBF");
        }
    }, [submitButtonDisabled]);

    return (
        <Card
            sx={{
                minWidth: 350,
                maxWidth: 350,
                maxHeight: 500,
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoOrange)",
                marginBottom: "20px"
            }}>
            <div className="card-content">
                <CardHeader
                    titleTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
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
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialSingleSelect
                            label="Load Sheet Owner"
                            placeholder="Who is this load sheet's owner?"
                            singleSelectOptions={personnelOptions}
                            selectedValue={handleOnSelectLoadSheetOwner}
                            required={true}>
                        </MaterialSingleSelect>
                        <MaterialSingleSelect
                            label="Decision Maker"
                            placeholder="Who is the decision maker for this load sheet?"
                            singleSelectOptions={personnelOptions}
                            selectedValue={handleOnSelectDecisionMaker}
                            required={true}>
                        </MaterialSingleSelect>
                        <MaterialMultiSelect
                            label="Other Contributors"
                            placeholder="Who else was involved throughout the process?"
                            singleSelectOptions={personnelOptions}
                            selectedValues={handleOnSelectContributors}
                            required={false}>
                        </MaterialMultiSelect>
                        <MaterialSingleSelect
                            label="Conversion Type"
                            placeholder="Conversion Type"
                            singleSelectOptions={conversionTypeOptions}
                            selectedValue={handleOnSelectConversionType}
                            required={true}>
                        </MaterialSingleSelect>
                        <MaterialSingleSelect
                            label="Additional Processing"
                            placeholder="Additional Processing"
                            singleSelectOptions={additionalProcessingOptions}
                            selectedValue={handleOnSelectAdditionalProcessing}
                            required={true}>
                        </MaterialSingleSelect>
                        <MaterialTextField
                            label="Data Sources"
                            characterLimit={1000}
                            placeholder="What are the sources of data?"
                            inputValue={handleOnChangeDataSources}
                            multiline={true}
                            required={true}
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Unique Records Pre-Cleanup"
                            // characterLimit={10}
                            placeholder="Approximate number of unique records pre-cleanup"
                            inputValue={handleOnChangeUniqueRecordsPreCleanup}
                            multiline={false}
                            required={true}
                            type="number">
                        </MaterialTextField>
                        <MaterialTextField
                            label="Unique Records Post-Cleanup"
                            // characterLimit={10}
                            placeholder="Approximate number of unique records post-cleanup"
                            inputValue={handleOnChangeUniqueRecordsPostCleanup}
                            multiline={false}
                            required={true}
                            type="number">
                        </MaterialTextField>
                        <MaterialTextField
                            label="Pre-Cleanup Notes"
                            characterLimit={1000}
                            placeholder="Anything worth noting about the pre-cleanup state of the data"
                            inputValue={handleOnChangeRecordsPreCleanupNotes}
                            multiline={true}
                            required={false}
                            type="text"
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Post-Cleanup Notes"
                            // characterLimit={10}
                            placeholder="Anything worth noting about the post-cleanup state of the data"
                            inputValue={handleOnChangeRecordsPostCleanupNotes}
                            multiline={true}
                            required={false}
                            type="text"
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Pre-conversion Manipulation"
                            characterLimit={1000}
                            placeholder="Describe pre-conversion processing methodology: how were addition of new data/processing carried out?"
                            inputValue={handleOnChangeRecordsPostCleanupNotes}
                            multiline={true}
                            required={false}
                            type="text"
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            label="Post"
                            characterLimit={1000}
                            placeholder="Describe pre-conversion processing methodology: how were addition of new data/processing carried out?"
                            inputValue={handleOnChangeRecordsPostCleanupNotes}
                            multiline={true}
                            required={false}
                            type="text"
                            showCharCounter={true}>
                        </MaterialTextField>
                        {/* <button
                            className="submit-request-button"
                            onClick={handleSubmitChecklist}
                            disabled={submitButtonDisabled}
                            style={{ backgroundColor: submitButtonColor }}>
                            Submit Request
                        </button> */}
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