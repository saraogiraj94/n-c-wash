
let date = require('date-and-time');
var moment = require('moment-timezone');


var expiry_date="11-08-2017 Fri";
expiry_date=date.parse(expiry_date,"DD-MM-YYYY ddd",true);
console.log(expiry_date);

    // var now=new Date().toLocaleString('en-US',{timeZone:'Asia/Calcutta'});
    // console.log(now);

    // var nowdate=now.substr(0,now.indexOf(','));
    // console.log(nowdate);

    // //Now converting above string into date object
    // var nowob=date.parse(nowdate,"DD/MM/YYYY");
    // console.log(nowob);

var now=new Date();
now=moment.tz(now,"Asia/Kolkata").format();
console.log("now is" +now);
var nowob=new Date(now);
console.log("now ob is"+nowob);
var formatdate=date.format(nowob,"DD-MM-YYYY");
console.log("format"+formatdate);
var formatdateob=date.parse(formatdate,"DD-MM-YYYY");
console.log("formatdateob"+formatdateob);

expiry_date=date.addDays(formatdateob,30);
var no=date.subtract(expiry_date,formatdateob).toDays();
console.log(no);
var dates=[];
var nextday=formatdateob;
nextday=date.addDays(nextday,1);


console.log("nextday"+nextday);
for(var i=0;i<no;i++){
    nextday=date.addDays(nextday,1);
    dates.push(nextday);
}
console.log(dates);