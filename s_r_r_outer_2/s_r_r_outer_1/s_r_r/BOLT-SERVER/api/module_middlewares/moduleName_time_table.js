function VerifyModuleName_timetableplanner(req,res,next){
    if(req.params.moduleName == "timetableplanner"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_timetableplanner;