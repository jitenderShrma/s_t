function VerifyModuleName_vendor(req,res,next){
    if(req.params.moduleName == "vendor"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_vendor;
