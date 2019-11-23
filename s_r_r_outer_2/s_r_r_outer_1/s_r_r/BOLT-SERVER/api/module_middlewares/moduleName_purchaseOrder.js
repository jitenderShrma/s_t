function VerifyModuleName_purchaseOrder(req,res,next){
    if(req.params.moduleName == "purchaseOrder"){
        next();
    }
    else{
        res.json({auth:false,message:"BAD REQUEST"});
    }
}

module.exports = VerifyModuleName_purchaseOrder;