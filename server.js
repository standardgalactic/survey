const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password"
    }
});

app.post("/submit", (req, res) => {
    let { email, minecraft, keen, minesweeper, estimate, rationale, sgaOnly } = req.body;

    const filePath = path.join(__dirname, 'responses', `${email}.json`);

    if (fs.existsSync(filePath)) {
        return res.status(400).send("Sorry, you have already submitted a response.");
    }

    fs.writeFileSync(filePath, JSON.stringify(req.body));

    let subject = "SGA Encounter Survey Response";
    if (minecraft && keen) subject = "You've played Keen & Minecraft – You're a legend!";
    else if (minecraft) subject = "Minecraft player detected!";
    else if (keen) subject = "Commander Keen nostalgia trip!";
    else if (sgaOnly) subject = "SGA is in your DNA!";

    let message = `Survey response:\n\n` +
        `- Minecraft: ${minecraft}\n` +
        `- Commander Keen: ${keen}\n` +
        `- Minesweeper: ${minesweeper}\n` +
        `- Recognizes SGA but not Minecraft: ${sgaOnly}\n` +
        `- Estimated number of encounters: ${estimate}\n\n` +
        `Rationale:\n${rationale}`;

    transporter.sendMail({
        from: "your-email@gmail.com",
        to: "standardgalactic@protonmail.com",
        subject: subject,
        text: message,
    }, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error sending email.");
        } else {
            res.send("Survey submitted! Thank you for participating.");
        }
    });
});

app.post("/reset", (req, res) => {
    let { email } = req.body;

    const filePath = path.join(__dirname, 'responses', `${email}.json`);

    if (!fs.existsSync(filePath)) {
        return res.status(400).send("No submission found for this email.");
    }

    fs.unlinkSync(filePath);
    res.send("Submission reset successfully.");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
