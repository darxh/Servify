require('dotenv').config();
const express = require('express');
const connectDB = require("./config/db")
const testRoutes = require("./routes/testRoutes")
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();
connectDB();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser())
app.use("/", testRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`)
    Credentials: true
})
