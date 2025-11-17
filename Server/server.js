require('dotenv').config();
const express = require('express');
const connectDB = require("./config/db")
const testRoutes = require("./routes/testRoutes")

const app = express();
connectDB();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/", testRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`)
})