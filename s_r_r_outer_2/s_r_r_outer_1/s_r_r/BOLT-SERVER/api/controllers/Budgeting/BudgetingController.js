'use strict';

var mongoose = require("mongoose");
var Budgeting = mongoose.model('Budgeting');
var Department = mongoose.model('Department');
var Heads = mongoose.model('Heads');
var Labels = mongoose.model('Label');
var csvToJson = require('convert-csv-to-json');
var file;

var permissible_amount = [];



var acc_head = [];
// var eventEmitter = require('../axios_Controller/budget_axios');


// CREATE A BUDGET
exports.read_a_csv_quaterly = function(req,res,next){
    var upload_log = [];
    var flag = 0;
    var year = req.body.year;
    file = req.file;
    let json = csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
    let json2 = csvToJson.formatValueByType().getJsonFromCsv(file.path);
    // console.log(json);
    function AsyncLoop(i,cb){
        if(i<json.length){  
        var head_key = json[i].HeadKey;
        var acc_head = json[i].AccountingHead;
        permissible_amount[i] = [];
        if(req.body.import_setting == "Q"){
            permissible_amount[i][0] = json[i].Q1 || 0;
            permissible_amount[i][1] = json[i].Q2 || 0;
            permissible_amount[i][2] = json[i].Q3 || 0;
            permissible_amount[i][3] = json[i].Q4 || 0;
        }else if(req.body.import_setting == "M"){
            if(json[i].Q1 != null && json[i].Q2 !=null && json[i].Q3 !=null && json[i].Q4 !=null){
                    res.send({error:"Wrong input for Monthly Setting"});
                    console.log("wrong");
                    AsyncLoop(i+1,cb);
            }else{
            permissible_amount[i][0] = json[i].Jan || json[i].jan || 0;
            permissible_amount[i][1] = json[i].Feb || json[i].feb || 0;
            permissible_amount[i][2] = json[i].Mar || json[i].mar || 0;
            permissible_amount[i][3] = json[i].Apr || json[i].apr || 0;
            permissible_amount[i][4] = json[i].May || json[i].may || 0;
            permissible_amount[i][5] = json[i].Jun || json[i].jun || 0;
            permissible_amount[i][6] = json[i].Jul || json[i].jul || 0;
            permissible_amount[i][7] = json[i].Aug || json[i].aug || 0;
            permissible_amount[i][8] = json[i].Sep || json[i].sep || 0;
            permissible_amount[i][9] = json[i].Oct || json[i].oct || 0;
            permissible_amount[i][10] = json[i].Nov || json[i].nov || 0;
            permissible_amount[i][11] = json[i].Dec || json[i].dec || 0;
            // console.log(permissible_amount[i]);
            Heads.findOneAndUpdate({head_key:head_key},{$set:{permissible_values:permissible_amount[i],amount_left:permissible_amount[i]},accounting_head:acc_head,year:year},{new:true}).exec(function(err,head){
                if(err){
                    console.log(err);
                }else if(head){
                    flag = flag+1;
                    upload_log[i] = `${i} uploaded Successfully`;
                    AsyncLoop(i+1,cb);     
                }else{
                    console.log("head not found");
                    upload_log[i] = `${i} head NOT found`;
                    AsyncLoop(i+1,cb);
                }
            });     
        }
    }
}else{
    cb();
}
}AsyncLoop(0,function(){
        console.log("Upload finished");
        console.log(flag + " records added");
        res.json({message:"Uploaded successfully"});
});
    // for(let i=0; i<json.length;i++){
    //      console.log(json.length);
    //      head_key[i] = json[i].HeadKey;
    //      permissible_amount[i] = [];
    //      if(req.body.import_setting == "Q"){
    //         permissible_amount[i][0] = json[i].Q1;
    //         permissible_amount[i][1] = json[i].Q2;
    //         permissible_amount[i][2] = json[i].Q3;
    //         permissible_amount[i][3] = json[i].Q4;
    //     }else if(req.body.import_setting == "M"){
    //             if(json[i].Q1 != null && json[i].Q2 !=null && json[i].Q3 !=null && json[i].Q4 !=null){
    //                 res.send({error:"Wrong input for Monthly Setting"});
    //                 console.log("wrong");
    //                 break;
    //         }

    //         permissible_amount[i][0] = json[i].Jan || json[i].jan || 0;
    //         permissible_amount[i][1] = json[i].Feb || json[i].feb || 0;
    //         permissible_amount[i][2] = json[i].Mar || json[i].mar || 0;
    //         permissible_amount[i][3] = json[i].Apr || json[i].apr || 0;
    //         permissible_amount[i][4] = json[i].May || json[i].may || 0;
    //         permissible_amount[i][5] = json[i].Jun || json[i].jun || 0;
    //         permissible_amount[i][6] = json[i].Jul || json[i].jul || 0;
    //         permissible_amount[i][7] = json[i].Aug || json[i].aug || 0;
    //         permissible_amount[i][8] = json[i].Sep || json[i].sep || 0;
    //         permissible_amount[i][9] = json[i].Oct || json[i].oct || 0;
    //         permissible_amount[i][10] = json[i].Nov || json[i].nov || 0;
    //         permissible_amount[i][11] = json[i].Dec || json[i].dec || 0;
    //     }
    //      acc_head[i] = json[i].AccountingHead;
    //      (function(i){
    //         function asyncLoop(j,cb){
    //             if(j<=1){
    //                 Heads.findOneAndUpdate({head_key:head_key[i]},{$set:{permissible_values:permissible_amount[i],amount_left:permissible_amount[i]},accounting_head:acc_head[i],year:year},{new:true}).exec(function(err,head){
    //                     if(err){
    //                         // res.send(err);
    //                         console.log(err);
    //                     }else if(head==null){
    //                         console.log("Head not Found");
    //                         asyncLoop(j+1,cb);
    //                     }
    //                     else{
    //                         // res.json(head);
    //                         flag = flag+1;
    //                         asyncLoop(j+1,cb);
    //                     }

    //                 });
    //             }else{
    //                 cb();
    //             }
            
               
   
    //         }asyncLoop(1,function(){
    //             if(i == json.length-1){
    //                 if(req.body.import_setting == "Q"){
    //                     res.redirect('/api/csv/read/Q');
    //             }else if(req.body.import_setting == "M"){
    //                     res.redirect('/api/csv/read/M');

    //             }
    //                 console.log(flag+" records inserted");
    //             }
    //         });

    //      })(i);       
    // }

        
};

exports.create_a_budget = function(req,res,next){
    Budgeting.create({},function(err,budget){
        if(err)
            res.send(err);
        res.json(budget);    


    });

};
