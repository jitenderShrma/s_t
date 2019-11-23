function VerifyModuleName_desig(req,res,next){
    if(req.params.moduleName == "desig"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_desig;