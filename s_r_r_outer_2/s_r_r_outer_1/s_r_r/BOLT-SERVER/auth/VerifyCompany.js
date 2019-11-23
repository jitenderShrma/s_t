function VerifyCompany(req,res,next){
    if(req.session.company){
        next();
    }
    else{
        res.json({auth:false});
    }
}

module.exports = VerifyCompany;