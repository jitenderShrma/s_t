function VerifyModuleName_student(req,res,next){
    if(req.params.moduleName == "student"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_student;