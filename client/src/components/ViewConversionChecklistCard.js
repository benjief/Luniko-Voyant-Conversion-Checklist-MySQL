import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function ViewConversionChecklistCard({
    loadSheetName,
    loadSheetOwner,
    decisionMaker,
    contributors,
    conversionType,
    additionalProcessing,
    dataSources,
    uniqueRecordsPreCleanup,
    uniqueRecordsPostCleanup,
    recordsPreCleanupNotes,
    recordsPostCleanupNotes,
    preConversionManipulation,
    postConversionLoadingErrors,
    postConversionValidationResults,
    postConversionChanges,
    isFormApproved,
}) {
    const expanded = true;

    return (
        <div>
            <Card
                sx={{
                    maxHeight: "calc(100vh - 216.52px)",
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
                        title={isFormApproved
                            ? <strong>Completed Checklist</strong>
                            : postConversionLoadingErrors
                                ? <strong>Post-Conversion Checklist</strong>
                                : <strong>Pre-Conversion Checklist</strong>} />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>
                                <strong>Load Sheet Name<br /></strong> {loadSheetName}
                            </Typography>
                            <Typography paragraph>
                                <strong>Load Sheet Owner<br /></strong> {loadSheetOwner.label}
                            </Typography>
                            <Typography paragraph>
                                <strong>Decision Maker<br /></strong> {decisionMaker.label}
                            </Typography>
                            <Typography paragraph>
                                <strong>Contributors<br /></strong>
                                {contributors.map((val, key) => {
                                    return <li
                                        key={key}
                                        style={{ listStyle: "none" }}>
                                        {val.label}
                                    </li>
                                })}
                            </Typography>
                            <Typography paragraph>
                                <strong>Conversion Type<br /></strong> {conversionType.label}
                            </Typography>
                            <Typography paragraph>
                                <strong>Additional Processing<br /></strong>
                                {additionalProcessing.map((val, key) => {
                                    return <li
                                        key={key}
                                        style={{ listStyle: "none" }}>
                                        {val.label}
                                    </li>
                                })}
                            </Typography>
                            <Typography paragraph className="view-data-sources">
                                <strong>Data Sources<br /></strong>{dataSources}
                            </Typography>
                            <Typography paragraph>
                                <strong>Unique Records Pre-Cleanup<br /></strong>{uniqueRecordsPreCleanup}
                            </Typography>
                            <Typography paragraph>
                                <strong>Unique Records Post-Cleanup<br /></strong>{uniqueRecordsPostCleanup}
                            </Typography>
                            <Typography paragraph className="view-pre-cleanup-notes">
                                <strong>Pre-Cleanup Notes<br /></strong>{recordsPreCleanupNotes ? recordsPreCleanupNotes : "None"}
                            </Typography>
                            <Typography paragraph className="view-post-cleanup-notes">
                                <strong>Post-Cleanup Notes<br /></strong>{recordsPostCleanupNotes ? recordsPostCleanupNotes : "None"}
                            </Typography>
                            <Typography paragraph className="view-pre-conversion-manipulation">
                                <strong>Pre-Conversion Manipulation<br /></strong>{preConversionManipulation ? preConversionManipulation : "None"}
                            </Typography>
                            <Typography paragraph className="view-post-conversion-loading-errors">
                                <strong>Post-Conversion Loading Errors<br /></strong>{postConversionLoadingErrors ? postConversionLoadingErrors : "None"}
                            </Typography>
                            <Typography paragraph className="view-post-conversion-validation-results">
                                <strong>Post-Conversion Validation Results<br /></strong>{postConversionValidationResults ? postConversionValidationResults : "None"}
                            </Typography>
                            <Typography paragraph className="view-post-conversion-changes">
                                <strong>Post-Conversion Changes<br /></strong>{postConversionChanges ? postConversionChanges : "None"}
                            </Typography>
                        </CardContent>
                    </Collapse>
                </div>
            </Card >
            <Link to={`/`}>
                <button className="back-button">
                    Back
                </button>
            </Link>
        </div>
    );
}

ViewConversionChecklistCard.propTypes = {
    loadSheetName: PropTypes.string,
    loadSheetOwner: PropTypes.object,
    decisionMaker: PropTypes.object,
    contributors: PropTypes.array,
    conversionType: PropTypes.object,
    additionalProcessing: PropTypes.array,
    dataSources: PropTypes.string,
    uniqueRecordsPreCleanup: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    uniqueRecordsPostCleanup: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    recordsPreCleanupNotes: PropTypes.string,
    recordsPostCleanupNotes: PropTypes.string,
    preConversionManipulation: PropTypes.string,
    postConversionLoadingErrors: PropTypes.string,
    postConversionValidationResults: PropTypes.string,
    postConversionChanges: PropTypes.string,
    isFormApproved: PropTypes.bool,
}

ViewConversionChecklistCard.defaultProps = {
    loadSheetName: "",
    loadSheetOwner: {},
    decisionMaker: {},
    contributors: [],
    conversionType: {},
    additionalProcessing: [],
    dataSources: "",
    uniqueRecordsPreCleanup: "",
    uniqueRecordsPostCleanup: "",
    recordsPreCleanupNotes: "",
    recordsPostCleanupNotes: "",
    preConversionManipulation: "",
    postConversionLoadingErrors: "",
    postConversionValidationResults: "",
    postConversionChanges: "",
    isFormApproved: false,
}

export default ViewConversionChecklistCard;
