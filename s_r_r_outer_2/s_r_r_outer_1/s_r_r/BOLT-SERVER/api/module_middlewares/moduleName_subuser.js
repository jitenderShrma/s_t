function VerifyModuleName_subuser(req,res,next){
    if(req.params.moduleName == "subuser"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_subuser;