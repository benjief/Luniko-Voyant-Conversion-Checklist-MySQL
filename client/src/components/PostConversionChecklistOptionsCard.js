import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';

/**
 * Card that contains links to all of the different post-convresion-checklist-related options this application offers.
 * @returns said card.
 */
function PostConversionChecklistOptionsCard() {
    const expanded = true;

    return (
        <Card
            sx={{
                minHeight: "163.47px",
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
                    title={<strong>Please choose an option below</strong>}
                />
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Link to={"/create-or-modify-post-conversion-checklist/create"}>
                            <button
                                className="create-post-conversion-checklist-button">
                                Create
                            </button>
                        </Link>
                        <Link to={"/create-or-modify-post-conversion-checklist/modify"}>
                            <button
                                className="modify-post-conversion-checklist-button">
                                Modify
                            </button>
                        </Link>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

export default PostConversionChecklistOptionsCard;