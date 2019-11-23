function VerifyModuleName_bill(req,res,next){
    if(req.params.moduleName == "bill"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_bill;