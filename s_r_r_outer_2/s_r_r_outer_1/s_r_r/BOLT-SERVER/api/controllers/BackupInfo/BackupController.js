'use strict';

var mongoose = require('mongoose');
var Backup = mongoose.model('Backup');
const exec = require('child_process').exec;

var path = "http://127.0.0.1:3000/dataBackup/";

const fs = require('fs');

var bat = require.resolve('./Backup.bat');

const zipFolder = require('zip-a-folder');
exports.create_a_backup = function(req,res,next){
    var user_type;
    if(req.session.user){
        user_type = "Super_User";
    }else{
        user_type = "User";
    }
    exec(bat,function(err,stdout,stderr){
        if(err){
            console.log(err);
        }else{
            var dir = stdout.split("mkdir ")
            console.log(dir[1]);
            var final_path = dir[1].slice(0,16);
            var dir_path = `${path}${final_path}`
            console.log(dir_path);
            Backup.create({
                user:req.session.subuser || req.session.user,
                user_type:user_type,
                backup_name:final_path,
                path:dir_path
            },function(err,backup){
                if(backup){
                    zipFolder.zipFolder(`dataBackup/${final_path}`,`zip/${final_path}.zip`,function(err,buffer){
                        if(err){
                            console.log(err);
                        }else{
                            res.json(backup);
                        }
                    });
                }
            });
        }
    });
};


exports.download_a_backup = function(req,res,next){
    Backup.findOne({_id:req.params.backupId}).exec(function(err,backup){
        if(err){
            console.log(err);
        }else{
            var file = `zip/${backup.backup_name}.zip`;
            res.download(file);
        }
    });

};