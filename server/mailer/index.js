'use strict';
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
exports.sendAuthCodeViaEmailTo = async  (firstName,email,auth_code) => {
    console.log('======================================');
    console.log('firstName : ' + firstName);
    console.log('email : '+email);
    console.log('authCode: '+auth_code);
    console.log('======================================');
    
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'malzama.platform@gmail.com',
            pass: 'malzama_ak.io_malzama'
        }
    });

    let mail_options = {
        from: 'malzama.platform@gmail.com',
        to:email,
        subject: 'منصة التعليم الالكتروني / تطبيق ملزمة\n confirm your account 📙', // Subject line
        html: `<h3>Hi ${firstName? firstName : 'there'}</h3>
               <h4>the code number for your account : ${auth_code} </h4>` // html body
    }
    // send mail with defined transport object
    let info = await transporter.sendMail(mail_options);

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
//main('55', 'omar.alkhateeb9919@gmail.com').catch(console.error);

