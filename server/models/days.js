var mongoose=require('mongoose');

var DaySchema=new mongoose.Schema({
    day:{
        type:String,
        required:true
    },
    slots:[{
        start_time:{
            type:Number
        },
        end_time:{
            type:Number
        },
        subareas:[String]
    }],
    status:String  
});

var Days=mongoose.model('days',DaySchema);
module.exports={Days};
