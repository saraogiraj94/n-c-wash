var mongoose=require('mongoose');

var InstantServiceSchema = new mongoose.Schema({
    
    package_name:{
        type:String,
        required:true,
        unique:true
    },
    package_detail:{
        type:String,
        required:true
    },
    package_price:[{    
        make_type:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }       
    }]

});

var InstantService=mongoose.model('InstantService',InstantServiceSchema);
module.exports={InstantService};