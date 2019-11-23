'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-url');

var VendorSchema = new Schema({
    company : {
    	type : Schema.Types.ObjectId,
    	ref : 'Company' 
    },
    name:{
        type:String,
        required:"Enter the Name"
    },
    pan : {
    	type : String
    },
    vendor_company : {
        type : String,
        required : 'required'
    },
    address : {
        compAdd : {
            type : String,
        },
        country : {
            type : String,
        },
        state : {
            type : String,
        },
        zip : {
            type : String,
        },
        phone : {
            type : String,
        },
        email : {
            type : String
        }
    },
    gst : {
    	type : String
    },
    payment : {
    	acc_name : {
    		type : String
    	},
    	bank_name : {
    		type : String
    	},
    	acc_no : {
    		type : Number
    	},
    	ifsc : {
    		type : String
    	}
    },
    turnover : {
    	type : String
    },
    kcp : {
    	kcp_name : {
    		type : String
    	},
    	kcp_phone : {
    		type : String
    	}
    },
    pan_copy : {
        type : String
    },
    gst_certi : {
        type : String
    }
});

module.exports = mongoose.model('Vendor', VendorSchema);
