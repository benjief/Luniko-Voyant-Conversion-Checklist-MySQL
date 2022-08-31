import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';

/**
 * This card contains links to all of the different checklist-related options this application offers.
 * @returns said card.
 */
function LandingPageOptionsCard() {
    const expanded = true;

    return (
        <Card
            sx={{
                minHeight: "243.47px",
                overflowY: "scroll",
                borderRadius: "10px",
                boxShadow: "2px 2px 6px rgba(43, 43, 43, 0.6)",
                transition: "0.5s",
                backgroundColor: "var(--lunikoMidGrey)",
                marginBottom: "20px"
            }}>
            <div className="card-content">
                <CardHeader
                    titleTypographyProps={{ color: "white", fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif", fontSize: "10.5pt" }}
                    title={<strong>Please choose an option below</strong>} />
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Link to={"/pre-conversion-checklist"}>
                            <button
                                className="pre-conversion-checklist-button">
                                Pre-Conversion Checklist
                            </button>
                        </Link>
                        <Link to={"/post-conversion-checklist"}>
                            <button
                                className="post-conversion-checklist-button">
                                Post-Conversion Checklist
                            </button>
                        </Link>
                        <Link to={"/view-conversion-checklist"}>
                            <button
                                className="view-conversion-checklist-button">
                                View Checklist
                            </button>
                        </Link>
                    </CardContent>
                </Collapse>
            </div>
        </Card >
    );
}

export default LandingPageOptionsCard;
