function ReadPermission(req,res,next){

    if(req.session.user){
        next();
    }
    else{
        if(res.locals.check_permission.read == true){
            next();
        }
        else{
            res.json({auth:false,message:"You Dont Have Read Access to this Module"});
        }
    }

}

module.exports = ReadPermission;