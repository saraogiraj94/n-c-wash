var mongoose=require('mongoose');

//We will set promises to use with mongoose instead of callbaks
mongoose.Promise=global.Promise;

//mongoose.connect("mongodb://peepip:peepip@ds127872.mlab.com:27872/peepipwash");
mongoose.connect("mongodb://localhost:27017/PeepipApi")
module.exports={
    mongoose
};