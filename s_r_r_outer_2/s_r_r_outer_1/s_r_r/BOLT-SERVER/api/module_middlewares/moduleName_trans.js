function VerifyModuleName_trans(req,res,next){
    if(req.params.moduleName == "trans"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_trans;