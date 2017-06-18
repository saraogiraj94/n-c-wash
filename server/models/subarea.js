const mongoose=require('mongoose');

var SubAreaSchema = new mongoose.Schema({
    subarea_name:{
        type:String,
        unique:true,
        required:true

    },
    superarea_name:{
        type:String,
        required:true
    },
    subarea_days:[String]
});


var SubArea=mongoose.model('SubArea',SubAreaSchema);
module.exports={SubArea};
