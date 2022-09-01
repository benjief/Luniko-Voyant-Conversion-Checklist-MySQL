const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());


// local DB setup
// const db = mysql.createConnection({
//     user: "root",
//     host: "localhost",
//     password: "",
//     database: "voyant_conversion_checklist"
// });

// Heroku DB setup
const db = mysql.createConnection({
    user: "smalbqxwpdi81cf1",
    host: "uyu7j8yohcwo35j3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    password: "p2q1f0vjwbjayzke",
    database: "cei6b44h3w9lie0t"
});

app.get('/get-all-personnel', (req, res) => {
    db.query(
        `SELECT 
            * 
         FROM 
            personnel`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/get-personnel-info/:uid', (req, res) => {
    const uid = req.params.uid;
    db.query(
        `SELECT 
             CONCAT(pers_fname, ' ', pers_lname) AS pers_name 
         FROM 
             personnel 
         WHERE 
            pers_id = ?`, uid, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/get-all-ls-names', (req, res) => {
    db.query(
        `SELECT 
            cc_load_sheet_name 
         FROM 
            conversion_checklist`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/get-valid-completed-ls-names', (req, res) => {
    db.query(
        `SELECT 
            cc_load_sheet_name 
         FROM 
            conversion_checklist
         WHERE 
            is_approved = 1`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/get-valid-pre-conversion-ls-names', (req, res) => {
    db.query(
        `SELECT 
            cc_load_sheet_name 
         FROM 
            conversion_checklist 
         WHERE 
            cc_post_conversion_loading_errors IS NULL AND
            cc_post_conversion_validation_results IS NULL AND
            cc_post_conversion_changes IS NULL`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
});

app.get('/get-valid-post-conversion-ls-names', (req, res) => {
    db.query(
        `SELECT 
            cc_load_sheet_name 
         FROM 
            conversion_checklist 
         WHERE 
            cc_post_conversion_loading_errors IS NOT NULL AND
            cc_post_conversion_validation_results IS NOT NULL AND
            cc_post_conversion_changes IS NOT NULL AND
            is_approved = 0`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
});



app.get('/get-all-conversion-checklist-info/:loadSheetName', (req, res) => {
    const loadSheetName = req.params.loadSheetName;
    db.query(
        `SELECT
            cc_id,
            cc_load_sheet_owner, 
            cc_decision_maker, 
            cc_conversion_type, 
            cc_data_sources, 
            uq_records_pre_cleanup, 
            uq_records_post_cleanup, 
            cc_records_pre_cleanup_notes, 
            cc_records_post_cleanup_notes, 
            cc_pre_conversion_manipulation,
            cc_post_conversion_loading_errors,
            cc_post_conversion_validation_results,
            cc_post_conversion_changes,
            is_approved
        FROM
            conversion_checklist
        WHERE
	        cc_load_sheet_name = ?`,
        loadSheetName, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
});

app.get('/get-conversion-checklist-info/:loadSheetName', (req, res) => {
    const loadSheetName = req.params.loadSheetName;
    db.query(
        `SELECT
            cc_id,
            cc_load_sheet_name,
            cc_load_sheet_owner, 
            cc_decision_maker, 
            cc_conversion_type, 
            cc_data_sources, 
            uq_records_pre_cleanup, 
            uq_records_post_cleanup, 
            cc_records_pre_cleanup_notes, 
            cc_records_post_cleanup_notes, 
            cc_pre_conversion_manipulation,
            cc_post_conversion_loading_errors,
            cc_post_conversion_validation_results,
            cc_post_conversion_changes,
            is_approved
        FROM
            conversion_checklist
        WHERE
	        cc_load_sheet_name = ?`,
        loadSheetName, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
});

app.get('/get-additional-processing/:checklistID', (req, res) => {
    const checklistID = req.params.checklistID;
    db.query(
        `SELECT
            ap_type
        FROM
            additional_processing
        WHERE
	        cc_id = ?`,
        checklistID, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
});

app.get('/get-load-sheet-id/:loadSheetName', (req, res) => {
    const loadSheetName = req.params.loadSheetName;
    db.query(
        `SELECT
            cc_id
        FROM
            conversion_checklist
        WHERE
	        cc_load_sheet_name = ?`,
        loadSheetName, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
});

app.get('/get-submitted-contributors/:conversionChecklistID', (req, res) => {
    const conversionChecklistID = req.params.conversionChecklistID;
    db.query(`
        SELECT 
	        pers_id, 
            CONCAT(pers_fname, ' ', pers_lname) AS pers_name
        FROM
	        personnel JOIN contribution ON pers_id = contributor_id
        WHERE
	        cc_id = ?`,
        conversionChecklistID, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
});



app.post("/add-personnel", (req, res) => {
    const pers_id = req.body.pers_id;
    const pers_fname = req.body.pers_fname;
    const pers_lname = req.body.pers_lname;

    db.query(
        "INSERT INTO personnel (pers_id, pers_fname, pers_lname) VALUES (?, ?, ?)",
        [pers_id, pers_fname, pers_lname], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Personnel added!");
                res.send("Personnel added!");
            }
        }
    );
});

app.post("/add-checklist", (req, res) => {
    const loadSheetName = req.body.loadSheetName;
    const loadSheetOwner = req.body.loadSheetOwner;
    const decisionMaker = req.body.decisionMaker;
    const conversionType = req.body.conversionType;
    const dataSources = req.body.dataSources;
    const uniqueRecordsPreCleanup = req.body.uniqueRecordsPreCleanup;
    const uniqueRecordsPostCleanup = req.body.uniqueRecordsPostCleanup;
    const recordsPreCleanupNotes = req.body.recordsPreCleanupNotes;
    const recordsPostCleanupNotes = req.body.recordsPostCleanupNotes;
    const preConversionManipulation = req.body.preConversionManipulation;

    db.query(
        `INSERT INTO conversion_checklist (
            cc_load_sheet_name,
            cc_load_sheet_owner, 
            cc_decision_maker, 
            cc_conversion_type, 
            cc_data_sources, 
            uq_records_pre_cleanup, 
            uq_records_post_cleanup, 
            cc_records_pre_cleanup_notes, 
            cc_records_post_cleanup_notes, 
            cc_pre_conversion_manipulation
        )
        
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [loadSheetName, loadSheetOwner, decisionMaker,
            conversionType, dataSources,
            uniqueRecordsPreCleanup, uniqueRecordsPostCleanup,
            recordsPreCleanupNotes, recordsPostCleanupNotes,
            preConversionManipulation], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Pre-conversion checklist added!");
                    res.send(result);
                }
            }
    );
});

app.delete("/remove-checklist/:conversionChecklistID", (req, res) => {
    const checklistID = req.params.conversionChecklistID;

    db.query(
        `DELETE 
         FROM conversion_checklist
         WHERE cc_id = ?`,
        checklistID, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Conversion checklist removed!");
                res.send(result);
            }
        }
    );
});

app.post("/add-contribution", (req, res) => {
    const checklistID = req.body.checklistID;
    const contributorID = req.body.contributorID;

    db.query(
        `INSERT INTO contribution (
            cc_id,
            contributor_id
        )
        
        VALUES (?, ?)`,
        [checklistID, contributorID], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Contribution added!");
                res.send("Contribution added!");
            }
        }
    );
});

app.delete("/remove-contributions/:conversionChecklistID", (req, res) => {
    const checklistID = req.params.conversionChecklistID;

    db.query(
        `DELETE 
         FROM contribution
         WHERE cc_id = ?`,
        checklistID, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Contribution deleted!");
                res.send("Contribution deleted!");
            }
        }
    );
});

app.post("/add-additional-processing", (req, res) => {
    const checklistID = req.body.checklistID;
    const additionalProcessingType = req.body.additionalProcessingType;

    db.query(
        `INSERT INTO additional_processing (
            cc_id,
            ap_type
        )
        
        VALUES (?, ?)`,
        [checklistID, additionalProcessingType], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Additional processing added!");
                res.send("Additional processing added!");
            }
        }
    );
});

app.delete("/remove-additional-processing/:conversionChecklistID", (req, res) => {
    const checklistID = req.params.conversionChecklistID;

    db.query(
        `DELETE
         FROM additional_processing
         WHERE cc_id = ?`,
        checklistID, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Additional processing deleted!");
                res.send("Additional processing deleted!");
            }
        }
    );
});

app.put("/update-pre-conversion-checklist/:conversionChecklistID", (req, res) => {
    const conversionChecklistID = req.params.conversionChecklistID;
    const loadSheetName = req.body.loadSheetName;
    const loadSheetOwner = req.body.loadSheetOwner;
    const decisionMaker = req.body.decisionMaker;
    const conversionType = req.body.conversionType;
    const dataSources = req.body.dataSources;
    const uniqueRecordsPreCleanup = req.body.uniqueRecordsPreCleanup;
    const uniqueRecordsPostCleanup = req.body.uniqueRecordsPostCleanup;
    const recordsPreCleanupNotes = req.body.recordsPreCleanupNotes;
    const recordsPostCleanupNotes = req.body.recordsPostCleanupNotes;
    const preConversionManipulation = req.body.preConversionManipulation;

    db.query(
        `UPDATE conversion_checklist 
         SET
            cc_load_sheet_name = ?,
            cc_load_sheet_owner = ?, 
            cc_decision_maker = ?, 
            cc_conversion_type = ?, 
            cc_data_sources = ?, 
            uq_records_pre_cleanup = ?, 
            uq_records_post_cleanup = ?, 
            cc_records_pre_cleanup_notes = ?, 
            cc_records_post_cleanup_notes = ?, 
            cc_pre_conversion_manipulation = ?
        WHERE cc_id = ?`,
        [loadSheetName, loadSheetOwner, decisionMaker,
            conversionType, dataSources,
            uniqueRecordsPreCleanup, uniqueRecordsPostCleanup,
            recordsPreCleanupNotes, recordsPostCleanupNotes,
            preConversionManipulation, conversionChecklistID], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Pre-conversion checklist updated!");
                    res.send(result);
                }
            }
    );
});

app.put("/update-post-conversion-checklist/:conversionChecklistID", (req, res) => {
    const conversionChecklistID = req.params.conversionChecklistID;
    const postConversionLoadingErrors = req.body.postConversionLoadingErrors;
    const postConversionValidationResults = req.body.postConversionValidationResults;
    const postConversionChanges = req.body.postConversionChanges;
    const approvedByITDirector = req.body.approvedByITDirector;

    db.query(
        `UPDATE conversion_checklist 
         SET
            cc_post_conversion_loading_errors = ?,
            cc_post_conversion_validation_results = ?,
            cc_post_conversion_changes = ?,
            is_approved = ?
        WHERE cc_id = ?`,
        [postConversionLoadingErrors, postConversionValidationResults,
            postConversionChanges, approvedByITDirector, conversionChecklistID],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Pre-conversion checklist updated!");
                res.send(result);
            }
        }
    );
});

// local connect
// app.listen(3001, () => {
//     console.log("Yay! Your server is running on port 3001.");
// });

// Heroku connect
app.listen(process.env.PORT || 3001, () => {
    console.log("Your server is running!");
});
