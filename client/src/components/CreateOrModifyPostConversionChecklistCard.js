import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialTextField from './MaterialTextField';
import MaterialCheckBox from './MaterialCheckBox';
import MaterialDialog from './MaterialDialog';
import MaterialPasswordDialog from './MaterialPasswordDialog';
import SubmitButton from './SubmitButton';

/**
 * Card that houses all of the fields required to submit a post-conversion checklist.
 * @returns said card.
 */
function CreateOrModifyPostConversionChecklistCard({
    setFormProps, // function to handle setting form props
    isModificationCard, // whether or not the card is being used to update a checklist
    existingLoadSheetName,
    existingPostConversionLoadingErrors,
    existingPostConversionValidationResults,
    existingPostConversionChanges,
    isReviewCheckboxDisabled, // whether or not the review form checkbox is disabled
    isApproveCheckboxDisabled, // whether or not the approve form checkbox is disabled
    isFormApproved, // whether or not the form is approved
    isSubmitOrUpdateButtonDisabled, // whether or not the submit (or update) button is disabled
    isCancelButtonDisabled, // whether or not the cancel button is disabled
    submitOrUpdateChecklist, // function to handle checklist submission/updating
    displayFadingBalls, // whether or not fading balls are displayed (to indicate that the page is writing checklist information)
}) {
    const expanded = true;
    const formUpdated = React.useRef(false);
    const forceUpdateButtonDisabled = React.useRef(true);
    const [isCheckboxUnlocked, setIsCheckboxUnlocked] = React.useState(false);

    // React.useEffect(() => {
    //     console.log(isSubmitOrUpdateButtonDisabled);
    // }, [isSubmitOrUpdateButtonDisabled])

    /**
     * Handles changes to a card field (form prop). The corresponding field (form prop) in the page housing this card is updated with the value entered. forceUpdateButtonDisabled is a prop used to ensure that the update button is disabled until an update has been made to the form by the user.
     * @param {object} returnedObject - the object containing the field to be updated and the value to which that field should be updated.
     */
    const handleOnChange = (returnedObject) => {
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
        formUpdated.current = true;
        // timeout needed to avoid a tiny blip in button functionality
        setTimeout(() => {
            if (forceUpdateButtonDisabled.current) {
                forceUpdateButtonDisabled.current = false;
            }
        }, 10);
    }

    /**
     * Handles changes to a form checkbox/radio button. The corresponding field (form prop) in the page housing this card is updated with the check state (i.e. checked/unchecked, or true/false). forceUpdateButtonDisabled is a prop used to ensure that the update button is disabled until an update has been made to the form by the user. This update should include having the form approved by an IT director.
     * @param {string} property - "isFormReviewed" or "isFormApproved" depending on which checkbox/radio button is clicked on.
     * @param {boolean} checkState - true or false, depending on the state of the checkbox/radio button.
     */
    const handleOnCheckOrDecheck = React.useCallback((property, checkState) => {
        formUpdated.current = false;
        if (property === "isFormApproved") {
            if (forceUpdateButtonDisabled.current) {
                forceUpdateButtonDisabled.current = false;
            }
        }
        setFormProps(
            prev => ({ ...prev, [property]: checkState })
        );
    }, [setFormProps]);

    return (
        <div>
            <Card
                sx={{
                    maxHeight: "calc(100vh - 363.52px)",
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
                                disabled={true}
                                characterLimit={45}
                                placeholder="Load Sheet Name"
                                defaultValue={existingLoadSheetName}
                                inputValue={handleOnChange}
                                required={true}
                                showCharCounter={true}
                                requiresTextValidation={true}
                                isTextValidationCaseSensitive={false}
                                invalidInputMsg="Load sheet name already exists"
                                field="loadSheetName">
                            </MaterialTextField>
                            <MaterialTextField
                                className="post-conversion-info"
                                label="Post-Conversion Loading Errors"
                                characterLimit={1000}
                                placeholder="Describe any errors that you encountered while loading the data."
                                inputValue={handleOnChange}
                                multiline={true}
                                required={true}
                                showCharCounter={true}
                                defaultValue={existingPostConversionLoadingErrors}
                                field="postConversionLoadingErrors">
                            </MaterialTextField>
                            <MaterialTextField
                                className="post-conversion-info"
                                label="Post-Conversion Validation Results"
                                characterLimit={1000}
                                placeholder="Describe any discrepancies you encountered while validating the data out of Epicor test. What was corrected?"
                                inputValue={handleOnChange}
                                multiline={true}
                                required={true}
                                showCharCounter={true}
                                defaultValue={existingPostConversionValidationResults}
                                field="postConversionValidationResults">
                            </MaterialTextField>
                            <MaterialTextField
                                className="post-conversion-info"
                                label="Post-Conversion Changes"
                                characterLimit={1000}
                                placeholder="Were there any additional changes made after initial approval? Include any delta management efforts."
                                inputValue={handleOnChange}
                                multiline={true}
                                required={true}
                                showCharCounter={true}
                                defaultValue={existingPostConversionChanges}
                                field="postConversionChanges">
                            </MaterialTextField>
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            <MaterialCheckBox
                label="Reviewed by Load Sheet Owner and Decision Maker"
                isForcedOff={formUpdated.current}
                userChecked={(checkState) => handleOnCheckOrDecheck("isFormReviewed", checkState)}
                defaultChecked={isModificationCard ? true : false}
                isDisabled={isReviewCheckboxDisabled}>
            </MaterialCheckBox>
            <div className="form-approval-container">
                {isCheckboxUnlocked
                    ? <div className="valid-credential-supplied-approval-container">
                        <MaterialCheckBox
                            userChecked={(checkState) => handleOnCheckOrDecheck("isFormApproved", checkState)}>
                        </MaterialCheckBox>
                    </div>
                    : <div className="no-valid-credential-supplied-approval-container">
                        <MaterialPasswordDialog
                            content="Please enter your IT Director password."
                            label="password"
                            password="test"
                            setIsCheckboxUnlocked={setIsCheckboxUnlocked}
                            isDisabled={isApproveCheckboxDisabled}>
                        </MaterialPasswordDialog>
                    </div>
                }
                <p style={{ color: isApproveCheckboxDisabled ? "rgba(0, 0, 0, 0.38)" : "rgba(0, 0, 0, 0.87)" }}>Approved by IT Director</p>
            </div>
            {/* Different warning messages are displayed to the user, depending on the state of the form when they click on submit or update. If the user is updating a post-conversion checklist without it being approved, no warning message is displayed. */}
            {isFormApproved || !isModificationCard
                ? <MaterialDialog
                    isDialogDisabled={isSubmitOrUpdateButtonDisabled || (isModificationCard && forceUpdateButtonDisabled.current)}
                    exteriorButton={
                        <SubmitButton
                            className={"submit-or-update-checklist-button"}
                            isSubmitButtonDisabled={isSubmitOrUpdateButtonDisabled || (isModificationCard && forceUpdateButtonDisabled.current)}
                            submitButtonText={isModificationCard ? "Update" : "Submit"}
                            displayFadingBalls={displayFadingBalls}>
                        </SubmitButton>
                    }
                    inactiveButtonText="Cancel"
                    displayActiveButton={true}
                    activeButtonFunction={submitOrUpdateChecklist}
                    activeButtonText={isModificationCard ? "Update" : "Submit"}
                    dialogDescription={isFormApproved
                        ? <div>
                            <p><u>Pre</u>-conversion checklists can <b>no longer be updated</b> once a post-conversion checklist is submitted. Additionally, <u>post</u>-conversion checklists approved by an IT director are <b>considered final</b> once submitted.</p>
                        </div>
                        : !isModificationCard
                            ? <div>
                                <p><u>Pre</u>-conversion checklists <b>can no longer be updated</b> once a post-conversion checklist is submitted.</p>
                            </div>
                            : null}>
                </MaterialDialog>
                : <SubmitButton
                    className={"submit-or-update-checklist-button"}
                    submitButtonText={"Update"}
                    displayFadingBalls={displayFadingBalls}
                    handleOnClick={true}
                    handleOnClickFunction={submitOrUpdateChecklist}
                    isSubmitButtonDisabled={isSubmitOrUpdateButtonDisabled || forceUpdateButtonDisabled.current}>
                </SubmitButton>}
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

CreateOrModifyPostConversionChecklistCard.propTypes = {
    setFormProps: PropTypes.func,
    isModificationCard: PropTypes.bool,
    existingLoadSheetName: PropTypes.string,
    existingPostConversionLoadingErrors: PropTypes.string,
    existingPostConversionValidationResults: PropTypes.string,
    existingPostConversionChanges: PropTypes.string,
    isReviewCheckboxDisabled: PropTypes.bool,
    isApproveCheckboxDisabled: PropTypes.bool,
    isFormApproved: PropTypes.bool,
    isSubmitOrUpdateButtonDisabled: PropTypes.bool,
    isCancelButtonDisabled: PropTypes.bool,
    submitOrUpdateChecklist: PropTypes.func,
    displayFadingBalls: PropTypes.bool,
}

CreateOrModifyPostConversionChecklistCard.defaultProps = {
    setFormProps: () => { },
    isModificationCard: false,
    existingLoadSheetName: "",
    existingPostConversionLoadingErrors: "",
    existingPostConversionValidationResults: "",
    existingPostConversionChanges: "",
    isReviewCheckboxDisabled: true,
    isApproveCheckboxDisabled: true,
    isFormApproved: false,
    isSubmitOrUpdateButtonDisabled: true,
    isCancelButtonDisabled: false,
    submitOrUpdateChecklist: () => { },
    displayFadingBalls: false,
}


export default CreateOrModifyPostConversionChecklistCard;