function VerifyModuleName_programme(req,res,next){
    if(req.params.moduleName == "programme"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_programme;