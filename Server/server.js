require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successsfully!!")

        app.listen(PORT, () => {
            console.log(`server is running at http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log("mongoDB connection error :", error.message)
        process.exit(1)
    }
};

connectDB();

app.get("/", (req, res) => {
    res.send("servify api is running")
});
