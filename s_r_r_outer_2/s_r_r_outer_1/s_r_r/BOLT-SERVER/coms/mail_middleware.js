"use strict";

var nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


function sendMail(req,res,next){
    var transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
             user: 'prakharnegative@gmail.com',
             pass: ''
            }
        });
        
        var mailOptions = {
            from: 'prakharnegative@gmail.com',
            to: 'kaidranzer7011@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }else {
                console.log('Email sent: ' + info.response);
            }}); 
    }

 module.exports = sendMail;   