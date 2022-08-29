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
    setFormProps,
    requestChecklist,
    isSubmitButtonDisabled,
    displayFadingBalls,
}) {
    const expanded = true;
    const invalidTestScriptNameError = useValidationErrorUpdate();

    const handleOnChange = (returnedObject) => {
        invalidTestScriptNameError("");
        setFormProps(
            prev => ({ ...prev, [returnedObject.field]: returnedObject.value.trim().toLowerCase() })
        );
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
                        title={<strong>Please enter a valid {titleString}conversion load sheet name</strong>} />
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
    setFormProps: PropTypes.func,
    requestChecklist: PropTypes.func,
    isSubmitButtonDisabled: PropTypes.bool,
    displayFadingBalls: PropTypes.bool,
}

EnterLoadSheetNameCard.defaultProps = {
    titleString: "",
    setFormProps: () => { },
    requestChecklist: () => { },
    isSubmitButtonDisabled: true,
    displayFadingBalls: false,
}

export default EnterLoadSheetNameCard;
