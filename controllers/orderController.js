const Order = require('../models/orderModel')
const Cart = require('../models/cartModel')


const createOrder = async (req, res) => {
    try {
        await Cart.deleteOne({user: req.user._id}).exec(async (error, result) => {
            if (error) return res.status(400).json({error})
            if (result) {
                req.body.user = req.user._id;
                req.body.orderStatus = [
                    {
                        type: "ordered",
                        date: new Date(),
                        isCompleted: true,
                    },
                    {
                        type: "packed",
                        isCompleted: false,
                    },
                    {
                        type: "shipped",
                        isCompleted: false,
                    },
                    {
                        type: "delivered",
                        isCompleted: false,
                    },
                ]
                const order = new Order(req.body);
                await order.save((error, order) => {
                    if (error) return res.status(400).json({
                        message: "Can`t save order!",
                        error: error.message
                    })
                    if (order) {
                        return res.status(201).json({
                            message: 'Order has been created!',
                            order: order
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id})
            .select("_id paymentStatus paymentType orderStatus items totalAmount")
            .populate("items.productId", "_id name productPictures")
        if (!orders) {
            return res.status(500).json({success: false, message: 'Orders were not found!'})
        }
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.id
        if (orderId) {
            const order = await Order.findById(orderId)
                .populate([
                    {path: "items.productId", select: "_id name productPictures"},
                    {path: "user", select: "_id email username firstName lastName"},
                    {
                        path: "addressId",
                        select: "_id fullName, mobilePhone, country, city, zipCode, address"
                    },
                ])
                .sort('-createdAt')
            if (!order) {
                return res.status(500).json({success: false, message: 'Order was not found!'})
            }
            res.status(200).json(order)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}


module.exports = {
    createOrder,
    getAllOrders,
    getOrderDetail
}