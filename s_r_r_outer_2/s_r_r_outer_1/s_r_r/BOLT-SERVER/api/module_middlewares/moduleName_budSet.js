function VerifyModuleName_budSet(req,res,next){
    if(req.params.moduleName == "budSet"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_budSet;