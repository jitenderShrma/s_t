function DeletePermission(req,res,next){

    if(req.session.user){
        next();
    }
    else{
        if(res.locals.check_permission.delete == true){
            next();
        }
        else{
            res.json({auth:false,message:"You Dont Have Delete Access to this Module"});
        }
    }

}

module.exports = DeletePermission;