var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Refferal } = require('./models/refferal');
var { BookWash } = require('./models/bookwash');
var { InstantService } = require('./models/instantservice');


const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

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
app.get('/refferal/getall',(req,res)=>{
    Refferal.find().then((refferals)=>{
        return res.send({
            message:"Success",
            refferals
        })
    },(err)=>{
        return res.send({
            message:"Failure",
            reason:err
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
    var uid=req.body.uid;
    var newBookingWash = new BookWash({
        user_detail: user,
        vehicle_detail: vehicle,
        booking_detail: book,
        code
    });

    console.log("Booking object", JSON.stringify(newBookingWash, undefined, 2));

    if(code!=null){
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
    }else{
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

// for Facebook verification This is the most important thing to be done 
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
module.exports = { app };