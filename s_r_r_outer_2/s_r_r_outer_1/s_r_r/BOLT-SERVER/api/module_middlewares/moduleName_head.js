function VerifyModuleName_head(req,res,next){
    if(req.params.moduleName == "head"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_head;