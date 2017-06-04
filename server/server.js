var express=require('express');
var bodyParser=require('body-parser');
var _ = require('lodash');

var {mongoose}=require('./db/mongoose');
var {Refferal}=require('./models/refferal');

const port=process.env.PORT||3000;

var app=express();  
app.use(bodyParser.json());

//ADD REFFERAL API
app.post('/refferal/add',(req,res)=>{
    var body=_.pick(req.body,['code','discount']);

    var newRefferal= new Refferal({
        'code':body.code,
        'discount':{
            'ctype':body.discount.ctype,
            'cvalue':body.discount.cvalue
        }
    });

    newRefferal.save().then((refferal)=>{
        return res.send({
            message:"Success",
            refferal
        });
    },(err)=>{
        res.send({
            message:"Failure",
            err
        })
    });
});



//USER USING THE REFFERALS API
app.post('/refferal/use',(req,res)=>{
    //Here we will find the code if it exist and then update its users array
    var code=req.body.code;
    var uid=req.body.uid;
    Refferal.findOne({code}).then((refferal)=>{
        if(!refferal){
            return res.send({
                message:"Failure",
                reason:"Coupon Does not exist"
            });
        }
        var found = false;
        for(var i = 0; i <refferal.users.length; i++) {
        //console.log("In forloop"+refferal.users[i].uid);
        if (refferal.users[i].uid == uid) {
            return res.send({
                message:"Failure",
                reason:"Coupon already used"
            });
            }
        }
     //Now we will add the user to the refferal code users array
            refferal.users.push({uid});
            refferal.save().then((refferal)=>{
                return res.send({
                    message:"Success",
                    ctype:refferal.discount.ctype,
                    cvalue:refferal.discount.cvalue
                });
            },(err)=>{
           return  res.send({
                message:"Failure",
                reason:err
                });
            });
    },(err)=>{
        res.send({
            message:"Failure",
            reason:err
        })
    });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
module.exports = {app};