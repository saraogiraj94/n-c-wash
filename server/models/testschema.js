const mongoose = require('mongoose');

var TestPackageSchema = new mongoose.Schema({
 
    booking_detail: {
        package_id:{
            type:String,
            required:true
        },
        scheduled_dates:[{
            service_date:{
                type:Date
            },
            status:{
                type:String,
                default:"Pending"
            },
            service_type:{type:String} 
        }],
        amount:{
            type:Number,
            required:true
        }
    }
  
});

var TestPackage=mongoose.model('Test',TestPackageSchema);
module.exports={TestPackage};
