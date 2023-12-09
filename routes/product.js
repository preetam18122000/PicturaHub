const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const { isAuthenticated, isSeller } = require('../middlewares/auth');
const Product = require('../models/productModel');

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

module.exports = router;