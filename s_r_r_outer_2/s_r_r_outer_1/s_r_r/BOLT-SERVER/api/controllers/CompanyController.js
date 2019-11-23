'use strict';


var mongoose = require('mongoose');
var Company = mongoose.model('Company');

var encrypt = require('../../license/encrypt');

// CREATE A COMPANY
exports.create_a_Company = function(req, res, next) {
    if(req.session.user){
        var license = encrypt.decrypt();
        Company.countDocuments({super_user:req.session.user},function(err,count){
         if(err){
             res.send(err);
         }
         else{
             if(count < parseInt(license.companies_allowed)){
                Company.create({
                    super_user : req.session.user,
                    company_name : req.body.company_name,
                    company_type : req.body.company_type,
                    add_attributes : req.body.add_attributes,
                    address : req.body.address,
                    vendors : req.body.vendors,
                    labels : req.body.labels
                },
                function(err, company) {
                    if(err) return res.status(500).send(err);
                    // res.locals.customs = true;
                    res.json(company);
                });
             }
             else{
                 res.json({limit:"exceeded"});
             }
         }
    });
  }
    else{
        res.send({auth:false});
    } 
};


// GET All COMPANIES

exports.get_all_Companies = function(req,res,next){

    if(req.session.user){
        Company.find({super_user:req.session.user},function(err,company){
            if(err)
                res.send(err);
            res.json(company);  
            next();
        });  
    }
    else{
        
        res.locals.log = ({by:"system",system_notes:"Unauthorized Request for Companies",context:"error",visibility:"yes"});
        res.send({auth:false});  
        next(); 
    }  
};


//GET A COMPANY

exports.get_a_company = function(req,res,next){
    if(req.session.user || req.session.subuser){
        Company.findOne({_id:req.params.companyId},function(err,company){
            if(err)
                res.send(err);
            req.session.company = req.params.companyId;                   
            res.json(company); 
        });
    }
    else{
        res.send({auth:false});
    }
};


// UPDATE A COMPANY DETAILS

exports.update_a_Company = function(req,res,next){
    if(req.session.user || req.session.subuser){
        Company.findOneAndUpdate({_id:req.params.companyId},req.body,{new: true, runValidators:true},function(err,company){
            if(err)
                res.send(err);
             res.json(company);    
             next();
        });
    }
    else{
        res.send({auth:false});
    }
};


//DELETE A COMPANY DETAILS

exports.delete_a_Company = function(req,res,next){
    if(req.session.user){
        Company.findOneAndDelete({super_user:req.session.user,_id:req.params.companyId},function(err,company){
            if(err)
                res.send(err);
             res.json({message:"Company Successfully Deleted"});  
             next();
        });
    }
    else{
        res.send({auth:false});
    }
};


