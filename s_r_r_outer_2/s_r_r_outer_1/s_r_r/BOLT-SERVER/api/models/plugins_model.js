'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PluginSchema = new Schema({

    plugin_name:{
        type:String,
        required:"Plugin name is required",
    },
    icon_class:{
        type:String,
    },
    plugin_color:{
        type:String,
    },
    plugin_description:{
        type:String,
    },
    global_plugin:{
        type:Boolean,
        default:false,
    },
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]
});


module.exports = mongoose.model('Plugins', PluginSchema);
