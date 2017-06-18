const mongoose=require('mongoose');

var SubAreaSchema = new mongoose.Schema({
    subarea_name:{
        type:String,
        unique:true,
        required:true

    },
    subarea_days:[{
        service_day:{
            type:String
        }
    }]
});


var SubArea=mongoose.model('SubArea',SubAreaSchema);
module.exports={SubArea};
