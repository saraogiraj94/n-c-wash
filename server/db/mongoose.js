var mongoose=require('mongoose');

//We will set promises to use with mongoose instead of callbaks
mongoose.Promise=global.Promise;

//Connecting with the mongoose database
//mongoose.connect("mongodb://raj:raj@ds157641.mlab.com:57641/todo");
mongoose.connect("mongodb://localhost:27017/PeepipApi");

module.exports={
    mongoose
};