function VerifyModuleName_company(req,res,next){
    if(req.params.moduleName == "company"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_company;