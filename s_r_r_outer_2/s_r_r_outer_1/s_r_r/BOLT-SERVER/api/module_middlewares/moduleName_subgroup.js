function VerifyModuleName_subgroup(req,res,next){
    if(req.params.moduleName == "subgroup"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_subgroup;