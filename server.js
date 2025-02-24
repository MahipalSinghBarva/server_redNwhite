const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db.js');
const userRoutes = require("./routes/userRoutes.js")
const courseRoutes = require("./routes/courseRoutes.js")
const enrollmentRoutes = require("./routes/enrollmentRoutes.js")

dotenv.config()
const app = express();

connectDB()
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
    origin: ["https://client-red-nwhite.vercel.app", "http://localhost:5173"],
    credentials: true,
}));

app.use("/api/v1", userRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/enrollment", enrollmentRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
