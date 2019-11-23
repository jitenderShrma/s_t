'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentModel = new Schema({
    company:{
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    programme:{
        type:Schema.Types.ObjectId
    },
    academic_term:{
        type:Schema.Types.ObjectId
    },
    section:{
        type:Schema.Types.ObjectId
    },
    user_name:{
        type:String,
        unique:true,
        required:"Username is required"
    },
    password:{
        type:String
    },
    academic_term_subjects:[{
        subject_id:{
            type:Schema.Types.ObjectId
        },
        credit:{
            type:Number
        },
        subject_type:{
            type:String
        }
    }],
    personal_details:{
        name:{
            type:String,
        },
        email:{
            type:String
        },
        phone:{
            type:String
        },
        profile_pic:{
            type:String
        },
        father_details:{
            fname:{
                type:String
            },
            contact:{
                type:String
            }
        },
        mother_details:{
            mname:{
                type:String
            },
            contact:{
                type:String
            }
        },
        guardian_details:{
            name:{
                type:String
            },
            relation:{
                type:String
            },
            contact:{
                type:String
            },
            address:{
                type:String
            }
        },
        current_address:{
            type:String
        },
        correspondence_address:{
            type:String
        }
    }

});

module.exports = mongoose.model('Student',StudentModel);
