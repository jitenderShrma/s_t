function DeleteOwnPermission(req,res,next){
    var moduleName = req.params.moduleName;
    res.locals.add_delete_own_permission = true;
    if(req.session.user){
        next();
    }else if(req.session.subuser){
        if(req.session.additional_permissions.length == 0){
            res.locals.add_delete_own_permission = true;
            next();
        }else{
            for(var i =0;i<req.session.additional_permissions.length;i++){
                if(req.session.additional_permissions[i].module_name == moduleName){
                   if(req.session.additional_permissions[i].delete_own == false){
                       res.locals.add_delete_own_permission = false;
                       break;
                   }
                }
            }
            next();


        }  
    }

}

module.exports = DeleteOwnPermission;