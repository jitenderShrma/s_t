'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-url');

var PurchaseOrderSchema = new Schema({
	company : { 
		type:Schema.Types.ObjectId,
		ref:'Company'
	},
   	purchase_id : {
   		type:String
   	},
   	amount : {
   		type:String
	},
	po_file:[{
		filename:String,
		path:String
	}]
	   
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);