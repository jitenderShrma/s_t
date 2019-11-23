function VerifyModulePermission(req,res,next){
    var check_permission;
    var moduleName = req.params.moduleName;
    if(req.session.user){
        next();
    }
    else if(req.session.subuser){   
        for(var i = 0;i<req.session.permissions.length;i++){
            if(req.session.permissions[i].module_name == moduleName){
                check_permission = req.session.permissions[i];
                break;
            }
        } 
        res.locals.check_permission = check_permission;
        next();
    }
    else{
        res.json({auth:false,message:"Not Logged in"});
    }
}

module.exports = VerifyModulePermission;