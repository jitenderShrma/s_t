var events = require('events');
var eventEmitter = new events.EventEmitter();
var axios = require('axios');
var request_url  = 'http://127.0.0.1:3000/api';


var nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var sendMailSMTP = function(user,pass,to,subject,mail,logId){
  console.log("send mail");
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass,
       }
   });
   
   var mailOptions = {
       from: 'admin@erp.imsnoida.com',
       to: to,
       subject: subject,
       html: mail,
   };
   
   transporter.sendMail(mailOptions, function(error, info){
       if (error) {
           console.log(error);
           var date = new Date();
           axios.put(request_url+'/comms/logs/edit/'+logId,{status:"Failed",plugin:"SMTP",sent_date:date.toISOString()}).then(function (response) {
            console.log("SMTP LOG UPDATED with FAILED");
            // console.log(response);
          })
          .catch(function (error) {
            // console.log(error);
          });
       }else {
           console.log('Email sent: ' + info.response);
           var date = new Date();
           axios.put(request_url+'/comms/logs/edit/'+logId,{status:"Success",plugin:"SMTP",sent_date:date.toISOString()}).then(function (response) {
            console.log("SMTP LOG UPDATED with SUCCESS");
            // console.log(response);
          })
          .catch(function (error) {
            // console.log(error);
          });
       }}); 
  
};

var sendMailAPI = function(email){

  var SENDGRID_API_KEY = "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";

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: '',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
};


//TEXT SMS MSG91

var sendSMSMSG91 = function(api_key,sender_name,number,msg,logId){
      var urlencode = require('urlencode');
      var authkey = api_key;
      var route = 4;
      var message= urlencode(msg);
      var sender = sender_name;
      var mobile =  number;


      var data = 'mobiles='+mobile+'&authkey='+authkey+'&route='+route+'&sender='+sender+'&message='+message+'&country=91';
      axios.get('http://control.msg91.com/api/sendhttp.php?'+data, {
          })
            .then((res) => {
              // console.log(`statusCode: ${res.statusCode}`);
              if(res.status == 200){
                var date = new Date();
                axios.put(request_url+'/comms/logs/edit/'+logId,{status:"Success",plugin:"SMS",sent_date:date.toISOString()}).then(function (response) {
                  console.log("SMS LOG UPDATED");
                  // console.log(response);
                })
                .catch(function (error) {
                  // console.log(error);
                });

              }
            })
            .catch((error) => {
              console.error(error);
              var date = new Date();
                axios.put(request_url+'/comms/logs/edit/'+logId,{status:"Failed",plugin:"SMS",sent_date:date.toISOString()}).then(function (response) {
                  console.log("SMS LOG UPDATED with Failed");
                  // console.log(response);
                })
                .catch(function (error) {
                  // console.log(error);
                });
            });
};

eventEmitter.on('mailSMTP',sendMailSMTP);
eventEmitter.on('mailAPI',sendMailAPI);
eventEmitter.on('sendSMS',sendSMSMSG91);



module.exports = eventEmitter;