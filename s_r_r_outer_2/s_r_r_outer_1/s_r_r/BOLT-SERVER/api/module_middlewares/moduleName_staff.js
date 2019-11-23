function VerifyModuleName_staff(req,res,next){
    if(req.params.moduleName == "staff"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_staff;