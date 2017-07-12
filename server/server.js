var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var moment = require('moment');
require('datejs');

var { mongoose } = require('./db/mongoose');
var { Refferal } = require('./models/refferal');
var { BookWash } = require('./models/bookwash');
var { InstantService } = require('./models/instantservice');
var { SubArea } = require('./models/subarea');
var {PackageService}=require('./models/packageservice');
var {Days}=require('./models/days');
let date = require('date-and-time');
var moment = require('moment-timezone');


var {PackageBooking}=require('./models/packagebooking');


const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

//testday();
function testday(){
    Days.findOne({'day':'tuesday'}).then((day)=>{
        console.log(JSON.stringify(day,undefined,2));
    },(err)=>{
        console.log(err);
    })
}

//ADD REFFERAL API
app.post('/refferal/add', (req, res) => {
    var body = _.pick(req.body, ['code', 'discount']);

    var newRefferal = new Refferal({
        'code': body.code,
        'discount': {
            'ctype': body.discount.ctype,
            'cvalue': body.discount.cvalue
        }
    });

    newRefferal.save().then((refferal) => {
        return res.send({
            message: "Success",
            refferal
        });
    }, (err) => {
        res.send({
            message: "Failure",
            err
        })
    });
});

//Get List of refferal/coupoun codes
app.get('/refferal/getall', (req, res) => {
    Refferal.find().then((refferals) => {
        return res.send({
            message: "Success",
            refferals
        })
    }, (err) => {
        return res.send({
            message: "Failure",
            reason: err
        })
    })
});



//USER USING THE REFFERALS API
app.post('/refferal/use', (req, res) => {
    //Here we will find the code if it exist and then update its users array
    var code = req.body.code;
    var uid = req.body.uid;
    Refferal.findOne({ code }).then((refferal) => {
        if (!refferal) {
            return res.send({
                message: "Failure",
                reason: "Coupon Does not exist"
            });
        }
        var found = false;
        for (var i = 0; i < refferal.users.length; i++) {
            //console.log("In forloop"+refferal.users[i].uid);
            if (refferal.users[i].uid == uid) {
                return res.send({
                    message: "Failure",
                    reason: "Coupon already used"
                });
            }
        }
        //Now we will add the user to the refferal code users array not in this case as add after booking only
        return res.send({
            message: "Success",
            ctype: refferal.discount.ctype,
            cvalue: refferal.discount.cvalue
        });
    }, (err) => {
        res.send({
            message: "Failure",
            reason: err
        })
    });
});

//WASH BOOK APi for user to book a wash
app.post('/user/bookwash', (req, res) => {
    console.log(JSON.stringify(req.body, undefined, 2));
    var user = _.pick(req.body, ['uid', 'name', 'mobile', 'address']);
    var vehicle = _.pick(req.body, ['make', 'model', 'reg_no']);
    var book = _.pick(req.body, ['date', 'time', 'amount', 'service_name', 'service_detail']);
    var code = req.body.code;
    var uid = req.body.uid;
    var newBookingWash = new BookWash({
        user_detail: user,
        vehicle_detail: vehicle,
        booking_detail: book,
        code
    });

    console.log("Booking object", JSON.stringify(newBookingWash, undefined, 2));

    if (code != null) {
        Refferal.findOne({ code }).then((refferal) => {
            if (!refferal) {
                return res.send({
                    message: "Failure",
                    reason: "Coupon Does not exist"
                });
            }
            var found = false;
            for (var i = 0; i < refferal.users.length; i++) {
                //console.log("In forloop"+refferal.users[i].uid);
                if (refferal.users[i].uid == uid) {
                    return res.send({
                        message: "Failure",
                        reason: "Coupon already used"
                    });
                }
            }
            newBookingWash.save().then((newBooking) => {
                refferal.users.push({ uid });
                refferal.save().then((refferal) => {
                    return res.send({
                        message: 'Success',
                        newBooking
                    });
                }, (err) => {
                    return res.send({
                        message: "Failure but booking done",
                        reason: err
                    });
                });

            }, (err) => {
                console.log(err);
                res.send({
                    message: 'Failure',
                    reason: err
                });
            });


            //Now we will add the user to the refferal code users array

        }, (err) => {
            res.send({
                message: "Failure",
                reason: err
            })
        });
    } else {
        newBookingWash.save().then((newBooking) => {
            return res.send({
                message: 'Success',
                newBooking
            });
        }, (err) => {
            return res.send({
                message: "Failure but booking done",
                reason: err
            });
        });
    }
});

//ADD NEW INSTANT PACAKGE API FOR ADMIN
app.post('/instantservice/add', (req, res) => {

    //Here we need to set price according to type of vehicle
    var body = _.pick(req.body, ['package_name', 'package_detail', 'package_price']);
    var newInstantService = new InstantService({
        package_name: body.package_name,
        package_detail: body.package_detail,
        package_price: body.package_price
        //     "package_price.make_type":body.package_price.make_type,
        //   "package_price.price":body.package_price.price
    });

    newInstantService.save().then((newInstantService) => {
        res.send({
            message: 'Success',
            newInstantService
        });
    }, (err) => {
        res.send({
            message: 'Failure',
            reason: err
        });
    });
});



//GET INSTANT SERVICE PACKAGE DETAILS
app.get('/instantservice/getall', (req, res) => {
    InstantService.find().then((instantServices) => {
        console.log(JSON.stringify(instantServices, undefined, '2'));
        return res.send({
            message: "Success",
            instantServices
        });
    }, (err) => {
        res.send({
            message: 'Failure',
            reason: err
        });
    });
});

//GET INSTANTPACKAE DETAIL WITH VEHICLE MAKE_TYPE
app.post('/instantservice/getpackages', (req, res) => {
    var make = req.body.make_type;
    InstantService.find().then((instantServices) => {
        console.log("Make is", make);
        var services = [];
        for (var i = 0; i < instantServices.length; i++) {
            console.log("inside for");
            var service = instantServices[i];

            for (var j = 0; j < service.package_price.length; j++) {
                console.log("inside for second", service.package_price[j].make_type);
                if (service.package_price[j].make_type === make) {
                    var addservice = {
                        "package_name": service.package_name,
                        "package_detail": service.package_detail,
                        "package_price": service.package_price[j].price
                    };
                    console.log("Inside if", addservice);
                    services.push(addservice);
                }
            };
        }

        return res.send({
            message: "Success",
            services
        });
    }, (err) => {
        res.status(400).send({
            message: "Failure",
            err
        });
    });
});


app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})



//Admin Add SubAreas with days at which service is offered
app.post('/admin/subarea/add', (req, res) => {
    var newSubArea = new SubArea(req.body);
    console.log("Sub Area is", newSubArea);
    newSubArea.save().then((subArea) => {
        return res.send({
            message: "Success",
            subArea
        });
    }, (err) => {
        res.status(400).send({
            message: "Failure",
            err
        });
    });
});

//User Get Package Availabilty DATES after submitting subarea
app.post('/user/subarea/getdates', (req, res) => {
    var subarea_name = req.body.subarea_name;
    SubArea.findOne({ 'subarea_name': subarea_name }).then((subArea) => {
        // console.log("Find the subarea object",subArea);
        var dates = [];
        for (var i = 0; i < subArea.subarea_days.length; i++) {
            var today_date = Date.parse('t');
            var today_day = moment(today_date).format("dddd");
            today_day = today_day.toLocaleLowerCase();
            console.log(today_day);
            if (today_day == subArea.subarea_days[i]) {
                var date = Date.parse(today_day);
                console.log("Date unformated",date);
                date = moment(date).format("DD MMM YYYY ddd");
                console.log("Date of the day is " + date);
                dates.push(date);
            } else {
                var par = `next ${subArea.subarea_days[i]}`;
                var date = Date.parse(par);
                date = moment(date).format("DD MMM YYYY ddd");
                console.log("Date of the day is " + date);
                dates.push(date);
            }
        }
        dates = _.sortBy(dates);
        return res.send({
            message: "Success",
            dates
        });
    }, (err) => {
        res.status(400).send({
            message: "Failure",
            reason: "No Such Sub Area",
            err
        });
    });
});

app.post('/admin/packageservice/add',(req,res)=>{
    var body = _.pick(req.body, ['package_name', 'package_detail', 'package_price','total_days','internalwash','externalwash']);
    var newPackageService = new PackageService({
        package_name: body.package_name,
        package_detail: body.package_detail,
        package_price: body.package_price,
        total_days:body.total_days,
        no_of_days_internalwash:body.internalwash,
        no_of_days_externalwash:body.externalwash
        //     "package_price.make_type":body.package_price.make_type,
        //   "package_price.price":body.package_price.price
    });

    newPackageService.save().then((packageService)=>{
        res.send({
            message:"Success",
            packageService
        })
    },(err)=>{
            res.status(400).send({
            message: "Failure",
            err
        });
        
    });
});

app.post('/user/packageservice/book',(req,res)=>{
    var package_id=req.body.package_id;
    var total_days=req.body.today_date;
    var scheduled_dates=[];
    var starting_date=req.body.selected_date;
    scheduled_dates.push(starting_date);
    var nextdate;
    for(var i=1;i<total_days;i++){
        nextdate;
    }
    var code = req.body.code;
    var uid = req.body.uid;
          
});

//API To book a package by user
app.post('/user/packagebooking',(req,res)=>{
    var user_detail=_.pick(req.body,['uid','name','mobile','address']);
    var vehicle_detail=_.pick(req.body,['make','model','reg_no','segment']);
    // var booking_date=moment(req.body.booking_date,"DD-MM-YYYY");
    // var expiry_date=moment(booking_date,"DD-MM-YYYY").add(30,'d');
    // booking_date=new Date(booking_date);
    // booking_date=moment(booking_date).format("DD-MM-YYYY ddd");
    //expiry_date=new Date(expiry_date);
    //expiry_date=moment(expiry_date).format("DD-MM-YYYY ddd");
   // console.log("Booking date----------"+booking_date+"expiry date -----------"+expiry_date);
    
    var now=new Date();
    now=moment.tz(now,"Asia/Kolkata").format();
    console.log("now is" +now);
    var nowob=new Date(now);    
    console.log("now ob is"+nowob);
    var formatdate=date.format(nowob,"DD-MM-YYYY");
    console.log("format"+formatdate);
    var booking_date=date.parse(formatdate,"DD-MM-YYYY");
    booking_date=date.addDays(booking_date,1);
    console.log("formatdateob"+booking_date);
    expiry_date=date.addDays(booking_date,30);
    
    var total_days=req.body.total_days;
    var schedule_dates=[];
    for(var i=0;i<total_days;i++){
        schedule_dates.push({
            status:"unset"
        });
    };
    
    var newPackageBooking= PackageBooking({
        user_detail,
        vehicle_detail,
        booking_date,
        expiry_date,
        total_days,
        no_of_internal:req.body.internal,
        no_of_external:req.body.external,
        package_id:req.body.package_id,
        city:req.body.city,
        superarea:req.body.superarea,
        subarea:req.body.subarea,
        schedule_dates
    });

    console.log(JSON.stringify(newPackageBooking,undefined,2));

    newPackageBooking.save().then((bookedpackage)=>{
        return res.send({
            message:"Success",
            bookedpackage
        })
    },(err)=>{
          res.status(400).send({
            message: "Failure",
            err
        });
    });
});

//API to show list of packages booked by user



//API to show package details including status of scheduled dates
app.post('/user/bookedpackagedetail',(req,res)=>{
    var uid=req.body.uid;
    var booking_id=req.body.id;
    booking_id=mongoose.Types.ObjectId(booking_id);
        PackageBooking.findById(booking_id).then((bookedpackage)=>{
        //console.log("BOOKED--------",JSON.stringify(bookedpackage,undefined,2));
        return res.send({
            message:"Success",
            bookedpackage
        });        

    },(err)=>{
         res.status(400).send({
            message: "Failure",
            err
        });
    });
    
});



//API to send dates and time slot no of interior and external left 
//Dates should start from next day of current day till the expiry date
app.post('/user/getdatelist',(req,res)=>{
    // var booking_id=req.body.id;
    // booking_id=mongoose.Types.ObjectId(booking_id);
     var schedule_date_id=req.body.date_id;
    schedule_date_id=mongoose.Types.ObjectId(schedule_date_id);
    PackageBooking.findOne({'schedule_dates._id':schedule_date_id}).then((bookedpackage)=>{
        console.log(JSON.stringify(bookedpackage,undefined,2));
    var now=new Date();
    now=moment.tz(now,"Asia/Kolkata").format();
    console.log("now is" +now);
    var nowob=new Date(now);

    //Adding 5.30 hours as it converts to utc and decreases in live server but works fine in local
    nowob=date.addMinutes(nowob,330);

    console.log("now ob is"+nowob);
    var formatdate=date.format(nowob,"DD-MM-YYYY");
    console.log("format"+formatdate);
    var formatdateob=date.parse(formatdate,"DD-MM-YYYY",true);
    console.log("formatdateob"+formatdateob);
    // formatdateob=date.addDays(formatdateob,1);    
    expiry_date=bookedpackage.expiry_date;
    var no=date.subtract(expiry_date,formatdateob).toDays();
    console.log(no);
    var dates=[];
    var nextday=formatdateob;
    
  
    console.log("nextday"+nextday);
    for(var i=0;i<no;i++){
        nextday=date.addDays(nextday,1);
        dates.push(nextday);
    }
    console.log(dates);

    return res.send({
        "message":"Success",
        dates
    });




    },(err)=>{
        console.log(err);
        res.status(400).send({
            message: "Failure",
            err
        });
    });
});


//API to show the time slots on a specific date by converting into day
app.post('/user/gettimeslots',(req,res)=>{
    var uid=req.body.uid;
    var schedule_date=req.body.schedule_date;
    var usersubarea=req.body.subarea;

    //Convert this date into day and find it in the areas schema
    var schedule_day=moment(schedule_date).format("dddd");
    schedule_day=schedule_day.toLocaleLowerCase();
    console.log(schedule_day);
    var slots=[];
    Days.findOne({'day':schedule_day}).then((day)=>{
        console.log("Day in db is",JSON.stringify(day,undefined,2));
     for(var i=0;i<day.slots.length;i++){
            //console.log("in for loop");
            for(var j=0;j<day.slots[i].subareas.length;j++){
                //console.log(day.slots[i].subareas[j]);
                if(day.slots[i].subareas[j]==usersubarea){
                    console.log("match");
                    
                    var slot= {
                        "start_time":day.slots[i].start_time,
                         "end_time":day.slots[i].end_time,
                         "status":"A"
                    }

                    console.log("SLOT is",JSON.stringify(slot,undefined,2));
                    slots.push(slot);
                }
            }
     }
    console.log("SLots",JSON.stringify(slots,undefined,2));
    //After getting slots for those are we need to check bookingledger for time availability
    
    return res.send({
        message:"Success",
        slots
    })

    },(err)=>{
        console.log(err);
    });

});


//API To schedule a date of wash    
app.post('/user/schedule',(req,res)=>{
    var uid=req.body.uid;
    var booking_id=req.body.id;
    var schedule_date=req.body.schedule_date;
    var internal=req.body.internal;
    var external=req.body.external;
    var start_time=req.body.start_time;
    var end_time=req.body.end_time;

    booking_id=mongoose.Types.ObjectId(booking_id);


    PackageBooking.findById(booking_id).then((bookedpackage)=>{
        console.log("BOOKED--------",JSON.stringify(bookedpackage,undefined,2));

        if(bookedpackage.status=="active"){

        }

    },(err)=>{

    });

});


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
module.exports = { app };