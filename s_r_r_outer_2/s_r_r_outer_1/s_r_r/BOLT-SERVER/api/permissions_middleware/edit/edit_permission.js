function EditPermission(req,res,next){

    if(req.session.user){
        next();
    }
    else{
        if(res.locals.check_permission.edit == true){
            next();
        }
        else{
            res.json({auth:false,message:"You Dont Have Edit Access to this Module"});
        }
    }

}

module.exports = EditPermission;