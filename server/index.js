require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app =  express();
const cors = require("cors");
const cron = require('node-cron');
const moment = require('moment')
const routes = require("./routes/index");
const sendEmail = require("./models/sendEmailModel");
const { SendEmailTask } = require("./utils/autoSendEmail");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// router
app.use(routes)

const CONNECTION_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@lnk-test.vcarcv7.mongodb.net/db_test`
const PORT = process.env.PORT || 5100;

mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`)))
    .catch((error) => {
        console.log("error connection mongodb")
        console.log(error.message)
    });


// cron jobs
const task = cron.schedule('00 09 * * *', async function() {
    try {
        console.log("cron start")
        let POOL = await sendEmail.find({ date: { $gte: new Date(moment().startOf('day')), $lte: new Date(moment().endOf('day'))}, isSent: false})
        for (const data of POOL) {
            SendEmailTask(data.email).then(async() => {
                await sendEmail.findByIdAndUpdate(data._id, { isSent: true })
                console.log('success send email to '+data.email)
            });   
        }   
    } catch (error) {
        console.log(error)
    }
});


task.start();

mongoose.Promise = global.Promise;