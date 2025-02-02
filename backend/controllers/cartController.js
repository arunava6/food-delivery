import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({
            message: "Added to Cart",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({
            message: "remove from Cart",
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}


// fetch user cart data
// const getCart = async (req, res) => {
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;
//         res.json({
//             success:true,
//             cartData
//         })
//     } catch (error) {
//         console.log(error);
        
//     }
// }

const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);  // Use req.user.id
        let cartData = userData.cartData || {};  // Default to empty cart
        res.json({ success: true, cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch cart" });
    }
};


export { addToCart, removeFromCart, getCart }

