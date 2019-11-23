'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


var ApprovalsSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    department:{
        type : Schema.Types.ObjectId,
        ref : 'Department', 
    },
    request_by:{
        type:Schema.Types.ObjectId,
        refPath:"user_type"
    },
    user_type:{
        type:String,
        enum:['User','Super_User'],
        default:"User"
    },
    requester_designation:{
        type:Schema.Types.ObjectId
    },
    requester_name:{
        type:String,
    },
    approval_type:{
        type:String,
        enum:['One Time','Recurring'],
        default:"One Time"
    },
    recurring_rate:{
        type:Number,
    },
    recurring_period:{
        type:Number,
        default:1
    },
    budget_head:{
        type: Schema.Types.ObjectId,
        ref: 'Heads',
        required:"Please enter a Budget Head"
    },
    month:{
        type:String,
    },
    year:{
        type:String,
    },
    amount:{
        type:Number,
    },
    approval_amount_left:{
        type: [Number],
        default:[0,0,0,0,0,0,0,0,0,0,0,0]
    },
    description:{
        type:String
    },
    imprest_required:{
        type:Number
    },
    request_for_quote:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:"PENDING",
    },
    unique_id:{
        type:Number,
    },
    ref_id:{
        type:String,
    },
    labels:[{
        type:Schema.Types.ObjectId,
        ref:'Label'
    }],
    assigned_to_designation:{
        type:Schema.Types.ObjectId
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
    remarks:{
        by:{
            type:String
        },
        query:{
            type:String
        }
    },
    atLevel:{
        type:Number,
        default:0
    },
    rejected_by:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    created_date:{
        type:Date,
        default:Date.now
    },
    last_updated:{
        type:Date,
        default:Date.now
    }

});

ApprovalsSchema.index({ month: 1, year: 1, unique_id:1 }, { unique: true });
ApprovalsSchema.plugin(AutoIncrement,{id:'unique_seq',inc_field: 'unique_id',reference_fields: ['month','year'] });
module.exports = mongoose.model('Approvals',ApprovalsSchema);
