function VerifyModuleName_budtranSet(req,res,next){
    if(req.params.moduleName == "budtransSet"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_budtranSet;