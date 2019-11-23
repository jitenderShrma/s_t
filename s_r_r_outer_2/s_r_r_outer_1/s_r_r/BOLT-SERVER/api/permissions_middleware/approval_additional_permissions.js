function ApprovalAdditionalPermissions(req,res,next){
    if(req.session.user){
        next();
    }
    else if(req.session.subuser){
        var approval_permission = req.session.approval_permissions;
        if(approval_permission.by_department.status == true){
            console.log("by Dept");
            next();
        }else if(approval_permission.by_heads.status == true){
            var head = approval_permission.by_heads.allowed_heads.includes(req.body.budget_head);
            if(head == true){
                next();
            }else{
                res.send({message:"You are not allowed to add approval for this head"});
            }
        }
    }
}

module.exports = ApprovalAdditionalPermissions;