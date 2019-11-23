function VerifySuperUser(req,res,next){
    if(req.session.user){
        next();
    }
    else{
        res.json({auth:false});
    }
}

module.exports = VerifySuperUser;