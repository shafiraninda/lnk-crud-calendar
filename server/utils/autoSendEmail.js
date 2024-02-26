require("dotenv").config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const createTransporter = async () => {
  try {
      const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      )

      oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
      })

      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if(err){
            console.log("*ERR: ", err)
            reject()
          }

          resolve(token)
        })
      })

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          accessToken,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.refreshToken
        }
      })

      return transporter
  } catch (error) {
    throw error
  }
}

// send email
async function SendEmailTask(target_email) {
  let transporter, emailTarget, mail;

  transporter = await createTransporter();
  emailTarget = target_email;

  mail = {
    to: emailTarget,
    from: process.env.user,
    subject: 'LNK CALENDAR - DAILY SENT EMAIL TASK',
    html: `Hi, Salam Kenal`
  };
  transporter.sendMail(mail);
}

module.exports = { SendEmailTask }