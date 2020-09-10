const mongoose = require('mongoose');



const URI = "mongodb+srv://username:username@cluster0.7ss7g.mongodb.net/Cluster0?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
    await mongoose.connect(URI ,{ useUnifiedTopology: true, useNewUrlParser: true });
    console.log('db connection..');
    } catch (error) {
    console.log(error);
    handleError(error);
    
    }


};


module.exports = connectDB;
