var express=require('express');
var bodyParser=require('body-parser');
var _ = require('lodash');

var {mongoose}=require('./db/mongoose');
var {Refferal}=require('./models/refferal');
var{BookWash}=require('./models/bookwash');
var {InstantService}=require('./models/instantservice');


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

//WASH BOOK APi for user to book a wash
app.post('/user/bookwash',(req,res)=>{
    console.log(JSON.stringify(req.body,undefined,2));
    var user=_.pick(req.body,['uid','name','mobile','address']);
    var vehicle=_.pick(req.body,['make','model','reg_no']);
    var book=_.pick(req.body,['date','time','amount']);
    
    var newBookingWash = new BookWash({
        user_detail:user,
        vehicle_detail:vehicle,
        booking_detail:book
    });

    console.log("Booking object",JSON.stringify(newBookingWash,undefined,2));

    newBookingWash.save().then((newBooking)=>{
        res.send({
            message:'Success',
            newBooking
        });
    },(err)=>{
        console.log(err);
        res.send({
            message:'Failure',
            reason:err
        });
    });
    
});

//ADD NEW INSTANT PACAKGE API FOR ADMIN
app.post('/instantservice/add',(req,res)=>{

    //Here we need to set price according to type of vehicle
    var body=_.pick(req.body,['package_name','package_detail','package_price']);
    var newInstantService=new InstantService({
        package_name:body.package_name,
        package_detail:body.package_detail,
        package_price:body.package_price
   //     "package_price.make_type":body.package_price.make_type,
     //   "package_price.price":body.package_price.price
    });

    newInstantService.save().then((newInstantService)=>{
        res.send({
            message:'Success',
            newInstantService
        });
    },(err)=>{
        res.send({
            message:'Failure',
            reason:err
        });
    });
});



//GET INSTANT SERVICE PACKAGE DETAILS
app.get('/instantservice/get',(req,res)=>{
    InstantService.find().then((instantServices)=>{
        console.log(JSON.stringify(instantServices,undefined,'2'));
        return res.send({
            message:"Success",
            instantServices
        });
 },(err)=>{
        res.send({
            message:'Failure',
            reason:err
        });
    });
});

//GET INSTANTPACKAE DETAIL WITH VEHICLE MAKE_TYPE
app.post('/instantservice/getpackages',(req,res)=>{
    var make=req.body.make_type;
    InstantService.find().then((instantServices)=>{
        console.log("Make is",make);
        var services=[];
        for(var i = 0; i <instantServices.length; i++) {
            console.log("inside for");
            var service=instantServices[i];

            for(var j=0;j<service.package_price.length;j++){
                console.log("inside for second",service.package_price[j].make_type);
                if(service.package_price[j].make_type===make){
                    var addservice = {
                        "package_name":service.package_name,
                        "package_detail":service.package_detail,
                        "package_price":service.package_price[j].price
                    };
                    console.log("Inside if",addservice);
                    services.push(addservice);
                }
            };
        }

        return res.send({
            message:"Success",
             services
        });
    },(err)=>{
        res.status(400).send({
            message:"Failure",
            err
        });
    });
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
module.exports = {app};