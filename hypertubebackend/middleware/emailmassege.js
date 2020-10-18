var mail = require('../query/mail');

let maily = {}

maily.emailregister = async function (email, token) {
    const message = `<p>activate your account</p>
        <a href = 'http://localhost:9000/activateAccount/?token=${token}'>here</a>`

    const subject = 'ActivateAccount'
    console.log('email mnnmjjji' +email)
    try {
            console.log('trying email',subject)
         await mail.nodemaily(email, subject, message)
    } catch (error) {
        console.log("error email ", error.message);
    }
}

maily.emailForgot = async function (email, token) {
    const message = `<p>change your password</p>
        <a href = 'http://localhost:9000/resetpassword/?token=${token}&email=${email}'>here</a>`

    const subject = 'forgot Password';
    try {
        await mail.nodemaily(email, subject, message)
    } catch (error) {
        console.log("error email ", error.message);

    }
}

maily.emailchange = async function (email) {
    const message = `<p>your just changed your emial</p>`
    const subject = 'email changed';
    try {
        await mail.nodemaily(email, subject, message)
    } catch (error) {

    }

}

module.exports = maily