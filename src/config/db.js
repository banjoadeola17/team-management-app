const mongoose = require('mongoose');

exports.mongoConnection = () => {
    return mongoose.connect(process.env.MONGODB_URI, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
}
