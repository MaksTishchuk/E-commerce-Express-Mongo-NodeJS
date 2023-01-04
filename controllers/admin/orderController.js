const Order = require('../../models/orderModel')


const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .select("_id user paymentStatus paymentType orderStatus totalAmount items")
            .populate([
                {path: "items.productId", select: "_id name productPictures"},
                {path: "user", select: "_id email username firstName lastName"},
                {
                    path: "addressId",
                    select: "_id fullName, mobilePhone, country, city, zipCode, address"
                },
            ])
            .sort('-createdAt')
        if (!orders) {
            return res.status(500).json({success: false, message: 'Orders were not found!'})
        }
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong!", error: error.message})
    }
}

const getDetailOrder = async (req, res) => {
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
        res.status(500).json({message: "Something went wrong!", error: error.message})
    }
}

const updateOrder = async (req, res) => {
    try {
        await Order.updateOne(
            {_id: req.body.id, "orderStatus.type": req.body.type},
            {
                $set: {
                    "orderStatus.$": [
                        {type: req.body.type, date: new Date(), isCompleted: true},
                    ],
                },
            }
        ).exec((error, order) => {
            if (error) return res.status(400).json({
                message: "Can`t update order!",
                error: error.message
            })
            if (order) {
                return res.status(201).json({
                    message: 'Order has been updated!',
                    order: order
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong!", error: error.message})
    }
}

module.exports = {
    getAllOrders, getDetailOrder, updateOrder
}
