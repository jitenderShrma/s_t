'use strict';


var mongoose = require('mongoose');
var Log = mongoose.model('Log');

function addLog(req,res){

    // console.log(res.locals.log);

    // res.locals.log = ({by:"system",system_notes:"Unauthorized Request for Companies",context:"error",visibility:"yes"});


        // Log.create({
        //     by: res.locals.log.by,
        //     system_notes: res.locals.log.system_notes,
        //     context: res.locals.log.context,
        //     visibilty: res.locals.log.visibilty,
        //     user_notes: "user_notes",
        // },
        // function(err,log){
        //     if(err)
        //         console.log("error");
        //     console.log("Log Added");       
        // });
}

module.exports = addLog;