// import React, { useContext, useEffect, useState } from 'react'
// import './MyOrders.css'
// import { StoreContext } from '../../Context/StoreContext';
// import axios from 'axios'
// import { assets } from '../../assets/assets';

// const MyOrders = () => {

//     const { url, token } = useContext(StoreContext);
//     const [data, setData] = useState([]);

//     const fetchOrders = async () => {
//         const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } })
//         setData(response.data.data);
//         // console.log(response.data.data);
//     }



//     useEffect(()=>{
//         if(token){
//             fetchOrders();
//         }
//     },[token])


//     return (
//         <div className='my-orders'>
//             <h2>My Orders</h2>
//             <div className="container">
//                 {data.map((order, index) => {
//                     return (
//                         <div key={index} className="my-orders-order">
//                             <img src={assets.parcel_icon} alt="" />
//                             <p>{order.items.map((item, index) => {
//                                 if(index===order.items.length-1){
//                                     return item.name+" x "+item.quantity
//                                 }
//                                 else{
//                                     return item.name+" x "+item.quantity+" , "
//                                 }
//                             })}</p>
//                             <p>${order.amount}.00</p>
//                             <p>Items: {order.items.length}</p>
//                             <p><span>&#x25cf;</span><b>{order.status}</b></p>
//                             <button onClick={fetchOrders}>Track Order</button>
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }

// export default MyOrders




















//chatgpt

import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [trackingOrderId, setTrackingOrderId] = useState(null); // Stores the clicked order's ID

    // Fetch user's orders
    const fetchOrders = async () => {
        if (!token) return;
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    // Handle click to track an order
    const handleTrackOrder = (orderId) => {
        setTrackingOrderId(orderId); // Only show status for clicked order
    };

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="container">
                    {orders.map((order) => (
                        <div key={order._id} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="Parcel Icon" />
                            <p>
                                {order.items.map((item, i) =>
                                    i === order.items.length - 1
                                        ? item.name + " x " + item.quantity
                                        : item.name + " x " + item.quantity + " , "
                                )}
                            </p>
                            <p>Rs. {order.amount}.00</p>
                            <p>Items: {order.items.length}</p>

                            {/* Show previous status before click, show updated status after click */}
                            <p>
                                <span>&#x25cf;</span> <b>{trackingOrderId === order._id ? order.status : order.status}</b>
                            </p>

                            {/* Button to track order */}
                            <button onClick={() => handleTrackOrder(order._id)}>
                                {trackingOrderId === order._id ? "Status: " + order.status : "Track Order"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
