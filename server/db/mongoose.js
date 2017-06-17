var mongoose=require('mongoose');

//We will set promises to use with mongoose instead of callbaks
mongoose.Promise=global.Promise;
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
//mongodb://<dbuser>:<dbpassword>@ds127872.mlab.com:
//Connecting with the mongoose database
mongoose.connect("mongodb://raj:raj@ds157641.mlab.com:27872/peepipwash");
//mongoose.connect("mongodb://localhost:27017/PeepipApi");

module.exports={
    mongoose
};