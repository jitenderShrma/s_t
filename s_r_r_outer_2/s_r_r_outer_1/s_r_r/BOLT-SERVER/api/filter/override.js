function OverRide(a1,b1) {
    var result_array = [];
    var arr = b1.concat(a1);
    var len = arr.length;
    var assoc = {};


    while(len--) {
        var item = arr[len];
        if(!assoc[item.module_name]) 
        { 
            result_array.unshift(item);
            assoc[item.module_name] = true;
        }
    }

    return result_array;
}

module.exports = OverRide;