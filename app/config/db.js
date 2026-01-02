const mongoose = require('mongoose');

let databaseConnection = async () => {
    try {
        console.log("Database Connnected....")
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        console.log(err, "Database not connected")
    }
}


module.exports = databaseConnection;