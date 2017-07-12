const mongoose = require('mongoose');

var PackageBookingSchema = new mongoose.Schema({
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
        },
        segment:{  
            type:Number,
            required:true
        }
    },

    city:{type:String,required:true},
    superarea:{type:String,required:true},
    subarea:{type:String,required:true},
    
    booking_date:{
        type:Date,
        required:true
    },
    expiry_date:{
        type:Date,
        required:true
    },
    no_of_internal:{
        type:Number
    },
    no_of_external:{
        type:Number
    },
    total_days:Number,
    package_id:{
        type:String,
        required:true
    },
    schedule_dates:[{
        status:{
            type:String,
            default:"unset"
        },
        date:{
            type:Date
        },
        start_time:{
            type:Number
        },
        end_time:{
            type:Number
        },
        external:{
            type:Boolean
        },
        internal:{
            type:Boolean
        },
        feedaback:{
            type:Number
        }  
    }],

    package_status:{
        type:String,
        default:"active"
    }
});

var PackageBooking=mongoose.model("PackageBooking",PackageBookingSchema);
module.exports={PackageBooking};    