require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app =  express();
const cors = require("cors");
const routes = require("./routes/index");

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

mongoose.Promise = global.Promise;