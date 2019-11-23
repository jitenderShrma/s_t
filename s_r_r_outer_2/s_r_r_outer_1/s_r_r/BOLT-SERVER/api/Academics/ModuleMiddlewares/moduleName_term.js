function VerifyModuleName_term(req,res,next){
    if(req.params.moduleName == "term"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_term;