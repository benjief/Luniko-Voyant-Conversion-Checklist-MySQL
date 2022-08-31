import * as React from 'react';
import PropTypes from 'prop-types';
import { useValidationErrorUpdate } from '../pages/ConversionChecklistPages/Context/ValidationErrorContext';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import MaterialTextField from './MaterialTextField';
import SubmitButton from './SubmitButton';
function EnterLoadSheetNameCard({
    titleString,
    useSetFormProps,
    setFormProps,
    useRefHookFormProps,
    checkIfRequiredFieldsArePopulated,
    requestChecklist,
    isSubmitButtonDisabled,
    displayFadingBalls,
    isUserViewingConversionChecklist,
}) {
    const expanded = true;
    const invalidTestScriptNameError = useValidationErrorUpdate();

    const handleOnChange = (returnedObject) => {
        invalidTestScriptNameError("");
        if (setFormProps) {
            setFormProps(
                prev => ({ ...prev, [returnedObject.field]: returnedObject.value.trim().toLowerCase() })
            );
        }
        if (useRefHookFormProps) {
            let copyOfFormProps = useRefHookFormProps;
            copyOfFormProps[returnedObject.field] = returnedObject.value;
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
                                authenticationField={true}
                                field={"loadSheetName"}>
                            </MaterialTextField>
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            <SubmitButton
                className="submit-load-sheet-name-button"
                submitButtonText="Submit"
                isSubmitButtonDisabled={isSubmitButtonDisabled}
                displayFadingBalls={displayFadingBalls}
                handleOnClick={true}
                handleOnClickFunction={requestChecklist}>
            </SubmitButton>
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
    displayFadingBalls: PropTypes.bool,
    isUserViewingConversionChecklist: PropTypes.bool,
}

EnterLoadSheetNameCard.defaultProps = {
    titleString: "",
    useSetFormProps: true,
    setFormProps: () => { },
    useRefHookFormProps: {},
    checkIfRequiredFieldsArePopulated: () => { },
    requestChecklist: () => { },
    isSubmitButtonDisabled: true,
    displayFadingBalls: false,
    isUserViewingConversionChecklist: false,
}

export default EnterLoadSheetNameCard;
