const Product = require("../models/Product");
const User = require("../models/User");


const showAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products/index', { products });
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
}


const productForm = (req, res) => {
    try {
        res.render('products/new');
    }
    catch (e) {
         res.status(500).render('error',{err:e.message})
    }  
}

const createProduct = async (req, res) => {

    try {
        const { name, img, desc, price } = req.body;
        await Product.create({ name, img, price: parseFloat(price), desc,author:req.user._id });
        req.flash('success', 'Successfully added a new product!');
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
}

const showProduct = async(req, res) => {

    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        const product = await Product.findById(id).populate('reviews');
        res.render('products/show', { product,user}); 
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
}

const editProductForm = async (req, res) => {
    
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('products/edit', { product });
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }  
}

const updateProduct = async (req, res) => {

    try {
        const { id } = req.params;
        const { name, price, img, desc } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, desc, img });
        req.flash('success', 'Edit Your Product Successfully');
        res.redirect(`/products/${id}`);
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
        
    } 
}


const deleteProduct = async (req, res) => {
    
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/user/myproducts');
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})   
    }
}

const sellerProducts = async (req, res) => {
    try {
        const allProducts = await Product.find({ author: req.user._id });
        res.render("products/sellerProducts",{allProducts})
    }
    catch (e) {
        console.log(e)
        res.status(500).render('error',{err:e.message})   
    }
}


module.exports = {showAllProducts , productForm , createProduct , showProduct , editProductForm , updateProduct , deleteProduct, sellerProducts }