function VerifyModuleName_budtrans(req,res,next){
    if(req.params.moduleName == "budtrans"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_budtrans;