const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successsfully!!")
    } catch (error) {
        console.log("mongoDB connection error :", error.message)
        process.exit(1)
    }
};

module.exports = connectDB;