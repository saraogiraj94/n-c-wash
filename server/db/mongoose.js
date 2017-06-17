var mongoose=require('mongoose');

//We will set promises to use with mongoose instead of callbaks
mongoose.Promise=global.Promise;

mongoose.connect("mongodb://raj:raj@ds157641.mlab.com:57641/todo");

module.exports={
    mongoose
};