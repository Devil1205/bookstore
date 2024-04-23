const mongoose = require('mongoose');
exports.connect = ()=>{
    mongoose.connect(process.env.URI).then(console.log("connected to mongo")).catch(error=>{console.log(error);});
}