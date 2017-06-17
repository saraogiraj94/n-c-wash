const mongoose = require('mongoose');

var BookWashSchema = new mongoose.Schema({
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
        }
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
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        service_name:{
            type:String,
            required:true
        },
        service_detail:{
            type:String  
        },
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
