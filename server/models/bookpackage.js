const mongoose = require('mongoose');

var BookPackageSchema = new mongoose.Schema({
    user_detail: {
        uid: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        mobile: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        subarea_name:{type:String,required:true},
        superarea_name:{type:String,required:true}
    },
    vehicle_detail: {
        make: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        reg_no: {
            type: String,
            required: true
        }
    },
    booking_detail: {
        package_id:{
            type:String,
            required:true
        },
        scheduled_dates:[{
            service_date:Date,
            status:{
                type:String,
                default:"Pending"
            },
            service_type:String 
        }],
        amount:{
            type:Number,
            required:true
        }
    },
    status:{
        type:String,
        default:"Pending"
    },
    code:{
        type:String
    }
});

var BookWash=mongoose.model('BookWash',BookWashSchema);
module.exports={BookWash};
