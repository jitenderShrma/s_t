function VerifyModuleName_label(req,res,next){
    if(req.params.moduleName == "label"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_label;