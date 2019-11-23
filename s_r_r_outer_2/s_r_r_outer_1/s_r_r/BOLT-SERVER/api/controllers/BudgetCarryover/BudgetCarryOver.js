'use strict';  
var mongoose = require('mongoose');
var Heads = mongoose.model('Heads');
var CarryOver = mongoose.model('CarryOverLog');

exports.carry_over_all_heads = function(req,res,next){
    var from_month = parseInt(req.body.from_month);
    var dest_month;
    var flag = 0;
    if(from_month == 11){
        dest_month = 0;
    }else{
        dest_month = from_month+1;
    }
    Heads.find({}).exec(function(err,heads){
        if(heads.length>0){
            function AsyncLoop(i,cb){
                if(i<heads.length){
                    var amount_left = heads[i].amount_left;
                    var permissible_values = heads[i].permissible_values;
                    var carry_over_amount;
                    if(heads[i].carry_over_amount == undefined){
                        carry_over_amount = [0,0,0,0,0,0,0,0,0,0,0,0];
                    }else{
                        carry_over_amount = heads[i].carry_over_amount;
                    }
                    permissible_values[dest_month] = permissible_values[dest_month]+amount_left[from_month];
                    amount_left[dest_month] = amount_left[dest_month]+amount_left[from_month];
                    carry_over_amount[dest_month] = carry_over_amount[dest_month]+amount_left[from_month];
                    amount_left[from_month] = 0;
                    Heads.findOneAndUpdate({_id:heads[i]._id},{$set:{permissible_values:permissible_values,amount_left:amount_left,carry_over_amount:carry_over_amount}},{new:true}).exec(function(err,updated_head){
                        if(err){
                            console.log(err);
                            AsyncLoop(i+1,cb);
                        }else{
                            flag = flag + 1;
                            AsyncLoop(i+1,cb);
                        }
                    });
                }else{
                    cb();
                }
            }AsyncLoop(0,function(){
                console.log("Carry Over Successful");
                console.log("updated heads "+flag);
                res.json({message:`Carry Over Successful ${flag} heads updated`});
                next();
            });
        }
    });
};


//Log Middleware

exports.create_a_carry_over_log = function(req,res,next){
    var user_type;
    if(req.session.user){
        user_type = 'Super_User';
    }else{
        user_type = 'User';

    }
    CarryOver.create({
        company:req.session.company,
        from_month:parseInt(req.body.from_month),
        dest_month:parseInt(req.body.from_month)+1,
        user:req.session.subuser || req.session.user,
        user_type:user_type,
        log:[{
            date:Date.now(),
            event:"Budget Carry Forward Done!"
        }]
    },function(err,carry_over){
        if(err){
            console.log(err);
        }else{
            console.log("carry over log added");
        }
    });
};
