'use strict';

var mongoose = require("mongoose");
var Student = mongoose.model('Student');
var bcrypt = require('bcryptjs');


var fs = require('fs');



//find all Student
exports.find_all_students = function(req,res,next){
    Student.find({},function(err,student){
        if(err){
            res.send(err);
        }else{
            res.json(student);
        }
    });
};

//Update a Student
exports.update_a_student = function(req,res,next){
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    Student.findOne({_id:req.params.studentId}).exec(function(err,student){
        if(req.session.subuser || req.session.user){
            Student.findOneAndUpdate({_id:req.params.studentId},req.body,{new:true}).exec(function(err,updated){
                if(err){
                    console.log(err);
                }else{
                    res.json({message:"Student Updated"});
                }
            });
        }else if(req.session.student == student._id){
            Student.findOneAndUpdate({_id:req.params.studentId},req.body,{new:true}).exec(function(err,updated){
                if(err){
                    console.log(err);
                }else{
                    res.json({message:"Student Updated"});
                }
            });
        }else{
            res.json({message:"You are not Authorized"});
        }
    });
};



//Create a Student
exports.create_a_student = function(req,res,next){
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var str = req.file.path;
    str = str.replace(/\\/g,"/");
    console.log(str);
    Student.create({
        company:req.session.company,
        programme:req.body.programme,
        academic_term:req.body.academic_term,
        section:req.body.section,
        user_name:req.body.user_name.toLowerCase(),
        password:hashedPassword,
        personal_details:{
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            profile_pic:str,
            father_details:{
                fname:req.body.father_name,
                contact:req.body.father_contact
            },
            mother_details:{
                mname:req.body.mother_name,
                contact:req.body.mother_contact
            },
            guardian_details:{
                name:req.body.guardian_name,
                relation:req.body.guardian_relation,
                contact:req.body.guardian_contact,
                address:req.body.guardian_addresss
            },
            current_address:req.body.current_address,
            correspondence_address:req.body.correspondence_address
        }
    },function(err,student){
        if(err){
            res.send(err);
        }else{
            res.json(student);
        }
    });
};



// Login student 

exports.login_a_student = function(req,res,next){
    var user_name = req.body.user_name.toLowerCase();
    Student.findOne({user_name:user_name}).exec(function(err,student){
        if(err){
            res.status(500).send("Error on the server");
        }else if(student == null){
            res.status(404).send("No User Found");
        }else if(student){
            var passwordISValid = bcrypt.compareSync(req.body.password, student.password);
            if(!passwordISValid){
                res.status(401).send({auth:false,message:"Invalid Password"});
            }else{
                req.session.student = student._id;
                req.session.company = student.company;
                res.json(student);
            }
        }
    })
};


// Logout a User
exports.logout_a_student = function(req,res,next){
    req.session.destroy(function(err){
        if(err){
            res.send(err);
            console.log(err);
        }else{
            res.status(200).send('Logout successful');
        }
    });
};


//find A student 
exports.view_a_student = function(req,res,next){
    Student.findOne({_id:req.params.studentId}).exec(function(err,student){
        if(err){
            res.send(err);
        }else{
            res.json(student);
        }
    });

};


//change user profile picture
exports.update_profile_pic = function(req,res,next){
    console.log("update profile pic");
    Student.findOne({_id:req.params.studentId}).exec(function(err,student){
        if(err){
            res.send(err);
        }else{
            var filePath = student.personal_details.profile_pic;
            var str = req.file.path;
            str = str.replace(/\\/g,"/");
            Student.findOneAndUpdate({_id:req.params.studentId},{$set:{'personal_details.profile_pic':str}}).exec(function(err,updated){
                if(err){
                    res.send(err);
                }else{
                    fs.unlink(filePath,function(err){
                        if(err){
                            res.send(err);
                        }else{
                            res.json({message:"updated profile pic"});
                        }
                    });
                }
            });
            
        }

    });

};


//delete a Students
exports.delete_a_student = function(req,res,next){
    Student.findOneAndDelete({_id:req.params.studentId}).exec(function(err,student){
        if(err){
            res.send(err);
        }else{
            var filePath = student.personal_details.profile_pic;
            fs.unlink(filePath,function(err){
                if(err){
                    res.send(err);
                }else{
                    res.json({message:"Student Deleted Succesfully"});
                }
            });

        }
    });
};

