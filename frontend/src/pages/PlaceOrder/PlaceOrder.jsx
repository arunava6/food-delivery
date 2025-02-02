// import React, { useContext, useEffect, useState } from 'react'
// import './PlaceOrder.css'
// import { StoreContext } from '../../Context/StoreContext'
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const PlaceOrder = () => {

//   const { getTotalCartAmount, token, food_list, cartItems, url,clearCart } = useContext(StoreContext);

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     district: "",
//     zipcode: "",
//     // country: "",
//     phone: ""
//   })

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData(data => ({ ...data, [name]: value }))
//   }

//   const placeOrder = async (event) => {
//     event.preventDefault();
//     let orderItems = [];
//     food_list.map((item) => {
//       if (cartItems[item._id] > 0) {
//         let itemInfo = item;
//         itemInfo["quantity"] = cartItems[item._id];
//         orderItems.push(itemInfo);
//       }
//     })
    
//     let orderData={
//       address:data,
//       items:orderItems,
//       amount:getTotalCartAmount()+20,

//     }
//     let response=await axios.post(url+"/api/order/place",orderData,{headers:{token}})
//     if(response.data.success){
//       const {session_url} = response.data;
//       window.location.replace(session_url);
//     }
//     else{
//       alert("Error");
//     }
//   }


//   const handlePaymentSuccess = () => {
//     // Logic for handling successful payment
//     alert("Payment successful! Your order will be processed.");
//     // You can also navigate to an order confirmation page
//     clearCart();
//     navigate('/myorders');
//   };


//   const navigate = useNavigate();
//   useEffect(()=>{
//     if(!token){
//       navigate('/cart');
//     }else if(getTotalCartAmount()===0){
//       navigate('/cart')
//     }


//     const urlParams = new URLSearchParams(window.location.search);
//     const paymentStatus = urlParams.get('payment_status'); // Adjust based on your payment gateway's response

//     if (paymentStatus === 'success') {
//       handlePaymentSuccess();
//     }



//   },[token,getTotalCartAmount()])

//   return (
//     <form onSubmit={placeOrder} className='place-order'>
//       <div className="place-order-left">
//         <p className='title'>Delivery Information</p>
//         <div className="multi-fields">
//           <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
//           <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
//         </div>
//         <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
//         <input required name='street' onChange={onChangeHandler} value={(data.street)} type="text" placeholder='Street' />
//         <div className="multi-fields">
//           <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
//           <input required name='district' onChange={onChangeHandler} value={data.district} type="text" placeholder='District' />
//         </div>
//         <div className="multi-fields">
//           <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
//           {/* <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' /> */}
//           <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
//         </div>
        
//       </div>
//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>Rs. {getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>Rs. {getTotalCartAmount() === 0 ? 0 : 20}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>Rs. {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</b>
//             </div>
//           </div>
//           <button type="submit" >PROCEED TO PAYMENT</button>
//         </div>
//       </div>
//     </form>
//   )
// }

// export default PlaceOrder








// import React, { useContext, useEffect, useState } from 'react';
// import './PlaceOrder.css';
// import { StoreContext } from '../../Context/StoreContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const PlaceOrder = () => {
//     const { getTotalCartAmount, token, food_list, cartItems, url, clearCart } = useContext(StoreContext);
//     const [data, setData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         street: "",
//         city: "",
//         district: "",
//         zipcode: "",
//         phone: "",
//     });
//     const [paymentMethod, setPaymentMethod] = useState('online'); // Default payment method
//     const navigate = useNavigate();

//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     const placeOrder = async (event) => {
//         event.preventDefault();
//         let orderItems = [];
//         food_list.forEach((item) => {
//             if (cartItems[item._id] > 0) {
//                 let itemInfo = { ...item, quantity: cartItems[item._id] };
//                 orderItems.push(itemInfo);
//             }
//         });

//         let orderData = {
//             userId: localStorage.getItem("userId"), // Assuming userId is stored in localStorage
//             items: orderItems,
//             amount: getTotalCartAmount() + 20,
//             address: data,
//             paymentMethod: paymentMethod, // Include payment method in the order data
//         };

//         try {
//             const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

//             if (response.data.success) {
//                 if (paymentMethod === "online") {
//                     // Redirect to Stripe payment page
//                     window.location.replace(response.data.session_url);
//                 } else if (paymentMethod === "cod") {
//                     // Handle Cash on Delivery
//                     alert("Order placed successfully! Payment will be collected on delivery.");
//                     clearCart();
//                     navigate('/myorders');
//                 }
//             } else {
//                 alert("Error placing order");
//             }
//         } catch (error) {
//             console.error("Error placing order:", error);
//             alert("Error placing order");
//         }
//     };

//     useEffect(() => {
//         if (!token) {
//             navigate('/cart');
//         } else if (getTotalCartAmount() === 0) {
//             navigate('/cart');
//         }
//     }, [token, getTotalCartAmount()]);

//     return (
//         <form onSubmit={placeOrder} className='place-order'>
//             <div className="place-order-left">
//                 <p className='title'>Delivery Information</p>
//                 <div className="multi-fields">
//                     <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
//                     <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
//                 </div>
//                 <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
//                 <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
//                 <div className="multi-fields">
//                     <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
//                     <input required name='district' onChange={onChangeHandler} value={data.district} type="text" placeholder='District' />
//                 </div>
//                 <div className="multi-fields">
//                     <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
//                     <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
//                 </div>
//             </div>
//             <div className="place-order-right">
//                 <div className="cart-total">
//                     <h2>Cart Totals</h2>
//                     <div className="cart-total-details">
//                         <p>Subtotal</p>
//                         <p>Rs. {getTotalCartAmount()}</p>
//                     </div>
//                     <hr />
//                     <div className="cart-total-details">
//                         <p>Delivery Fee</p>
//                         <p>Rs. {getTotalCartAmount() === 0 ? 0 : 20}</p>
//                     </div>
//                     <hr />
//                     <div className="cart-total-details">
//                         <b>Total</b>
//                         <b>Rs. {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</b>
//                     </div>
//                     <div className="payment-method-section">
//                         <h3>Payment Method</h3>
//                         <div className="payment-method-options">
//                             <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
//                                 <input
//                                     type="radio"
//                                     name="paymentMethod"
//                                     value="online"
//                                     checked={paymentMethod === 'online'}
//                                     onChange={() => setPaymentMethod('online')}
//                                 />
//                                 <span>Online Payment</span>
//                             </label>
//                             <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
//                                 <input
//                                     type="radio"
//                                     name="paymentMethod"
//                                     value="cod"
//                                     checked={paymentMethod === 'cod'}
//                                     onChange={() => setPaymentMethod('cod')}
//                                 />
//                                 <span>Cash on Delivery</span>
//                             </label>
//                         </div>
//                     </div>
//                     <button type="submit">PROCEED TO PAYMENT</button>
//                 </div>
//             </div>
//         </form>
//     );
// };

// export default PlaceOrder;






import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  // Import Toastify

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url, clearCart } = useContext(StoreContext);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        district: "",
        zipcode: "",
        phone: "",
    });
    const [paymentMethod, setPaymentMethod] = useState('online'); // Default payment method
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const placeOrder = async (event) => {
        event.preventDefault();

        // Check if total amount is less than 50
        if (getTotalCartAmount() < 50) {
            toast.error("Minimum order should be Rs. 50");
            return; // Prevent further action if the amount is less than 50
        }

        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] };
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            userId: localStorage.getItem("userId"), // Assuming userId is stored in localStorage
            items: orderItems,
            amount: getTotalCartAmount() + 20,
            address: data,
            paymentMethod: paymentMethod, // Include payment method in the order data
        };

        try {
            const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

            if (response.data.success) {
                if (paymentMethod === "online") {
                    // Redirect to Stripe payment page
                    window.location.replace(response.data.session_url);
                } else if (paymentMethod === "cod") {
                    // Handle Cash on Delivery
                    alert("Order placed successfully! Payment will be collected on delivery.");
                    clearCart();
                    navigate('/myorders');
                }
            } else {
                alert("Error placing order");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order");
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, getTotalCartAmount()]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-fields">
                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                <div className="multi-fields">
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name='district' onChange={onChangeHandler} value={data.district} type="text" placeholder='District' />
                </div>
                <div className="multi-fields">
                    <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
                    <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
                </div>
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div className="cart-total-details">
                        <p>Subtotal</p>
                        <p>Rs. {getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cart-total-details">
                        <p>Delivery Fee</p>
                        <p>Rs. {getTotalCartAmount() === 0 ? 0 : 20}</p>
                    </div>
                    <hr />
                    <div className="cart-total-details">
                        <b>Total</b>
                        <b>Rs. {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</b>
                    </div>
                    <div className="payment-method-section">
                        <h3>Payment Method</h3>
                        <div className="payment-method-options">
                            <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={paymentMethod === 'online'}
                                    onChange={() => setPaymentMethod('online')}
                                />
                                <span>Online Payment</span>
                            </label>
                            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit">PROCEED TO PAYMENT</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
