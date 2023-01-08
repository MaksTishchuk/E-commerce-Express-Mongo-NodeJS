const slugify = require('slugify')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const mongoose = require("mongoose");


const createProduct = async (req, res) => {
    try {
        const {name, category, price, description, quantity} = req.body
        let productPictures = []
        // const basePath = `${req.protocol}://${req.get('host')}/uploads/`
        //
        // if (req.files) {
        //     req.files.map(file => {
        //         productPictures.push(`${basePath}${file.filename}`)
        //     })
        // }

        if (req.files.length > 0) {
            req.files.map(file => {
                productPictures.push(file.location)
            })
        }

        const product = new Product({
            name: name,
            slug: slugify(name),
            category,
            createdBy: req.user._id,
            price,
            quantity,
            description,
            productPictures,
            offer: typeof req.body.offer !== 'undefined' ? req.body.offer : price
        })

        await product.save((error, product) => {
            if (error) return res.status(400).json({
                message: "Can`t save Product!",
                error: error.message
            })
            if (product) {
                return res.status(201).json({
                    message: 'Product has been created!',
                    product: product,
                    files: req.files
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate([
            {path: 'category', select: '_id name slug'},
            {path: 'createdBy', select: '_id email username firstName lastName'}
        ])
        if (!products) {
            return res.status(500).json({success: false, message: 'Products were not found!'})
        }
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getProductsByCategorySlug = async (req, res) => {
    try {
        const slug = req.params.slug
        const category = await Category.findOne({slug: slug}).select('_id')
        if (!category) {
            return res.json({
                success: false,
                message: 'Category was not found!',
            })
        }
        const products = await Product.find({category: category}).populate([
            {path: 'category', select: '_id name'},
            {path: 'createdBy', select: '_id email username firstName lastName'}
        ])
        if (!products) {
            return res.status(500).json({success: false, message: 'Products were not found!'})
        }
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getProductDetail = async (req, res) => {
    try {
        const productId = req.params.id
        if (productId) {
            const product = await Product.findById(productId).populate([
                {path: 'category', select: '_id name slug'},
                {path: 'createdBy', select: '_id email username firstName lastName'}
            ])
            if (!product) {
                return res.status(500).json({success: false, message: 'Product was not found!'})
            }
            res.status(200).json(product)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const updateProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({
                success: false,
                message: 'Product with this ID was not found!'
            })
        }

        const category = await Category.findById(req.body.category)
        if (!category) {
            return res.status(500).json({
                success: false,
                message: 'Category for this product was not found!'
            })
        }

        let productPictures = []
        const basePath = `${req.protocol}://${req.get('host')}/uploads/`
        if (req.files) {
            req.files.map(file => {
                productPictures.push(`${basePath}${file.filename}`)
            })
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                slug: slugify(req.body.name),
                category: category,
                createdBy: req.user._id,
                price: req.body.price,
                quantity: req.body.quantity,
                description: req.body.description,
                offer: typeof req.body.offer !== 'undefined' ? req.body.offer : req.body.price,
                productPictures: productPictures
            },
            {new: true}
        )
        if (!product) {
            return res.status(500).json({success: false, message: 'Product was not updated!'})
        }
        return res.status(201).json({
            message: 'Product has been updated!',
            product: product,
            files: req.files
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const deleteProduct = async (req, res) => {
    try {
        Product.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({success: false, message: 'Something went wrong!'})
            }
            if (!doc) {
                return res.status(404).json({success: false, message: 'Product was not found!'})
            }
            res.json({success: true, message: 'Product was deleted!', doc: doc})
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductsByCategorySlug,
    getProductDetail,
    updateProduct,
    deleteProduct
}