'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var BudgetTransferSettings = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required",
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    fin_year_start_month:{
        type:String,
    },
    fin_year:{
        type:String
    },
    level1:{
        designation:{
            type: String,
            ref:'Designation'
        },
        designation_label:{
            type:Schema.Types.ObjectId,
            ref:'Label'    
        },
        amount:{
            type:Number,
            default:0
        },
        alert_time:{
            type:Number
        },

    },
    level2:{
        designation:{
            type:String,
            ref:'Designation'
        },
        designation_label:{
            type:Schema.Types.ObjectId,
            ref:'Label'
        },
        amount:{
            type:Number,
            default:0
        },
        alert_time:{
            type:Number
        },

    },
    level3:{
        designation:{
            type:String,
            ref:'Designation'
        },
        designation_label:{
            type:Schema.Types.ObjectId,
            ref:'Label'
        },
        amount:{
            type:Number,
            default:0
        },
        alert_time:{
            type:Number
        },

    },
    level4:{
        designation:{
            type:String,
            ref:'Designation'

        },
        designation_label:{
            type:Schema.Types.ObjectId,
            ref:'Label'
        },
        amount:{
            type:Number,
            default:0
        },
        alert_time:{
            type:Number
        },

    },
    level5:{
        designation:{
            type: String,
            ref:'Designation'

        },
        designation_label:{
            type:Schema.Types.ObjectId,
            ref:'Label'
        },
        amount:{
            type:Number,
            default:0
        },
        alert_time:{
            type:Number
        },

    },
    auto_cancel_time:{
        type:Number
    }
});
module.exports = mongoose.model('BudgetTransferSetting',BudgetTransferSettings);
