'use strict';
const mongoose = require('mongoose');
//local mysql db connection

async function connect() {
    const dbPath = process.env.MONGODB_URL;
    console.log(dbPath);
    await mongoose.connect(dbPath, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(`connected to ${dbPath}`);
    }).catch(err => {
        console.error(err);
    })
}

module.exports = connect;
