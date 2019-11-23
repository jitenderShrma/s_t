'use strict';
var mongoose = require('mongoose');
var Heads = mongoose.model('Heads');
var csvToJson = require('convert-csv-to-json');
const ConvertKeys = require('../../filter/convertKeys');

var file;

//import a head
exports.import_all_heads = function(req,res,next){
    file = req.file;
    let json2 = csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
    let json = ConvertKeys(json2);
    // console.log(json);
    var count = Object.keys(json).length;
    // console.log(count);
    function AsyncLoop2(i,call){
        if(i<count){
            var head_name = json[i].headname;
            var head_key = json[i].headkey;
            var parent_head_key = json[i].parentheadkey;
            Heads.findOne({head_key:parent_head_key}).exec(function(err,parenthead){
                if(parenthead){
                    Heads.updateMany({tree_id:parenthead.tree_id,lft:{$gt:parenthead.rgt}},{$inc:{lft:2}}).exec(function(err,querylft){
                        Heads.updateMany({tree_id:parenthead.tree_id,rgt:{$gte:parenthead.rgt}},{$inc:{rgt:2}}).exec(function(err,queryrgt){
                            Heads.create({
                                company:req.session.company,
                                tree_id:parenthead.tree_id,
                                name:head_name,
                                head_key:head_key,
                                parent_head:parenthead._id,
                                lft:parenthead.rgt,
                                rgt:parenthead.rgt+1
                            },function(err,childhead){
                                if(err){

                                }else{
                                    console.log("childhead created");
                                    AsyncLoop2(i+1,call);
                                }
                            });
                        });
                    });
                }else if(!parenthead){
                    Heads.create({
                        company:req.session.company,
                        tree_id:head_name,
                        name:head_name,
                        head_key:head_key
                    },function(err,createdhead){
                        if(err){
                            res.send(err);
                        }else if(createdhead){
                            AsyncLoop2(i+1,call);
                        }
                    });
                }
            });
        }else{
            call();
        }
    }AsyncLoop2(0,function(){
        res.json(json);
        
    });
    
};