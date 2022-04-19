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
import MaterialMultiSelectFreeSolo from './MaterialMultiSelectFreeSolo';
import MaterialCheckBox from './MaterialCheckBox';
import PasswordFormDialog from './PasswordFormDialog';
import DraggableDialog from './DraggableDialog';
import FadingBalls from "react-cssfx-loading/lib/FadingBalls";

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

export default function CreatePostConversionChecklistCard({
    postConversionLoadingErrors = "",
    postConversionValidationResults = "",
    postConversionChanges = "",
    forceReviewedOff = false,
    reviewed = false,
    approved = false,
    valueUpdated = false,
    submitted = false,
    submitButtonDisabled = true,
    displayFadingBalls = false
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [submitButtonColor, setSubmitButtonColor] = React.useState("#BFBFBF");
    const [approveUnlocked, setApproveUnlocked] = React.useState(false);

    const handleOnChangePostConversionLoadingErrors = (updatedText) => {
        postConversionLoadingErrors(updatedText);
        valueUpdated(true);
    }

    const handleOnChangePostConversionValidationResults = (updatedText) => {
        postConversionValidationResults(updatedText);
        valueUpdated(true);
    }

    const handleOnChangePostConversionChanges = (updatedText) => {
        postConversionChanges(updatedText);
        valueUpdated(true);
    }

    const handleOnChangeReviewed = (checkedFromCheckbox) => {
        reviewed(checkedFromCheckbox);
    }

    const handleUnlocked = (unlocked) => {
        setApproveUnlocked(unlocked);
    }

    const handleOnChangeApproved = (checkedFromCheckbox) => {
        approved(checkedFromCheckbox);
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
                // minWidth: 1,
                // maxWidth: 1,
                maxHeight: "calc(100vh - 166.52px)",
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
                    title={<strong>Post-Conversion Checklist</strong>}
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
                            className="post-conversion-info"
                            label="Post-Conversion Loading Errors"
                            characterLimit={1000}
                            placeholder="Describe any errors that you encountered while loading the data."
                            inputValue={handleOnChangePostConversionLoadingErrors}
                            multiline={true}
                            required={true}
                            type="text"
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            className="post-conversion-info"
                            label="Post-Conversion Validation Results"
                            characterLimit={1000}
                            placeholder="Describe any discrepancies you encountered while validating the data out of Epicor test. What was corrected?"
                            inputValue={handleOnChangePostConversionValidationResults}
                            multiline={true}
                            required={true}
                            type="text"
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialTextField
                            className="post-conversion-info"
                            label="Post-Conversion Changes"
                            characterLimit={1000}
                            placeholder="Were there any additional changes made after initial approval? Include any delta management efforts."
                            inputValue={handleOnChangePostConversionChanges}
                            multiline={true}
                            required={true}
                            type="text"
                            showCharCounter={true}>
                        </MaterialTextField>
                        <MaterialCheckBox
                            label="Reviewed by Load Sheet Owner and Decision Maker"
                            userChecked={handleOnChangeReviewed}
                            forceOff={forceReviewedOff}>
                        </MaterialCheckBox>
                        <div className="form-approval-container">
                            {approveUnlocked
                                ? <div className="valid-credential-approval-container">
                                    <MaterialCheckBox
                                        userChecked={handleOnChangeApproved}>
                                    </MaterialCheckBox>
                                </div>
                                : <div className="no-valid-credential-approval-container">
                                    <PasswordFormDialog
                                        content="Please enter your IT Director password."
                                        label="password"
                                        password="test"
                                        unlocked={handleUnlocked}>
                                    </PasswordFormDialog>
                                </div>
                            }
                            <p>Approved by IT Director</p>
                        </div>
                        <button
                            className="submit-checklist-button"
                            onClick={handleSubmitChecklist}
                            disabled={submitButtonDisabled}
                            style={{ backgroundColor: submitButtonColor }}>
                            {displayFadingBalls ?
                                <div className="fading-balls-container">
                                    <FadingBalls
                                        className="spinner"
                                        color="white"
                                        width="7px"
                                        height="7px"
                                        duration="0.5s"
                                    />
                                </div> :
                                <p>Submit</p>}
                        </button>
                        <DraggableDialog
                            dialogText={["Checklists ", <strong>can no longer be updated </strong>, "once approved by ",
                                "an IT Director."]}
                            buttonText="!"
                        ></DraggableDialog>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}