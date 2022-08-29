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

function CreateOrModifyPreConversionChecklistCard({
    setFormProps,
    isModificationCard,
    existingLoadSheetName,
    existingPostConversionLoadingErrors,
    existingPostConversionValidationResults,
    existingPostConversionChanges,
    isReviewCheckboxDisabled,
    isApproveCheckboxDisabled,
    isSubmitOrUpdateButtonDisabled,
    isCancelButtonDisabled,
    submitOrUpdateChecklist,
    displayFadingBalls,
}) {
    const expanded = true;
    const formUpdated = React.useRef(false);
    const [isCheckboxUnlocked, setIsCheckboxUnlocked] = React.useState(false);

    const handleOnChange = (returnedObject) => {
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value })
        );
        formUpdated.current = true;
    }

    const handleOnCheckOrDecheck = React.useCallback((property, checkState) => {
        formUpdated.current = false;
        setFormProps(
            prev => ({ ...prev, [property]: checkState })
        );
    }, [setFormProps]);

    return (
        <div>
            <Card
                sx={{
                    maxHeight: "calc(100vh - 360.52px)",
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
                forceOff={formUpdated.current}
                userChecked={(checkState) => handleOnCheckOrDecheck("formReviewed", checkState)}
                defaultChecked={isModificationCard ? true : false}
                disabled={isReviewCheckboxDisabled}>
            </MaterialCheckBox>
            <div className="form-approval-container">
                {isCheckboxUnlocked
                    ? <div className="valid-credential-supplied-approval-container">
                        <MaterialCheckBox
                            userChecked={(checkState) => handleOnCheckOrDecheck("formApproved", checkState)}>
                        </MaterialCheckBox>
                    </div>
                    : <div className="no-valid-credential-supplied-approval-container">
                        <MaterialPasswordDialog
                            content="Please enter your IT Director password."
                            label="password"
                            password="test"
                            isUnlocked={setIsCheckboxUnlocked}
                            isDisabled={isApproveCheckboxDisabled}>
                        </MaterialPasswordDialog>
                    </div>
                }
                <p style={{ color: isApproveCheckboxDisabled ? "rgba(0, 0, 0, 0.38)" : "rgba(0, 0, 0, 0.87)" }}>Approved by IT Director</p>
            </div>
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
    existingPostConversionLoadingErrors: PropTypes.string,
    existingPostConversionValidationResults: PropTypes.string,
    existingPostConversionChanges: PropTypes.string,
    isReviewCheckboxDisabled: PropTypes.bool,
    isApproveCheckboxDisabled: PropTypes.bool,
    isSubmitOrUpdateButtonDisabled: PropTypes.bool,
    isCancelButtonDisabled: PropTypes.bool,
    submitOrUpdateChecklist: PropTypes.func,
    displayFadingBalls: PropTypes.bool,
}

CreateOrModifyPreConversionChecklistCard.defaultProps = {
    setFormProps: () => { },
    isModificationCard: false,
    existingLoadSheetName: "",
    existingPostConversionLoadingErrors: "",
    existingPostConversionValidationResults: "",
    existingPostConversionChanges: "",
    isReviewCheckboxDisabled: true,
    isApproveCheckboxDisabled: true,
    isSubmitOrUpdateButtonDisabled: true,
    isCancelButtonDisabled: false,
    submitOrUpdateChecklist: () => { },
    displayFadingBalls: false,
}


export default CreateOrModifyPreConversionChecklistCard;