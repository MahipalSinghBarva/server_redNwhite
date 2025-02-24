const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error connecting DB");
        process.exit(1);
    }
}

module.exports = connectDB;