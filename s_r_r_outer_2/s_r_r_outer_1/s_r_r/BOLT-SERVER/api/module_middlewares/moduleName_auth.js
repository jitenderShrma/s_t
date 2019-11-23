function VerifyModuleName_auth(req,res,next){
    if(req.params.moduleName == "auth"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_auth;