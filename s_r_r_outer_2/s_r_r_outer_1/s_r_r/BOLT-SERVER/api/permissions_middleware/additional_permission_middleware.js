function AdditionalPermissions(req,res,next){
    var moduleName = req.params.moduleName;
    res.locals.add_read_all_permission = false;
    if(req.session.user){
        next();
    }else if(req.session.subuser){
        if(req.session.additional_permissions.length == 0){
            res.locals.add_read_all_permission = false;
            next();
        }else{
            for(var i =0;i<req.session.additional_permissions.length;i++){
                if(req.session.additional_permissions[i].module_name == moduleName){
                   if(req.session.additional_permissions[i].read_all == true){
                       res.locals.add_read_all_permission = true;
                       break;
                   }
                }
            }
            next();


        }  
    }

}

module.exports = AdditionalPermissions;