const Cart = require("../models/cartModel")


const addItemToCart = (req, res) => {
    Cart.findOne({user: req.user._id}).exec((error, cart) => {
        if (error) return res.status(400).json({error})
        if (cart) {
            const product = req.body.cartItems.product
            const item = cart.cartItems.find(c => c.product == product)
            if (item) {
                Cart.findOneAndUpdate({user: req.user._id, "cartItems.product": product}, {
                    "$set": {
                        "cartItems.$": {
                            ...req.body.cartItems,
                            quantity: item.quantity + req.body.cartItems.quantity
                        }
                    }
                }, {new: true}).exec((error, _cart) => {
                    if (error) return res.status(400).json({error})
                    if (_cart) {
                        return res.status(201).json({cart: _cart})
                    }
                })
            } else {
                Cart.findOneAndUpdate({user: req.user._id}, {
                    "$push": {
                        "cartItems": req.body.cartItems
                    }
                }, {new: true}).exec((error, _cart) => {
                    if (error) return res.status(400).json({error})
                    if (_cart) {
                        return res.status(201).json({cart: _cart})
                    }
                })
            }
        } else {
            const cart = new Cart({
                user: req.user._id,
                cartItems: req.body.cartItems,
            })
            cart.save((error, cart) => {
                if (error) return res.status(400).json({error})
                if (cart) {
                    return res.status(201).json({cart})
                }
            })
        }
    })
}

const getCartItems = async (req, res) => {
    try {
        Cart.findOne({user: req.user._id})
            .populate("cartItems.product", "_id name price productPictures")
            .exec((error, cart) => {
                if (error) return res.status(400).json({
                    error: error.message
                })
                if (cart) {
                    let cartItems = {}
                    let totalCartPrice = 0
                    cart.cartItems.forEach((item, index) => {
                        cartItems[item.product._id.toString()] = {
                            _id: item.product._id.toString(),
                            name: item.product.name,
                            img: item.product.productPictures[0].img,
                            price: item.product.price,
                            qty: item.quantity,
                            totalPrice: item.product.price * item.quantity
                        }
                        totalCartPrice += item.product.price * item.quantity
                    })
                    res.status(200).json({totalCartPrice: totalCartPrice, cartItems: cartItems})
                }
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const deleteItemFromCart = async (req, res) => {
    try {
        const productId = req.params.productId
        if (productId) {
            Cart.updateOne(
                {user: req.user._id},
                {
                    $pull: {
                        cartItems: {
                            product: productId,
                        },
                    },
                }
            ).exec((error, result) => {
                if (error) return res.status(400).json({
                    error: error.message
                })
                if (result) {
                    res.status(202).json({success: true, message: 'Product was deleted from cart!'})

                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

module.exports = {
    addItemToCart, getCartItems, deleteItemFromCart
}