function VerifyModuleName_dept(req,res,next){
    if(req.params.moduleName == "dept"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_dept;