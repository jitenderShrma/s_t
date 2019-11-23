var mongoose = require('mongoose');
var Staff = mongoose.model('Staff');

var _ = require('lodash');




function UsersAtDesignation(req,res,next){
    var designations = res.locals.linemangers;
    var users = [];
    var settings = res.locals.bud_settings;
    var amount = [settings.level1.amount,settings.level2.amount,settings.level3.amount,settings.level4.amount,settings.level5.amount];
    function AsyncLoop(i,cb){
        if(i<designations.length){
            if(designations[i]){
                Staff.find({designation:designations[i],user:{$exists:true,$ne:null}}).populate('user designation department').exec(function(err,staffs){
                    if(err){
                        res.send(err);
                    }else{
                        users[i] = _.reject(staffs,['user', null]);
                        AsyncLoop(i+1,cb);
                    }
                });
            }else{
                AsyncLoop(i+1,cb);
            }

        }else{
            cb();
        }
    }AsyncLoop(0,function(){
        console.log("loop ends");
        // console.log(amount);
        res.json({users:users,amount:amount});
    
        // console.log(users);
    });



}


module.exports = UsersAtDesignation;
