import * as React from 'react';
import { Link } from 'react-router-dom';
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
// import BootstrapPopover from "../components/BootstrapPopover";
import MaterialTextField from '../components/MaterialTextField';

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

export default function EnterLoadSheetNameCard({
    loadSheetName = "",
    submitted = false,
    submitButtonDisabled = true,
    textAuthenticationError = "",
    input = ""
}) {
    const [expanded, setExpanded] = React.useState(true);
    const [submitButtonColor, setSubmitButtonColor] = React.useState("#BFBFBF");

    const handleOnChangeLoadSheetName = (updatedText) => {
        loadSheetName(updatedText);
    }

    const handleSubmitLoadSheetName = () => {
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
                minHeight: "150px",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoDarkGrey)",
                marginBottom: "20px"
            }}>
            <div className="load-sheet-name-card-content">
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
                    title={<strong>Please enter a valid <u>{input}</u>-conversion load sheet name</strong>}
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
                            // characterLimit={10}
                            // placeholder="Approximate number of unique records pre-cleanup"
                            inputValue={handleOnChangeLoadSheetName}
                            multiline={false}
                            required={false}
                            type="text"
                            authenticationField={true}
                            textAuthenticationError={textAuthenticationError}>
                        </MaterialTextField>
                        <button
                            className="submit-load-sheet-name-button"
                            onClick={handleSubmitLoadSheetName}
                            disabled={submitButtonDisabled}
                            style={{ backgroundColor: submitButtonColor }}>
                            Submit
                        </button>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}