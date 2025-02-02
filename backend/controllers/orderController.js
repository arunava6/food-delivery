import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend
const placeOrder = async (req, res) => {

    const frontend_url = "https://food-delivery-frontend-mr3d.onrender.com";
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentMethod: req.body.paymentMethod,
            payment: req.body.paymentMethod === 'cod' ? false : true,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        if (req.body.paymentMethod === 'cod') {
            // await newOrder.save();
            await orderModel.findByIdAndUpdate(newOrder._id, { payment: true }); 
            res.json({
                success: true,
                message: true,
            });
            return;
        }

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price*100 
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 20*100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({
            success: true,
            session_url: session.url
        })
    } catch (error) {
        console.log(error);

    }
}


const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({
                message: true,
                success: true,
            })
        // await newOrder.save();
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({
                message: "Not paid",
                success: false,
            })
        }
    }
    catch (error) {
        console.log(error);

    }
}

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({
            success: true,
            data: orders
        })
    } catch (error) {
        console.log(error);

    }
}

// listing order for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({payment:true});
        res.json({
            success: true,
            data: orders,
        })
    } catch (error) {
        console.log(error);
    }
}

// api for updating order status
const updateStatus =async(req ,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({
            success:true,
            message:"Status Updated"
        })
    } catch (error) {
        console.log(error);
        
    }
}


export { placeOrder, verifyOrder, userOrders, listOrders,updateStatus }












// import orderModel from "../models/orderModel.js";
// import userModel from '../models/userModel.js';
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const placeOrder = async (req, res) => {
//     const frontend_url = "http://localhost:5174";

//     try {
//         let totalAmount = 0;

//         const line_items = req.body.items.map((item) => {
//             totalAmount += item.price * item.quantity;
//             return {
//                 price_data: {
//                     currency: "inr",
//                     product_data: { name: item.name },
//                     unit_amount: item.price * 100
//                 },
//                 quantity: item.quantity
//             };
//         });

//         // Add delivery charge
//         const deliveryCharge = 30; // Increased from ₹20 to ₹30
//         totalAmount += deliveryCharge;

//         line_items.push({
//             price_data: {
//                 currency: "inr",
//                 product_data: { name: "Delivery Charges" },
//                 unit_amount: deliveryCharge * 100
//             },
//             quantity: 1
//         });

//         // Ensure minimum Stripe charge
//         if (totalAmount < 50) {
//             return res.status(400).json({ success: false, message: "Minimum order amount must be ₹50" });
//         }

//         // Create Stripe session
//         const session = await stripe.checkout.sessions.create({
//             line_items: line_items,
//             mode: "payment",
//             success_url: `${frontend_url}/verify?success=true&userId=${req.body.userId}&address=${encodeURIComponent(req.body.address)}`,
//             cancel_url: `${frontend_url}/verify?success=false`
//         });

//         res.json({
//             success: true,
//             session_url: session.url
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Error creating Stripe session" });
//     }
// };

// // Verify order after Stripe payment
// const verifyOrder = async (req, res) => {
//     const { userId, success, address } = req.body;

//     try {
//         if (success === "true") {
//             // Fetch cart items from the user model
//             const user = await userModel.findById(userId);
//             const cartItems = user.cartData || {};

//             // Convert cart items into order format and get prices for each item
//             let orderItems = [];
//             let totalAmount = 0;

//             for (let itemId in cartItems) {
//                 if (cartItems.hasOwnProperty(itemId)) {
//                     const itemDetails = await someItemModel.findById(itemId); // Ensure the model is correct
//                     if (itemDetails) {
//                         const price = itemDetails.price;
//                         const quantity = cartItems[itemId];
//                         orderItems.push({
//                             itemId: itemId,
//                             quantity: quantity,
//                             price: price
//                         });
//                         totalAmount += price * quantity;
//                     }
//                 }
//             }

//             // Add delivery charge
//             const deliveryCharge = 30;
//             totalAmount += deliveryCharge;

//             // Create order **only after successful payment**
//             const newOrder = new orderModel({
//                 userId: userId,
//                 items: orderItems,
//                 amount: totalAmount,
//                 address: address,
//                 payment: true
//             });
//             await newOrder.save();

//             // Clear cart after successful order
//             await userModel.findByIdAndUpdate(userId, { cartData: {} });

//             res.json({ success: true, message: "Order placed successfully" });

//         } else {
//             // Do not create an order for unsuccessful payments
//             res.json({ success: false, message: "Payment failed" });
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Error verifying order" });
//     }
// };

// // Get user orders
// const userOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({ userId: req.body.userId });
//         res.json({
//             success: true,
//             data: orders
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Error fetching orders" });
//     }
// };

// // List all orders (Admin Panel)
// const listOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({});
//         res.json({
//             success: true,
//             data: orders,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Error fetching orders" });
//     }
// };

// // Update order status
// const updateStatus = async (req, res) => {
//     try {
//         await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
//         res.json({
//             success: true,
//             message: "Status Updated"
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Error updating status" });
//     }
// };

// export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
