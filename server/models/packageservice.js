var mongoose=require('mongoose');

var PackageServiceSchema = new mongoose.Schema({
    package_id:{
        type:String,
        required:true,
        unique:true
    },
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
    }],
    total_days:{
        type:Number,
        required:true
    },
    no_of_days_internalwash:{
        type:Number,
        required:true
    },
    no_of_days_externalwash:{
        type:Number,
        required:true
    }
});

var PackageService=mongoose.model('PackageService',PackageServiceSchema);
module.exports={PackageService};