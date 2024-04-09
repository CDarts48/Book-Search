const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Corey:Password123@book-search.tw2ygws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

module.exports = mongoose.connection;