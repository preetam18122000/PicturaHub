const express = require('express');
const app = express();
const {connectDB} = require('./config/db');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const { success, cancel } = require('./utils/orderResponse');
//Middlewares
app.use(express.json());
app.use(express.static('content'));
app.use(express.urlencoded({extends: false}));

const PORT = 1338;

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);

app.use('/cancel', cancel);
app.use('/success', success);

app.listen(PORT, ()=> {
    console.log("Server is running");
    connectDB();
})