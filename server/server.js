const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// ==============================
// Middleware
// ==============================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "../static")));

app.set("views", path.join(__dirname, "../templates"));
app.set("view engine", "ejs");

// ==============================
// Database
// ==============================

const db = new sqlite3.Database(
    path.join(__dirname, "../database.db"),
    (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Connected to SQLite database.");
        }
    }
);

// ==============================
// HOME
// ==============================

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/job", (req, res) => {
    res.render("job");
});

// ==============================
// TEST
// ==============================

app.get("/hello", (req, res) => {
    res.send("Express is working!");
});

// ==============================
// JOB PREDICTION
// ==============================

app.post("/predict", (req, res) => {

    const jobText = req.body.job_description;

    const safeText = jobText.replace(/"/g, '\\"');

    exec(
        `python ../predict.py "${safeText}"`,
        { cwd: __dirname },

        (error, stdout, stderr) => {

            if (error) {
                console.log(error);
                return res.send(error.message);
            }

            if (stderr) {
                console.log(stderr);
            }

            try {

                const result = JSON.parse(stdout);

                // Save history
                // Get first line as job title
const jobTitle =
    jobText.split("\n")[0].substring(0, 80);

db.run(
    `INSERT INTO history
    (
        job_title,
        prediction,
        confidence,
        fraud_score,
        risk,
        job_description
    )
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
        jobTitle,
        result.prediction,
        result.confidence,
        result.fraud_score,
        result.risk,
        jobText
    ],
    (err) => {
        if (err) {
            console.log("Database Error:", err.message);
        } else {
            console.log("Prediction saved successfully.");
        }
    }
);


                res.render("result", {

                    prediction: result.prediction,
                    confidence: result.confidence,
                    fraud_score: result.fraud_score,
                    risk: result.risk,
                    reasons: result.reasons,
                    job_text: jobText

                });

            } catch (err) {

                console.log(err);
                res.send(stdout);

            }

        }

    );

});

// ==============================
// COMPANY PAGE
// ==============================

app.get("/company", (req, res) => {
    res.render("company");
});

// ==============================
// COMPANY VERIFICATION FUNCTION
// ==============================

function verifyCompany(company, website, email) {

    let score = 100;
    let reasons = [];

    if (!website.startsWith("https://")) {
        score -= 20;
        reasons.push("Website is not using HTTPS");
    }

    const freeEmails = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com"
    ];

    const emailDomain = email.split("@")[1];

    if (freeEmails.includes(emailDomain)) {
        score -= 25;
        reasons.push("Recruiter uses a personal email");
    }

    const websiteDomain = website
        .replace("https://", "")
        .replace("http://", "")
        .split("/")[0]
        .replace("www.", "");

    if (!email.endsWith(websiteDomain)) {
        score -= 25;
        reasons.push("Email domain does not match company website");
    }

    if (
        website.includes(".xyz") ||
        website.includes(".top") ||
        website.includes(".click")
    ) {
        score -= 20;
        reasons.push("Suspicious website domain");
    }

    if (company.length < 3) {
        score -= 10;
        reasons.push("Invalid company name");
    }

    let status;

    if (score >= 80)
        status = "Verified";
    else if (score >= 50)
        status = "Needs Manual Review";
    else
        status = "Suspicious";

    return {
        score,
        status,
        reasons
    };

}

// ==============================
// VERIFY COMPANY
// ==============================

app.post("/verify_company", (req, res) => {

    const { company_name, website, email } = req.body;

    const result = verifyCompany(
        company_name,
        website,
        email
    );

    res.render("company_result", {

        company_name,
        website,
        email,

        score: result.score,
        status: result.status,
        reasons: result.reasons

    });

});

// ==============================
// HISTORY
// ==============================

app.get("/history", (req, res) => {

    db.all(
        "SELECT * FROM history ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.render("history", {
                history: rows
            });

        }
    );

});

// ==============================
// HISTORY DETAILS
// ==============================

app.get("/history/:id", (req, res) => {

    const id = req.params.id;

    db.get(
        "SELECT * FROM history WHERE id = ?",
        [id],
        (err, row) => {

            if (err) {
                return res.send(err.message);
            }

            if (!row) {
                return res.send("Record not found.");
            }

            res.render("history_details", {
                record: row
            });

        }
    );

});


app.get("/dashboard", (req, res) => {

    db.all("SELECT * FROM history", [], (err, rows) => {

        if (err) {
            return res.send(err.message);
        }

        const totalJobs = rows.length;

        const realJobs = rows.filter(
            row => row.prediction === "Real Job"
        ).length;

        const fakeJobs = totalJobs - realJobs;

        const avgConfidence =
            totalJobs > 0
            ? (
                rows.reduce(
                    (sum, row) => sum + row.confidence,
                    0
                ) / totalJobs
              ).toFixed(2)
            : 0;

        res.render("dashboard", {

            totalJobs,
            realJobs,
            fakeJobs,
            avgConfidence

        });

    });

});
// ==============================
// START SERVER
// ==============================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});