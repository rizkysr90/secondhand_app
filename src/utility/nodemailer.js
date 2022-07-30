const nodemailer = require('nodemailer');
const {new_user_template} = require('./../constants/htmlTemplate/email');
const ejs = require('ejs');

async function generateTemplateEmail({type,name,confirm_email}) {
    if (type === "new_account") {
        let emailTemplate;
        const dynamicDataInEjs = {
            user : name,
            url : confirm_email
        }
        const options = {
            async : true
        }
        emailTemplate = await ejs.render(new_user_template,dynamicDataInEjs,options)
        return emailTemplate;
    }
}
// async function writeEmail() {

// }
async function sendEmailSMTP({
    receiver,subject,text,html,attachments
    }) {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SENDINBLUE_EMAIL, 
            pass: process.env.SENDINBLUE_PASSWORD, 
        },
    });


    const mailOptions = {
        from: process.env.SENDINBLUE_EMAIL,
        to: receiver,
        subject: subject,
        text: text,
        html : html,
        attachments : attachments
    };
    const resSendEmail = await transporter.sendMail(mailOptions);
    return resSendEmail.messageId;
}

module.exports = {
    generateTemplateEmail,
    sendEmailSMTP
}