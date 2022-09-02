import * as React from 'react';
import PropTypes from 'prop-types';
import { useValidationErrorUpdate } from '../pages/ConversionChecklistPages/Context/ValidationErrorContext';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialTextField from './MaterialTextField';
import SubmitButton from './SubmitButton';
import MaterialDialog from './MaterialDialog';

/**
 * Card that allows users to retrieve checklist information from the database by entering a valid load sheet name. Note that the validity of a load sheet name is determined by the page that contains this card.
 * @returns said card.
 */
function EnterLoadSheetNameCard({
    titleString, // text that shows up at the top of the card
    useSetFormProps, // whether or not this component should use the setFormProps defined below to update props
    setFormProps, // function to handle setting form props
    useRefHookFormProps, // object containing form props that are defined using a useRef hook on the page containing this component 
    checkIfRequiredFieldsArePopulated, // function used to check whether or not all required fields are populated
    requestChecklist, // function to handle the user requesting a checklist
    isSubmitButtonDisabled, // whether or not the submit button is disabled
    isUserViewingConversionChecklist, // whether or not the user is simply viewing a checklist (vs. creating or updating one)
    isDeletionForm, // whether or not this card is being used in a test script deletion form
    displayFadingBalls, // whether or not fading balls are displayed (to indicate that the page is writing checklist information)
}) {
    const expanded = true;
    const invalidTestScriptNameError = useValidationErrorUpdate(); // context variable

    /**
     * Handles changes to a card field (form prop). The corresponding field (form prop) in the page housing this card is updated with the value entered. Note that because we're dealing with load sheet names here, we need to eliminate any white space from the user-entered string and make it lower case. This allows the string to be properly compared to load sheet names that already exist in the database on the page containing this card (i.e. all the strings being compared to are lower case and don't contain any outside white space).
     * @param {object} returnedObject - the object containing the field to be updated and the value to which that field should be updated.
     */
    const handleOnChange = (returnedObject) => {
        invalidTestScriptNameError(""); // context variable
        if (setFormProps) {
            setFormProps(
                prev => ({ ...prev, [returnedObject.field]: returnedObject.value.trim().toLowerCase() })
            );
        }
        if (useRefHookFormProps) {
            let copyOfFormProps = useRefHookFormProps;
            copyOfFormProps[returnedObject.field] = returnedObject.value.trim().toLowerCase();
            checkIfRequiredFieldsArePopulated();
        }
    }

    return (
        <div>
            <Card
                sx={{
                    minHeight: "150px",
                    overflowY: "scroll",
                    borderRadius: "10px",
                    boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                    transition: "0.5s",
                    backgroundColor: "var(--lunikoMidGrey)",
                    marginBottom: "20px"
                }}>

                <div className="load-sheet-name-card-content">
                    <CardHeader
                        titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", textAlign: "center" }}
                        title={isUserViewingConversionChecklist
                            ? <strong>Please enter a valid checklist name</strong>
                            : <strong>Please enter a valid {titleString}conversion load sheet name</strong>} />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <MaterialTextField
                                className="load-sheet-name"
                                label="Load Sheet Name"
                                inputValue={handleOnChange}
                                type="text"
                                isAuthenticationField={true}
                                field={"loadSheetName"}>
                            </MaterialTextField>
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            {/* This component uses a Material Dialog if it is being used in a deletion form. This is to warn users that deletion is irreversible. */}
            {isDeletionForm
                ? <MaterialDialog
                    className="material-dialog-delete"
                    isDialogDisabled={isSubmitButtonDisabled}
                    exteriorButton={
                        <SubmitButton
                            className={isDeletionForm ? "delete-conversion-checklist-button" : "submit-load-sheet-name-button"}
                            submitButtonText={isDeletionForm ? "Delete" : "Submit"}
                            isSubmitButtonDisabled={isSubmitButtonDisabled}
                            displayFadingBalls={displayFadingBalls}>
                        </SubmitButton>
                    }
                    inactiveButtonText="Cancel"
                    displayActiveButton={true}
                    activeButtonFunction={requestChecklist}
                    activeButtonText="Delete"
                    dialogDescription={<p>Are you sure you want to permanently delete this checklist? This action cannot be undone.</p>}>
                </MaterialDialog>
                : <SubmitButton
                    className="submit-load-sheet-name-button"
                    submitButtonText="Submit"
                    isSubmitButtonDisabled={isSubmitButtonDisabled}
                    displayFadingBalls={displayFadingBalls}
                    handleOnClick={true}
                    handleOnClickFunction={requestChecklist}>
                </SubmitButton>}
        </div>
    );
}

EnterLoadSheetNameCard.propTypes = {
    titleString: PropTypes.string,
    useSetFormProps: PropTypes.bool,
    setFormProps: PropTypes.func,
    useRefHookFormProps: PropTypes.object,
    checkIfRequiredFieldsArePopulated: PropTypes.func,
    requestChecklist: PropTypes.func,
    isSubmitButtonDisabled: PropTypes.bool,
    isUserViewingConversionChecklist: PropTypes.bool,
    isDeletionForm: PropTypes.bool,
    displayFadingBalls: PropTypes.bool,
}

EnterLoadSheetNameCard.defaultProps = {
    titleString: "",
    useSetFormProps: true,
    setFormProps: () => { },
    useRefHookFormProps: {},
    checkIfRequiredFieldsArePopulated: () => { },
    requestChecklist: () => { },
    isSubmitButtonDisabled: true,
    isUserViewingConversionChecklist: false,
    isDeletionForm: false,
    displayFadingBalls: false,
}

export default EnterLoadSheetNameCard;
