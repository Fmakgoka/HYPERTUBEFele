var nodemailer = require("nodemailer");

let mailing = {};

mailing.nodemaily = async function(account, subject, message){
    console.log('mail')
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phyliciadancer@gmail.com',
            pass: 'Abcd@1234'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    console.log('yes mail')

    let info = await transporter.sendMail({
        from: 'Hypertube',
        to: account,
        subject: subject ,
        html: message
    })
    console.log('mail sent')
    console.log("Message sent: %s", info.messageId);

}

module.exports = mailing;