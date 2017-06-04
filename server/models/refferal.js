const mongoose = require('mongoose');

var RefferalSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    discount:{
        ctype:{
            type:String,
            required:true
        },
        cvalue:{
            type:Number,
            required:true,
        }
    },
    users:[ { uid:{
                    type:String
                }
            }
    ]
});


var Refferal = mongoose.model('Referral',RefferalSchema);

module.exports = {Refferal}
