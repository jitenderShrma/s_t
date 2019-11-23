var events = require('events');
var eventEmitter = new events.EventEmitter();
var mongoose = require('mongoose');


var axios = require('axios');
var request_url  = 'http://127.0.0.1:3000/api';

var UserCreatedSMS = function(context,company,user){
    console.log("send sms");
    axios.post(request_url+'/send/text/sms',{user:user,context:context,company:company}).then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        // console.log(error);
      });
}


eventEmitter.on('UserCreatedSMS',UserCreatedSMS);
module.exports = eventEmitter;

