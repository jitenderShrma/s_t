var events = require('events');
var eventEmitter = new events.EventEmitter();
var mongoose = require('mongoose');
var Designation = mongoose.model('Designation');
var Staff = mongoose.model('Staff');
var User = mongoose.model('User');


var axios = require('axios');
var request_url  = 'http://127.0.0.1:3000/api';


var UserCreatedMail = function(context,company,user){
  console.log("send user created mail");
  axios.post(request_url+'/send/mail/smtp',{user:user,context:context,company:company}).then(function (response) {
    // console.log(response);
  })
  .catch(function (error) {
    // console.log(error);
  });

}


var RequestAcceptedMail = function(requester,company,context,amount,acceptor_id){
  User.findOne({_id:acceptor_id}).exec(function(err,user){
    var acceptor_name = user.personal_details.name;
    axios.post(request_url+'/send/mail/smtp',{user:requester,company:company ,context:context,amount:amount,acceptor_name:acceptor_name}).then(function (response) {
      // console.log(response);
    })
    .catch(function (error) {
      // console.log(error);
    });
    

  });  
}

var SendMail = function(user,company,context,amount,acceptor){
   
    axios.post(request_url+'/send/mail/smtp',{user:user,company:company ,context:context,amount:amount,acceptor_name:acceptor}).then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        // console.log(error);
      });

};


var approval_arrived_Mail = function(designation,company,context,amount,requester_name){


  Staff.findOne({designation:designation}).exec(function(err,staff){
    if(err){
      console.log("BEEPBOP Error");
    }else{
      User.findOne({user_type:staff._id}).exec(function(err,user){
        axios.post(request_url+'/send/mail/smtp',{user:user._id,company:company ,context:context,amount:amount,requester_name:requester_name}).then(function (response) {
          // console.log(response);
        })
        .catch(function (error) {
          // console.log(error);
        });

      });
    }

  });
};


var approval_sent_Mail = function(user,company,context,amount){
   
  axios.post(request_url+'/send/mail/smtp',{user:user,company:company ,context:context,amount:amount}).then(function (response) {
      // console.log(response);
    })
    .catch(function (error) {
      // console.log(error);
    });

};

eventEmitter.on('SendMail_approvals',SendMail);
eventEmitter.on('SendMail_approvals_arrived',approval_arrived_Mail);
eventEmitter.on('SendMail_approvals_sent',approval_sent_Mail);
eventEmitter.on('request_accepted_mail',RequestAcceptedMail);
eventEmitter.on('UserCreatedEmail',UserCreatedMail);


module.exports = eventEmitter;

