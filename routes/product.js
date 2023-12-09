const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const { isAuthenticated, isSeller, isBuyer } = require('../middlewares/auth');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const {stripeKey} =require('../config/credentials');
const stripe = require('stripe')(stripeKey); //stripeKey is generated from stripe website
const { WebhookClient } = require('discord.js'); //To alert the user about order placed on discord

//WebhookClient is a class -> first letter is capital for most classes
//Whenever you deal with a class, create an object of it

const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1183010921799495790/Wvsj6MCbogD110-CzoJlp98tKycvNoGWFp_DrTr-8HHMQ_Czv3Dm41h8Kd0utBdhOC_E"
});
//URL is taken from discord by creating new channel and creating a webhook inside it's integration

router.post("/create", isAuthenticated, isSeller, (req,res) => {
    upload(req,res, async( err ) => { //callback is for errors
        if(err){
            console.log('Error in upload file ', err);
            return res.status(500).send(err)
        }
        const { name, price } = req.body;
        if( !name || !price || !req.file ) {
            return res.status(400).json({
                err: "Missing file data"
            });
        }
        if(Number.isNaN(price)) {
            return res.status(400).json({
                err: "Price should be a number"
            });
        }
        let productData = {
            name,
            price,
            content: req.file.path
        }
        const savedProduct = await Product.create(productData);
        //multer will take care of uploading the file, putting it in destination, etc.
        //Save the file here in db
        return res.status(200).json({
            status: 'OK',
            productData: savedProduct
        });
    })
})

router.get('/get/all', isAuthenticated, async(req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json({ products });
    } catch(e){
        res.status(500).json({ err: e });
    }
})

router.post('/buy/:productId', isAuthenticated, isBuyer, async (req,res, next) => {
    try {
        const productData = await Product.findOne({
            where : { id: req.params.productId}
        });
        const product = productData.dataValues;
        if(!product) return res.status(404).json({ err: 'No product found'});

        const orderDetails = {
            productId: product.id,
            buyerId: req.user.id,
        }
        //Redirecting to stripe checkout
        // const session = await stripe.checkout.sessions.create({
        //     payment_method_types: ['card'],
        //     line_items: [
        //         {
        //             price_data: {
        //                 currency: 'inr',
        //                 product_data: {
        //                     name: product.name,
        //                 },
        //                 unit_amount: product.price * 100, // Convert price to cents
        //             },
        //             quantity: 1,
        //         },
        //     ],
        //     mode: 'payment',
        //     success_url: 'http://localhost:1338/success', // Redirect to this page on successful payment
        //     cancel_url: 'http://localhost:1338/cancel', // Redirect to this page if the user cancels the payment
        // });
        // return res.redirect(303, session.url);

        //Below is the code to accept user card details from our website
        let paymentMethod = await stripe.paymentMethods.create({
            type: "card",
            card: {
                number: "4242424242424242",
                exp_month: 9,
                exp_year: 2024,
                cvc: "314"
            }
        });

        let paymentIntent = await stripe.paymentIntents.create({
            amount: product.price,
            currency: "inr",
            payment_method_types: ["card"],
            payment_method: paymentMethod.id,
            confirm: true //demo payment so always confirmed here
        });

        if(paymentIntent) {
            //means order is successful
            const createOrder = await Order.create(orderDetails);
            //sending message to discord channel
            webhook.send({
                content: `Hey ${req.User.name}, your order with order_id ${createOrder.id} is confirmed.`,
                username: "Order Manager",
                avatarURL: "https://gravatar.com/avatar/fe1df9507ff95ff31e01b8e285b2a821?s=400&d=robohash&r=x" //can generate it on google
            });
            res.status(200).json({
                createOrder
            });
        } else {
            webhook.send({
                content: `Hey ${req.User.name}, your order with order_id ${createOrder.id} has failed.`,
                username: "Order Manager",
                avatarURL: "https://gravatar.com/avatar/fe1df9507ff95ff31e01b8e285b2a821?s=400&d=robohash&r=x" //can generate it on google
            });
            res.status(400).json({
                err: 'Payment failed'
            });
        }
        
    } catch (e) {
        //console.log('error',e);
        res.status(500).json({ err: e});
    }
    return next();
})

module.exports = router;