const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "voyant_conversion_checklist"
});

app.get('/get-all-personnel', (req, res) => {
    db.query("SELECT * FROM personnel", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post("/add-personnel", (req, res) => {
    const pers_fname = req.body.pers_fname;
    const req_lname = req.body.pers_lname;

    db.query(
        "INSERT INTO personnel (pers_fname, pers_lname) VALUES (?, ?)",
        [pers_fname, pers_lname], (err, result) => {
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
    const pers_fname = req.body.pers_fname;
    const req_lname = req.body.pers_lname;

    db.query(
        `INSERT INTO conversion_checklist (
            cc_load_sheet_owner, 
            cc_decision_maker, 
            cc_load_sheet_name, 
            cc_conversion_type, 
            cc_additional_processing, 
            cc_data_sources, 
            uq_records_pre_cleanup, 
            cc_records_pre_cleanup_notes, 
            uq_records_post_cleanup, 
            cc_records_post_cleanup_notes, 
            cc_pre_conversion_manipulation
        )
        
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [pers_fname, pers_lname], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Checklist added!");
                res.send("Checklist added!");
            }
        }
    );
});



app.listen(3001, () => {
    console.log("Yay! Your server is running on port 3001.");
});