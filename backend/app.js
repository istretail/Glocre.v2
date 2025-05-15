const express = require('express')
const app = express ();
const errorMiddleware = require('./middlewares/error')
const cookieParser = require('cookie-parser')
const auth = require('./routes/auth')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({path:path.join(__dirname,"config/config.env")});
const products = require('./routes/productDetails');
const order = require('./routes/order')
const payment = require('./routes/payment')
const analyticsRoutes = require('./routes/analyticsRoutes')
const bannerRoutes = require('./routes/bannerRoute')
const catchAsyncError = require("./middlewares/catchAsyncError");
app.use('/uploads', express.static(path.join(__dirname,'uploads')))
app.use(express.json());
app.use(cookieParser())
// app.use(catchAsyncError())

app.use('/api/v1/',products);
app.use('/api/v1/',auth);
app.use('/api/v1/',order);
app.use('/api/v1/',payment);
app.use('/api/v1/',analyticsRoutes)
app.use('/api/v1/',bannerRoutes)
if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,'../frontend/build')))
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'))
    })
}
app.use(errorMiddleware);
module.exports = app;