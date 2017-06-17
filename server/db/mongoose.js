var mongoose=require('mongoose');

//We will set promises to use with mongoose instead of callbaks
mongoose.Promise=global.Promise;

//mongoose.connect("mongodb://raj:raj@ds157641.mlab.com:57641/todo");
mongoose.connect("mongodb://peepip:peepip@ds127872.mlab.com:27872/peepipwash");
module.exports={
    mongoose
};