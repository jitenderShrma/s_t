'use strict';


var mongoose = require('mongoose');
var Transaction = mongoose.model('Transaction');
var csvToJson = require('convert-csv-to-json');
var Heads = mongoose.model('Heads');
var Approvals = mongoose.model('Approvals');
var User = mongoose.model('User');
var Transaction = mongoose.model('Transaction');




var file;

var head_key = [];
var month = [];
var amount = [];
var requested_by = [];
var user_id = [];
var vendor_id = [];
var notes = [];


exports.import_a_transaction = function(req,res,next){
    file = req.file;
    let json = csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);

    for(let i =0;i<json.length;i++){
        head_key[i] = json[i].Headkey;
        requested_by[i] = json[i].Requestedby;
        var month_name = json[i].Month;
        amount[i] = json[i].Amount || json[i].amount;
        vendor_id[i] = json[i].VendorID || undefined;
        notes[i] = json[i].Notes;
        if(month_name == "Jan" || month_name == "January"){
            month[i] = 0;
        }if(month_name == "Feb" || month_name == "February"){
            month[i] = 1;
        }if(month_name == "Mar" || month_name == "March"){
            month[i] = 2;
        }if(month_name == "Apr" || month_name == "April"){
            month[i] = 3;
        }if(month_name == "May" || month_name == "may"){
            month[i] = 4;
        }if(month_name == "Jun" || month_name == "June"){
            month[i] = 5;
        }if(month_name == "Jul" || month_name == "July"){
            month[i] = 6;
        }if(month_name == "Aug" || month_name == "August"){
            month[i] = 7;
        }if(month_name == "Sep" || month_name == "September"){
            month[i] = 8;
        }if(month_name == "Oct" || month_name == "October"){
            month[i] = 9;
        }if(month_name == "Nov" || month_name == "November"){
            month[i] = 10;
        }if(month_name == "Dec" || month_name == "December"){
            month[i] = 11;
        }
        (function(i){
            function AsyncLoop(j,cb){
                if(j<=1){
                    Heads.findOne({head_key:head_key[i]}).exec(function(err,head){
                        if(err){
                            res.send(err);
                        }else if (head == null){
                            AsyncLoop(j+1,cb);
                            
                        }else if(head){
                            if(head.amount_left.length > 0){
                                head.amount_left[month[i]] =  head.amount_left[month[i]] - amount[i];
                                Heads.findOneAndUpdate({_id:head._id},{$set:{amount_left:head.amount_left}},{new:true}).exec(function(err,head2){
                                    if(err){
                                        res.send(err);
                                    }else{
                                        console.log("head Updated");
                                        User.findOne({user_name:requested_by[i]}).exec(function(err,user){
                                            if(err){
                                                res.send(err);
                                            }else if(!user){
                                                user_id[i] = undefined;
                                                console.log("user not found");
                                                AsyncLoop(j+1,cb);
                                            }else{
                                                user_id[i] = user._id;
                                                var d = new Date();
                                                var year = d.getFullYear().toString().slice(2,4);
                                                Approvals.create({
                                                    company:req.session.company,
                                                    request_by: user_id[i],
                                                    budget_head:head._id,
                                                    year:year,
                                                    month:month[i],
                                                    amount:amount[i],
                                                    status:"APPROVED",
                                                },function(err,approval){
                                                    if(err){
                                                        res.send(err);
                                                    }else{
                                                        var str = approval.unique_id.toString();
                                                        var pad = "0000";
                                                        var ans = pad.substring(0, pad.length - str.length) + str;  
                                                        var month_abc = (parseInt(approval.month,10)+1).toString();
                                                        var pad2 = "00";
                                                        var mon_ans = pad2.substring(0,pad2.length - month_abc.length)+month_abc;
                                                        var uniqueid = mon_ans+approval.year.toString()+ans; 
                                                        // res.json({message:uniqueid});

                                                        (function(my_id,unique_id){
                                                            function AsyncLoop2(k,cb){
                                                                if(k<=1){
                                                                    Approvals.findByIdAndUpdate({_id:my_id},{ref_id:unique_id},{new:true}).exec(function(err,app2){
                                                                        if(err){
                                                                            res.send(err);
                                                                        }else{
                                                                            AsyncLoop2(k+1,cb);
                                                                        }

                                                                    });

                                                                }else{
                                                                    cb();
                                                                }
                                                            }AsyncLoop2(1,function(){
                                                                console.log("Loop 2 ended");
                                                                Transaction.create({
                                                                    company:req.session.company,
                                                                    transaction_type:"One Time",
                                                                    user:user_id[i],
                                                                    head:head._id,
                                                                    month:month[i],
                                                                    amount:amount[i],
                                                                    vendor:vendor_id[i],
                                                                    isApproved:true,
                                                                    notes:notes[i],
                                                                    status:"APPROVED",
                                                                    approvalCode:unique_id,
                                                                },function(err,transaction){
                                                                    if(err){
                                                                        res.send(err);
                                                                    }else if(transaction){
                                                                        AsyncLoop(j+1,cb);
                                                                    }
                                                                });
                                                                // AsyncLoop(j+1,cb);
                                                                // res.json({message:"Approval Added"});
                                                            });

                                                        })(approval._id,uniqueid);
                                                 }

                                                });
                                            }
                                        });
                                    }
                                });
                            }else{
                                AsyncLoop(j+1,cb);
                            }
                        }
                    });
                }else{
                    cb();
                }
            }AsyncLoop(1,function(){
                console.log("BIG Loop ended");
                if(i == json.length-1){
                    res.json({message:"Transaction Imported"});
                }
            });

        })(i);

    }

}