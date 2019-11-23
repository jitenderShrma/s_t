// 404 page


exports.not_found = function(req,res,next){
    res.status(404).send("404 NOT FOUND");
}