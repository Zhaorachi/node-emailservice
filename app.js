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

app.get('/', function(req, res) {
    return res.send("This url is working!");
});

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
                title: emailData.subject,
                body: emailData.textAsHtml,
                attachment: emailData.attachment,
                email_id: emailData.messageId,
            };
            console.log(emailData);
            emails.create(EmailModel)
                .then(res => {
                    console.log({success: true, message: "email is saved successfully!"});
                    return res.send({success: true, message: "Email is saved successfully!"});
                })
                .catch(err => {
                    console.log({success: false, message: "Something went wrong creating EmailModel"});
                    return res.send({success: false, message: "Something went wrong!"});
                })
        } else {
            console.log({success:false, message: "The email exists already in database!"});
            return res.send({success: false, message: "The email exists already in database!"});
        }
    }).catch(err => {
        console.log({success: false, message: "Something went wrong finding one"});
        return res.send({success: false, message: "Something went wrong!"})
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
