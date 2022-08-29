// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';
// import Avatar from '@mui/material/Avatar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MaterialSingleSelect from './MaterialSingleSelect';
// import MaterialSingleSelectFreeSolo from './MaterialSingleSelectFreeSolo';
// import MaterialTextField from './MaterialTextField';
// import MaterialMultiSelect from './MaterialMultiSelect';
// import MaterialMultiSelectFreeSolo from './MaterialMultiSelectFreeSolo';
// import MaterialCheckBox from './MaterialCheckBox';
// import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

// const ExpandMore = styled((props) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//     }),
// }));

// export default function CreatePreConversionChecklistCard({
//     conversionTypeOptions = [],
//     additionalProcessingOptions = [],
//     loadSheetName = "",
//     personnelOptions = [],
//     contributorOptions = [],
//     loadSheetOwner = "",
//     decisionMaker = "",
//     invalidPersonnel = [],
//     contributors = [],
//     invalidContributors = [],
//     invalidLoadSheetNames = [],
//     // latestContributor = "",
//     conversionType = "",
//     additionalProcessing = [],
//     dataSources = "",
//     uniqueRecordsPreCleanup = 0,
//     uniqueRecordsPreCleanupLowerLimit = null,
//     uniqueRecordsPostCleanup = 0,
//     uniqueRecordsPostCleanupUpperLimit = null,
//     recordsPreCleanupNotes = "",
//     recordsPostCleanupNotes = "",
//     preConversionManipulation = "",
//     // postConversionLoadingErrors = "",
//     // postConversionValidationResults = "",
//     // postConversionChanges = "",
//     forceCheckboxOff = false,
//     checked = false,
//     valueUpdated = false,
//     submitted = false,
//     submitButtonDisabled = true,
//     displayFadingBalls = false
// }) {
//     const [expanded, setExpanded] = React.useState(true);
//     const [submitButtonColor, setSubmitButtonColor] = React.useState("#BFBFBF");

//     const handleOnChangeLoadSheetName = (updatedText) => {
//         loadSheetName(updatedText);
//         valueUpdated(true);
//     }

//     const handleOnSelectLoadSheetOwner = (valueFromSelector) => {
//         loadSheetOwner(valueFromSelector);
//         valueUpdated(true);
//     }

//     const handleOnSelectDecisionMaker = (valueFromSelector) => {
//         decisionMaker(valueFromSelector);
//         valueUpdated(true);
//     }

//     const handleOnSelectContributors = (valuesFromSelector) => {
//         contributors(valuesFromSelector);
//         valueUpdated(true);
//     }

//     const handleOnSelectConversionType = (valueFromSelector) => {
//         conversionType(valueFromSelector);
//         valueUpdated(true);
//     }

//     const handleOnSelectAdditionalProcessing = (valuesFromSelector) => {
//         additionalProcessing(valuesFromSelector);
//         valueUpdated(true);
//     }

//     const handleOnChangeDataSources = (updatedText) => {
//         dataSources(updatedText);
//         valueUpdated(true);
//     }

//     const handleOnChangeUniqueRecordsPreCleanup = (updatedValue) => {
//         uniqueRecordsPreCleanup(updatedValue);
//         valueUpdated(true);
//     }

//     const handleOnChangeUniqueRecordsPostCleanup = (updatedValue) => {
//         uniqueRecordsPostCleanup(updatedValue);
//         valueUpdated(true);
//     }

//     const handleOnChangeRecordsPreCleanupNotes = (updatedText) => {
//         recordsPreCleanupNotes(updatedText);
//         valueUpdated(true);
//     }

//     const handleOnChangeRecordsPostCleanupNotes = (updatedText) => {
//         recordsPostCleanupNotes(updatedText);
//         valueUpdated(true);
//     }

//     const handleOnChangePreConversionManipulation = (updatedText) => {
//         preConversionManipulation(updatedText);
//         valueUpdated(true);
//     }

//     // const handleOnChangePostConversionLoadingErrors = (updatedText) => {
//     //     postConversionLoadingErrors(updatedText);
//     // }

//     // const handleOnChangePostConversionValidationResults = (updatedText) => {
//     //     postConversionValidationResults(updatedText);
//     // }

//     // const handleOnChangePostConversionChanges = (updatedText) => {
//     //     postConversionChanges(updatedText);
//     // }

//     const handleOnChangeCheck = (checkedFromCheckbox) => {
//         checked(checkedFromCheckbox);
//     }

//     const handleSubmitChecklist = () => {
//         submitted(true);
//     }

//     React.useEffect(() => {
//         if (!submitButtonDisabled) {
//             setSubmitButtonColor("var(--lunikoBlue)");
//         } else {
//             setSubmitButtonColor("#BFBFBF");
//         }
//     }, [submitButtonDisabled]);

//     return (
//         <Card
//             sx={{
//                 // minWidth: 1,
//                 // maxWidth: 1,
//                 maxHeight: "calc(100vh - 166.52px)",
//                 overflowY: "scroll",
//                 borderRadius: "10px",
//                 boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
//                 transition: "0.5s",
//                 backgroundColor: "var(--lunikoOrange)",
//                 marginBottom: "20px"
//             }}>
//             <div className="card-content">
//                 <CardHeader
//                     titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
//                     // subheaderTypographyProps={{ color: "rgba(0, 0, 0, 0.7)", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
//                     // avatar={
//                     //     <Avatar sx={{
//                     //         bgcolor: "var(--lunikoBlue)"
//                     //     }}
//                     //         aria-label="status">
//                     //         {statusAbbreviation}
//                     //     </Avatar>
//                     // }
//                     title={<strong>Pre-Conversion Checklist</strong>}
//                 />
//                 {/* < CardActions
//                 disableSpacing
//                 style={{ justifyContent: "center", height: "40px", padding: 0, paddingBottom: "10px" }}>
//                 <ExpandMore
//                     expand={expanded}
//                     onClick={handleExpandClick}
//                     aria-expanded={expanded}
//                     aria-label="show more"
//                     style={{ marginLeft: 0 }}
//                 >
//                     <ExpandMoreIcon />
//                 </ExpandMore>
//             </CardActions > */}
//                 <Collapse in={expanded} timeout="auto" unmountOnExit>
//                     <CardContent>
//                         {/* <Typography
//                         paragraph>
//                         <strong>Updatable Fields</strong>
//                     </Typography> */}
//                         <MaterialTextField
//                             label="Load Sheet Name"
//                             characterLimit={45}
//                             placeholder="Load Sheet Name"
//                             inputValue={handleOnChangeLoadSheetName}
//                             multiline={false}
//                             required={true}
//                             showCharCounter={true}
//                             requiresValidation={true}
//                             invalidInputs={invalidLoadSheetNames}
//                             invalidInputMsg="Load sheet name already exists" >
//                         </MaterialTextField>
//                         <MaterialSingleSelectFreeSolo
//                             className="add-personnel-dialog"
//                             label="Load Sheet Owner"
//                             placeholder="Who is this load sheet's owner?"
//                             singleSelectOptions={personnelOptions}
//                             invalidOptions={invalidPersonnel}
//                             selectedValue={handleOnSelectLoadSheetOwner}
//                             required={true}>
//                         </MaterialSingleSelectFreeSolo>
//                         <MaterialSingleSelectFreeSolo
//                             className="add-personnel-dialog"
//                             label="Decision Maker"
//                             placeholder="Who is the decision maker?"
//                             singleSelectOptions={personnelOptions}
//                             invalidOptions={invalidPersonnel}
//                             selectedValue={handleOnSelectDecisionMaker}
//                             required={true}>
//                         </MaterialSingleSelectFreeSolo>
//                         {/* <MaterialMultiSelect
//                             label="Other Contributors"
//                             placeholder="Who else was involved?"
//                             singleSelectOptions={personnelOptions}
//                             selectedValues={handleOnSelectContributors}
//                             required={false}>
//                         </MaterialMultiSelect> */}
//                         <MaterialMultiSelectFreeSolo
//                             className="add-contributors-dialog"
//                             label="Other Contributors"
//                             placeholder="Who else was involved?"
//                             multiSelectOptions={personnelOptions}
//                             selectedValues={handleOnSelectContributors}
//                             invalidOptions={invalidContributors}
//                             required={false}>
//                         </MaterialMultiSelectFreeSolo>
//                         <MaterialSingleSelect
//                             label="Conversion Type"
//                             placeholder="Conversion Type"
//                             singleSelectOptions={conversionTypeOptions}
//                             selectedValue={handleOnSelectConversionType}
//                             required={true}>
//                         </MaterialSingleSelect>
//                         <MaterialMultiSelect
//                             label="Additional Processing"
//                             placeholder="Additional Processing"
//                             multiSelectOptions={additionalProcessingOptions}
//                             selectedValues={handleOnSelectAdditionalProcessing}
//                             required={true}
//                             id="additional-processing"
//                         >
//                         </MaterialMultiSelect>
//                         <MaterialTextField
//                             className="data-sources"
//                             label="Data Sources"
//                             characterLimit={1000}
//                             placeholder="What are the sources of data?"
//                             inputValue={handleOnChangeDataSources}
//                             multiline={true}
//                             required={true}
//                             showCharCounter={true}>
//                         </MaterialTextField>
//                         <MaterialTextField
//                             label="Unique Records Pre-Cleanup"
//                             // characterLimit={10}
//                             placeholder="Approximate number of unique records pre-cleanup"
//                             inputValue={handleOnChangeUniqueRecordsPreCleanup}
//                             multiline={false}
//                             required={true}
//                             type="number"
//                             negativeNumbersAllowed={false}
//                             zerosAllowed={false}
//                             fractionsAllowed={false}>
//                         </MaterialTextField>
//                         <MaterialTextField
//                             label="Unique Records Post-Cleanup"
//                             // characterLimit={10}
//                             placeholder="Enter the approximate number of unique records post-cleanup."
//                             inputValue={handleOnChangeUniqueRecordsPostCleanup}
//                             multiline={false}
//                             required={true}
//                             type="number"
//                             negativeNumbersAllowed={false}
//                             zerosAllowed={false}
//                             fractionsAllowed={false}>
//                         </MaterialTextField>
//                         <MaterialTextField
//                             className="pre-cleanup-notes"
//                             label="Pre-Cleanup Notes"
//                             characterLimit={1000}
//                             placeholder="Is there anything worth noting about the pre-cleanup state of the data?"
//                             inputValue={handleOnChangeRecordsPreCleanupNotes}
//                             multiline={true}
//                             required={false}
//                             type="text"
//                             showCharCounter={true}>
//                         </MaterialTextField>
//                         <MaterialTextField
//                             className="post-cleanup-notes"
//                             label="Post-Cleanup Notes"
//                             // characterLimit={10}
//                             placeholder="Is there anything worth noting about the post-cleanup state of the data?"
//                             inputValue={handleOnChangeRecordsPostCleanupNotes}
//                             multiline={true}
//                             required={false}
//                             type="text"
//                             showCharCounter={true}>
//                         </MaterialTextField>
//                         <MaterialTextField
//                             className="pre-conversion-manipulation"
//                             label="Pre-Conversion Manipulation"
//                             characterLimit={1000}
//                             placeholder="Describe your pre-conversion processing methodology. How was the addition of new data/processing carried out?"
//                             inputValue={handleOnChangePreConversionManipulation}
//                             multiline={true}
//                             required={false}
//                             type="text"
//                             showCharCounter={true}>
//                         </MaterialTextField>
//                         <MaterialCheckBox
//                             label="Reviewed by Load Sheet Owner and Decision Maker"
//                             forceOff={forceCheckboxOff}
//                             userChecked={handleOnChangeCheck}>
//                         </MaterialCheckBox>
//                         <button
//                             className="submit-checklist-button"
//                             onClick={handleSubmitChecklist}
//                             disabled={submitButtonDisabled}
//                             style={{ backgroundColor: submitButtonColor }}>
//                             {displayFadingBalls ?
//                                 <div className="fading-balls-container">
//                                     <FadingBalls
//                                         className="spinner"
//                                         color="white"
//                                         width="7px"
//                                         height="7px"
//                                         duration="0.5s"
//                                     />
//                                 </div> :
//                                 <p>Submit</p>}
//                         </button>
//                     </CardContent>
//                 </Collapse>
//             </div>
//         </Card >
//     );
// }