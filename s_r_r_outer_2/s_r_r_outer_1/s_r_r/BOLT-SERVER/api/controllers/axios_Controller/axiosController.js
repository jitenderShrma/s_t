'use strict';

var axios = require('axios');
var request_url  = 'http://127.0.0.1:3000/api';


exports.axios_send_a_mail = function(req,res,next){
    axios.post(request_url+'/send/mail/smtp',{user:req.session.user,context:res.locals.context,user_name:res.locals.user_name,company:req.session.company}).then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        // console.log(error);
      });
      next();
};

exports.axios_send_a_sms = function(req,res,next){
    axios.post(request_url+'/send/text/sms',{user:req.session.user,context:res.locals.context,user_name:res.locals.user_name,company:req.session.company}).then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        // console.log(error);
      });
};