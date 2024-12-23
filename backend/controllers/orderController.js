import Order from "../models/orderModel.js";

import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/ProductModal.js";

// Utility Function


// Utility Function
function calcPrice(orderItems) {

    const itemsPrice = parseFloat(orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxRate = 0.15;
    const taxPrice = parseFloat((itemsPrice * taxRate).toFixed(2));


    const totalPrice = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    return {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    };
}


const createOrder = asyncHandler(async(req, res) => {

    try 
    {
        
        const { orderItems, shippingAddress, paymentMethod } = req.body

        // if(!orderItems && orderItems.length === 0)
        // {
        //     res.status(400)
        //     throw new Error("No Order Items")
        // }
        
        if (!orderItems || orderItems.length === 0) {
            res.status(400).json({ error: "Order items are required" });
            return;
        }
        if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            res.status(400).json({ error: "Shipping address is incomplete" });
            return;
        }
        if (!paymentMethod) {
            res.status(400).json({ error: "Payment method is required" });
            return;
        }
        

        const itemsFromDB = await Product.find({

            //it will find the specific product, while iterating through the map method.
            _id: { $in: orderItems.map((x) => x._id) }
        })

        const dbOrderItems = orderItems.map((itemFromClient) => {

            //the item which client has ordered, we have to match that from DB
            const matchingItemFromDB = itemsFromDB.find((itemFromDB) => itemFromDB._id.toString() == itemFromClient._id)

            if(!matchingItemFromDB)
            {
                res.status(404)
                throw new Error(`Product Not Found: ${itemFromClient._id}`)
            }

            return {

                ...itemFromClient,
                product: itemFromClient._id,
                price: matchingItemFromDB.price,
                _id: undefined,

            };
        });

        const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrice(dbOrderItems);

        const order = new Order({

            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

const getAllOrders = asyncHandler(async(req, res) => {

    try 
    {
    
        const order = await Order.find({}).populate("user", "id username");
        res.json(order);

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
})

const getUserOrders = async(req, res) => {

    try 
    {
    
        const order = await Order.find({ user: req.user._id })
        res.json(order)

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

const countTotalOrders = async(req,res) => {

    try 
    {
    
        const totalOrders = await Order.countDocuments();
        res.json({totalOrders})

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

const calculateTotalSales = async(req,res) => {

    try 
    {
    
        const order = await Order.find()
        const totalSales = order.reduce((sum, order) => sum + order.totalPrice, 0)

        res.json({totalSales})

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

const calculateTotalSalesByDate = async(req, res) => {

    try 
    {
    
        const salesByDate = await Order.aggregate([

            {
                $match: {
                    isPaid: true,
                },
            },
            // {
            //     $group: {
            //         _id: {
            //             $dateToString : { format: "%Y-%m-%d", date: "$paidAt" },
            //         },
            //         totalSales: { $sum: "$totalPrice" },
            //     },
            // },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
                    totalSales: { $sum: "$totalPrice" },
                },
            }
            
        ]);

        res.json(salesByDate);

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

const findOrderById = async(req, res) => {

    try 
    {
    
        const order = await Order.findById(req.params.id).populate("user", "username email");

        if(order)
        {
            res.json(order)
        }
        else
        {
            res.status(404)
            throw new Error("Order not found")
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

const markOrderAsPaid = async(req, res) => {

    try 
    {
    
        const order = await Order.findById(req.params.id)

        if(order)
        {
            order.isPaid = true
            order.paidAt = Date.now()
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address,
            };

            const updateOrder = await order.save();
            res.json(updateOrder)
        }
        else
        {
            res.status(404)
            throw new Error("Order Not Found")
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

const markOrderAsDeliver = async(req, res) => {

    try 
    {
    
        const order = await Order.findById(req.params.id)

        if(order)
        {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updateOrder = await order.save()
            res.json(updateOrder)
        }
        else
        {
            res.status(404)
            throw new Error("Order Not Found")
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

export { createOrder, getAllOrders, getUserOrders, countTotalOrders, calculateTotalSales, calculateTotalSalesByDate, findOrderById, markOrderAsPaid, markOrderAsDeliver };