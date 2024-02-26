const SendEmail = require('../models/sendEmailModel');
const { SendEmailTask } = require('../utils/autoSendEmail');
const errorHandler = require('../utils/errorHandler');
const response = require('../utils/helper')
const moment = require('moment')

async function createSendEmail(req, res, next) {
    try {
        const { email, date, desc } = req.body
        const newSendEmail = new SendEmail({
            email,
            date: new Date(date),
            desc
        })

        await newSendEmail.save()

        if(moment(date).diff(moment(), 'day') === 0){
            SendEmailTask(email)
            await SendEmail.findByIdAndUpdate(newSendEmail._id, { isSent: true })
        }

        if(newSendEmail){
            return res.status(200).json(response.successWithData('Success', newSendEmail))
        }
        throw new errorHandler(400, 'Failed to create send email')
    } catch (error) {
        next(error)
    }
}

async function editSendEmail(req, res, next){
    try {
        const { id } = req.params
        const { email, date, desc } = req.body
        const findSendEmail = await SendEmail.findById(id)
        if(!findSendEmail) throw new errorHandler(404, "Send email not found")

        let updateData = {}
        if(email) updateData.email = email
        if(date) updateData.date = new Date(date)
        if(desc) updateData.desc = desc

        const updateSendEmail = await SendEmail.findByIdAndUpdate(
            findSendEmail._id,
            updateData
        )
        if(!updateSendEmail) throw new errorHandler(400, 'Error update send email')

        res.status(200).json(response.successWithData("Success", updateSendEmail))
    } catch (error) {
        next(error)
    }
}

async function deleteSendEmail(req, res, next){
    try {
        const { id } = req.params

        const findSendEmail = await SendEmail.findById(id)
        if(!findSendEmail) throw new errorHandler(404, 'Send email not found')

        const deleteSendEmail = await SendEmail.findByIdAndDelete(findSendEmail._id)
        if(!deleteSendEmail) throw new errorHandler(400, "Delete send email failed")
    } catch (error) {
        next(error)
    }
}

async function getSendEmailById(req, res, next){
    try {
        const { id } = req.params

        const findSendEmail = await SendEmail.findById(id)
        if(!findSendEmail) throw new errorHandler(404, "Send email not found")

        return res.status(200),json(response.successWithData("SUCCESS", findSendEmail))
    } catch (error) {
        next(error)
    }
}

async function getAllSendEmail(req, res, next){
    try {
        const { start_date, end_date } = req.query

        let filter = {}
        if(start_date) filter = { ...filter, $gte: new Date(start_date) }
        if(end_date) filter = { ...filter, $lte: new Date(end_date)}

        const findData = await SendEmail.find({ date: filter })
        if(!findData) return res.status(200).json("Data not found")

        res.status(200).json(response.successWithData("Data have found", findData))
    } catch (error) {
        next(error)
    }
}


module.exports = { createSendEmail, editSendEmail, deleteSendEmail, getSendEmailById, getAllSendEmail }