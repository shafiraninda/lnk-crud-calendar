const mongoose = require("mongoose");

const sendEmailSchema = mongoose.Schema({
    email: {
        type: String
    },
    date: {
        type: Date,
        default: new Date()
    },
    desc: String,
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "send_email"
})

const sendEmail = mongoose.model('SendEmail', sendEmailSchema);

module.exports = sendEmail;