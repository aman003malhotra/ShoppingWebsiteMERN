require('dotenv').config(); // importing .env files and every variable in that file

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
var app = express()

// My routes
const authRoutes = require("./routes/authentication");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentBRoutes = require("./routes/paymentBRoutes");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser()); // update or delete values from the cookies
app.use(cors());

// DataBase Connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true,
})
.then(()=>{console.log("DB CONNECTED")});

// My Routes

app.use("/api", authRoutes); // added in the prefix
app.use("/api", userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentBRoutes);

// PORT
const port = process.env.PORT || 8000;

// Starting a Server
app.listen(port, ()=>{
  console.log(`App is running at port ${port}`);
})
