'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const BudgetTransfer = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    source_head:{
        type: Schema.Types.ObjectId,
        ref: 'Heads',
        required:"Please enter a Source Head"
    },
    destination_head:{
        type: Schema.Types.ObjectId,
        ref: 'Heads',
        required:"Please enter a Source Head"
    },
    amount:{
        type:Number
    },
    source_month:{
        type:String,
    },
    destination_month:{
        type:String,
    },
    year:{
        type:String,
    },
    requested_by:{
        type:Schema.Types.ObjectId,
        refPath: "requester_model"
    },
    requester_model:{
        type:String,
        enum:['User','Super_User'],
        default:"User"
    },
    requester_designation:{
        type:String
    },
    approval_matrix:{
        level1:{
            type:Schema.Types.ObjectId
        },
        level2:{
            type:Schema.Types.ObjectId
        },
        level3:{
            type:Schema.Types.ObjectId
        },
        level4:{
            type:Schema.Types.ObjectId
        },
        level5:{
            type:Schema.Types.ObjectId
        }
    },
    level1approved:{
        by:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        designation:{
            type:Schema.Types.ObjectId,
            ref:'Designation'
        },
        status:{
            type:Boolean
        },
        remarks:{
            type:String
        },
        partially_approved_amount:{
            type:Number
        }
        
    },
    level2approved:{
        by:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        designation:{
            type:Schema.Types.ObjectId,
            ref:'Designation'
        },
        status:{
            type:Boolean
        },
        remarks:{
            type:String
        },
        partially_approved_amount:{
            type:Number
        }
    },
    level3approved:{
        by:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        designation:{
            type:Schema.Types.ObjectId,
            ref:'Designation'
        },
        status:{
            type:Boolean
        },
        remarks:{
            type:String
        },
        partially_approved_amount:{
            type:Number
        }
    },
    level4approved:{
        by:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        designation:{
            type:Schema.Types.ObjectId,
            ref:'Designation'
        },
        status:{
            type:Boolean
        },
        remarks:{
            type:String
        },
        partially_approved_amount:{
            type:Number
        }
    },
    level5approved:{
        by:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        designation:{
            type:Schema.Types.ObjectId,
            ref:'Designation'
        },
        status:{
            type:Boolean
        },
        remarks:{
            type:String
        },
        partially_approved_amount:{
            type:Number
        }
    },
    accepted_by:{
        type:String,
    },
    rejected_by:{
        type:String,
    },
    status:{
        type:String,
        default:"PENDING"
    },
    atLevel:{
        type: Number,
        default:0
    },
    assigned_to_designation:{
        type:String,
    },
    last_updated : {
        type: Date,
        default : Date.now
    }
});


module.exports = mongoose.model('BudgetTransfer',BudgetTransfer);
