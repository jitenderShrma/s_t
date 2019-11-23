function VerifyModuleName_preApp(req,res,next){
    if(req.params.moduleName == "preApp"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_preApp;