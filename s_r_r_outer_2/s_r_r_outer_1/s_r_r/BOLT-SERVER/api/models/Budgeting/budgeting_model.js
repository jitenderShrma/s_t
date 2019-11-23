'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BudgetingSchema = new Schema({
	head : {
		type : Schema.Types.ObjectId,
		ref : 'Head',
	},
	subheads:[{
		type : Schema.Types.ObjectId,
		ref : 'Head',
	}],
	department:{
		type : Schema.Types.ObjectId,
		ref : 'Department',
	},
	subdepts:[{
		type : Schema.Types.ObjectId,
		ref : 'Department',
	}],
	label : 
		{
			type : Schema.Types.ObjectId,
			ref : 'Label'
		},
	amount : {
		type : Number
	},
	month : {
		type : String
	},
	year : {
		type : String
	},
	quarter : {
		type : String
	}
});


module.exports = mongoose.model('Budgeting',BudgetingSchema);
