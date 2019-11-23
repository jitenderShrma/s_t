var mongoose = require('mongoose');
var User = mongoose.model('User');
var Staff = mongoose.model('Staff');
var Designation = mongoose.model('Designation');

// function LineManager(user_id,line_manager,user_designation){
//     var loopvalue;
//     if(line_manager == "LM1"){
//         loopvalue = 1;
//     }else if(line_manager == "LM2"){
//         loopvalue = 2;
//     }else if(line_manager == "LM3"){
//         loopvalue = 3;
//     }else if(line_manager == "LM4"){
//         loopvalue = 4;
//     }else if(line_manager == "LM5"){
//         loopvalue = 5;
//     }
//          function AsyncLoop(i){
//              if(i<loopvalue){
//                  return Designation.findOne({_id:user_designation}).exec(function(err,designation){
//                      if(designation.parent_designation_id == undefined){
//                          return AsyncLoop(i+1);
//                      }else{
//                          return AsyncLoop(i+1);
//                      }

//                  });
//              }else{
//                  return "XXX";
//              }
//                     // if(i<loopvalue){
//                     //     console.log("In loop");    
//                     //     if(user_designation){
//                     //         return Designation.findOne({_id:user_designation}).exec(function(err,designation){
//                     //             if(designation){
//                     //                 if(designation.parent_designation_id == undefined){
//                     //                     user_designation = undefined;
//                     //                     return AsyncLoop(i+1);
//                     //                 }else{
//                     //                     user_designation = designation.parent_designation_id;
//                     //                     return AsyncLoop(i+1);
//                     //                 }
//                     //             }else{
//                     //                 return AsyncLoop(i+1);
//                     //             }

//                     //         });
//                     //     }else{
//                     //         return AsyncLoop(i+1);
//                     //     }         
//                     // }else{
//                     //     return "XXX";
//                     // }         
//                 }
//             console.log("value returned");    
//             return AsyncLoop(0);           
// }


function LineManager(req,res,next){
    var user_settings = res.locals.bud_settings;
    // console.log(user_settings);
    var user_id = req.params.userId;
    var user_designation = res.locals.user_designation;
    var level1 = res.locals.bud_settings.level1.designation;
    var level2 = res.locals.bud_settings.level2.designation;
    var level3 = res.locals.bud_settings.level3.designation;
    var level4 = res.locals.bud_settings.level4.designation;
    var level5 = res.locals.bud_settings.level5.designation;
    var designations = [];


    function AsyncLoop2(j,loopvalue,my_desig,cb){
        // var my_desig = user_designation;
        if(j<loopvalue){
            if(my_desig){
                Designation.findOne({_id:my_desig}).exec(function(err,designation){
                    if(err){
                        res.send(err);
                    }else{
                        if(designation.parent_designation_id == undefined){
                               my_desig = undefined;
                               cb(my_desig);
                        }else{
                               my_desig = designation.parent_designation_id;
                               AsyncLoop2(j+1,loopvalue,my_desig,cb);
                            }
                    }

                });
            }

        }else{
            cb(my_desig);
        }
    }


    function AsyncLoop(i,cb){
        if(i<5){
            if(i == 0){
                if(level1){
                    console.log("level1");
                    if(level1 == "LM1"){
                        var loopvalue = 1;
                        AsyncLoop2(0,loopvalue,user_designation,function(level1desig){
                            designations[0] = level1desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level1 == "LM2"){
                        var loopvalue = 2;
                        AsyncLoop2(0,loopvalue,user_designation,function(level1desig){
                            designations[0] = level1desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level1 == "LM3"){
                        var loopvalue = 3;
                        AsyncLoop2(0,loopvalue,user_designation,function(level1desig){
                            designations[0] = level1desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level1 == "LM4"){
                        var loopvalue = 4;
                        AsyncLoop2(0,loopvalue,user_designation,function(level1desig){
                            designations[0] = level1desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level1 == "LM5"){
                        var loopvalue = 5;
                        AsyncLoop2(0,loopvalue,user_designation,function(level1desig){
                            designations[0] = level1desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else{
                        designations[0] = level1;
                        AsyncLoop(i+1,cb);
                    }

                }else{
                    cb();
                }
            }else if(i == 1){
                if(level2){
                    console.log("level2");
                    if(level2 == "LM1"){
                        var loopvalue = 1;
                        AsyncLoop2(0,loopvalue,user_designation,function(level2desig){
                            designations[1] = level2desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level2 == "LM2"){
                        var loopvalue = 2;
                        AsyncLoop2(0,loopvalue,user_designation,function(level2desig){
                            designations[1] = level2desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level2 == "LM3"){
                        var loopvalue = 3;
                        AsyncLoop2(0,loopvalue,user_designation,function(level2desig){
                            designations[1] = level2desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level2 == "LM4"){
                        var loopvalue = 4;
                        AsyncLoop2(0,loopvalue,user_designation,function(level2desig){
                            designations[1] = level2desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level2 == "LM5"){
                        var loopvalue = 5;
                        AsyncLoop2(0,loopvalue,user_designation,function(level2desig){
                            designations[1] = level2desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else{
                        designations[1] = level2;
                        AsyncLoop(i+1,cb);
                    }

                }else{
                    cb();
                }

            }else if(i == 2){
                if(level3){
                    console.log("level3");
                    if(level3 == "LM1"){
                        var loopvalue = 1;
                        AsyncLoop2(0,loopvalue,user_designation,function(level3desig){
                            designations[2] = level3desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level3 == "LM2"){
                        var loopvalue = 2;
                        AsyncLoop2(0,loopvalue,user_designation,function(level3desig){
                            designations[2] = level3desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level3 == "LM3"){
                        var loopvalue = 3;
                        AsyncLoop2(0,loopvalue,user_designation,function(level3desig){
                            designations[2] = level3desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level3 == "LM4"){
                        var loopvalue = 4;
                        AsyncLoop2(0,loopvalue,user_designation,function(level3desig){
                            designations[2] = level3desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level3 == "LM5"){
                        var loopvalue = 5;
                        AsyncLoop2(0,loopvalue,user_designation,function(level3desig){
                            designations[2] = level3desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else{
                        designations[2] = level3;
                        AsyncLoop(i+1,cb);
                    }
                }else{
                    cb();
                }
            }else if(i == 3){
                if(level4){
                    if(level4 == "LM1"){
                        var loopvalue = 1;
                        AsyncLoop2(0,loopvalue,user_designation,function(level4desig){
                            designations[3] = level4desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level4 == "LM2"){
                        var loopvalue = 2;
                        AsyncLoop2(0,loopvalue,user_designation,function(level4desig){
                            designations[3] = level4desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level4 == "LM3"){
                        var loopvalue = 3;
                        AsyncLoop2(0,loopvalue,user_designation,function(level4desig){
                            designations[3] = level4desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level4 == "LM4"){
                        var loopvalue = 4;
                        AsyncLoop2(0,loopvalue,user_designation,function(level4desig){
                            designations[3] = level4desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level4 == "LM5"){
                        var loopvalue = 5;
                        AsyncLoop2(0,loopvalue,user_designation,function(level4desig){
                            designations[3] = level4desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else{
                        designations[3] = level4;
                        AsyncLoop(i+1,cb);
                    }

                }else{
                    cb();
                }
            }else if(i == 4){
                if(level5){
                    if(level5 == "LM1"){
                        var loopvalue = 1;
                        AsyncLoop2(0,loopvalue,user_designation,function(level5desig){
                            designations[4] = level5desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level5 == "LM2"){
                        var loopvalue = 2;
                        AsyncLoop2(0,loopvalue,user_designation,function(level5desig){
                            designations[4] = level5desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level5 == "LM3"){
                        var loopvalue = 3;
                        AsyncLoop2(0,loopvalue,user_designation,function(level5desig){
                            designations[4] = level5desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level5 == "LM4"){
                        var loopvalue = 4;
                        AsyncLoop2(0,loopvalue,user_designation,function(level5desig){
                            designations[4] = level5desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else if(level5 == "LM5"){
                        var loopvalue = 5;
                        AsyncLoop2(0,loopvalue,user_designation,function(level5desig){
                            designations[4] = level5desig;
                            AsyncLoop(i+1,cb);
                        });
                    }else{
                        designations[4] = level5;
                        AsyncLoop(i+1,cb);
                    }

                }else{
                    cb();
                }

            }

        }else{
            cb();
        }
    }AsyncLoop(0,function(){
        console.log("Top Loop Ends");
        res.locals.linemangers = designations;
        next();

    });

    

}
module.exports = LineManager;
