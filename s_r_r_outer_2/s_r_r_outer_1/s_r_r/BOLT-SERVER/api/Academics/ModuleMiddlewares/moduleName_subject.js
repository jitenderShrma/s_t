function VerifyModuleName_subject(req,res,next){
    if(req.params.moduleName == "subject"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_subject;