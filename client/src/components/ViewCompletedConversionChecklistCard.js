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
import { useNavigate } from 'react-router-dom';
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

export default function ViewCompletedConversionChecklistCard({
    loadSheetName = "",
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
    postConversionChanges = ""
}) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState(true);

    const handleOnClickBack = () => {
        navigate("/");
    }

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
                    title={<strong>Completed Checklist</strong>}
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
                                    // className="contributor-list"
                                    key={key}
                                    style={{ listStyle: "none" }}>
                                    {val}
                                </li>
                            })}
                        </Typography>
                        <Typography paragraph>
                            <strong>Conversion Type<br /></strong> {conversionType}
                        </Typography>
                        <Typography paragraph>
                            <strong>Additional Processing<br /></strong> {additionalProcessing}
                        </Typography>
                        <Typography paragraph>
                            <strong>Data Sources<br /></strong> {dataSources}
                        </Typography>
                        <Typography paragraph>
                            <strong>Unique Records Pre-Cleanup<br /></strong> {uniqueRecordsPreCleanup}
                        </Typography>
                        <Typography paragraph>
                            <strong>Unique Records Post-Cleanup<br /></strong> {uniqueRecordsPostCleanup}
                        </Typography>
                        <Typography paragraph>
                            <strong>Pre-Cleanup Notes<br /></strong> {recordsPreCleanupNotes === null ? "None" : recordsPreCleanupNotes}
                        </Typography>
                        <Typography paragraph>
                            <strong>Post-Cleanup Notes<br /></strong> {recordsPostCleanupNotes === null ? "None" : recordsPostCleanupNotes}
                        </Typography>
                        <Typography paragraph>
                            <strong>Pre-Conversion Manipulation<br /></strong> {preConversionManipulation === null ? "None" : preConversionManipulation}
                        </Typography>
                        <Typography paragraph>
                            <strong>Post-Conversion Loading Errors<br /></strong> {postConversionLoadingErrors}
                        </Typography>
                        <Typography paragraph>
                            <strong>Post-Conversion Validation Results<br /></strong> {postConversionValidationResults}
                        </Typography>
                        <Typography paragraph>
                            <strong>Post-Conversion Changes<br /></strong> {postConversionChanges}
                        </Typography>
                        <button
                            className="back-button"
                            onClick={handleOnClickBack}>
                            Back
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}