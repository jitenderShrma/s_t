function ObjectOverRide(a1,b1){
    if(a1.by_heads.status == true){
        return a1;
    }else{
        return b1;
    }
}

module.exports = ObjectOverRide;