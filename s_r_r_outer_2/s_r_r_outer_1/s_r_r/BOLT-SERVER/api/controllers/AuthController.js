'use strict';


var mongoose = require('mongoose');
var SuperUser = mongoose.model('Super_User');
var Company = mongoose.model('Company');


// JWT
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config');



// REGISTER A USER




exports.create_a_Super_User =  function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  SuperUser.create({
    user_name : req.body.user_name,
    email : req.body.email,
    phone : req.body.phone,
    password : hashedPassword,
    communications:req.body.communications,
  },
  function (err, user) {
    if (err) return res.status(500).send(err);

    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });
};


// USER


exports.get_a_Super_User = function(req,res){

  SuperUser.findById(req.userId,{password: 0 },function(err,user){
    if(err)
      return res.status(500).send("There was a problem finding the user.");
    if(!user)
      return res.status(404).send("No user found");
      
     res.status(200).send(user);   
  });
};

// LOGIN


exports.login_a_user = function(req,res,next){
  
  SuperUser.findOne({ user_name: req.body.user_name.toLowerCase() }, function (err, user) {
    if (err) {
      return res.status(500).send('Error on the server.');
   }
    if(!user){
      // return res.status(404).send('No user found.');
      next();
  }else if(user){
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    Company.findOne({super_user:user._id}).exec(function(err,company){
      if(err){
        res.send(err);
      }else{
        req.session.user = user._id;
        req.session.comms = user.communications;
        req.session.company = company._id;
        res.status(200).send({ auth: true, token: token, user: req.session.user,comms:req.session.comms});

      }

    });
}      
  });

};

//LOGOUT

exports.logout_a_user = function(req,res){


  if(req.session.user){
    req.session.destroy((err)=>{
      if(err){
        res.send(err);
      }
      res.status(200).send({auth:false, token: null});
    });
  }
  else{
    res.json({auth:false});
  }

 
  
};


//UPDATE

exports.update_a_user = function(req,res){

  if(req.session.user){
    SuperUser.findOneAndUpdate({_id: req.params.superId}, req.body, {new: true, runValidators:true}, function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
  }
  else{
    res.send({auth:false});
  }
};


//DELETE


exports.delete_a_user = function(req,res){

  if(req.params.superPassword == '1234Qwerty!'){
    SuperUser.findByIdAndDelete({_id: req.params.superId},function(err,user){
      if(err)
        res.send(err);
      res.json(user);  
    });
  }
  else{
    res.send({auth:false,message:"F*ck You NOOB"});
  }

 
};


//GET SUPER USER SETTINGS

exports.get_super_settings = function(req,res,next){
  SuperUser.findOne({_id:req.session.user},function(err,settings){
    if(err)
      res.send(err);
    res.json(settings.communications);  

  });

};
