const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');

require('dotenv').config();
// create express app
const app = express();
// Setup server port
const port = process.env.PORT || 3001;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const dbConnect = require('./config');
dbConnect();

app.post('/getEmail', function(req, res) {
    const emailData = req.body;
    const emails = require('./model/emails');
    emails.findOne({
        email_id: emailData.messageId
    }).then(email => {
        if(!email) {
            let EmailModel = {
                sender: emailData.from.text,
                receiver: emailData.to.text,
                email_title: emailData.subject,
                email_body: emailData.textAsHtml,
                email_id: emailData.messageId,
            };
            emails.create(EmailModel)
                .then(res => {
                    return res.send({success: true, message: "Email is saved successfully!"});
                })
                .catch(err => {
                    return res.send({success: false, message: "Something went wrong!"});
                })
        } else {
            return res.send({success: false, message: "The email exists already in database!"});
        }
    }).catch(err => {
        return res.send({success: false, message: "Something went wrong!"})
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
