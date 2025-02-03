import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
const Cart = ({setShowLogin}) => {

  const { cartItems, food_list, removeFromCart,getTotalCartAmount,url,token } = useContext(StoreContext);

  const navigate=useNavigate();

  const [showPopup,setShowPopup] = useState(false);
  const isLoggedIn =  !!token;

  const handleCheckout=()=>{
    if(isLoggedIn){
      navigate('/order');
    }else{
      setShowPopup(true);
    }
  };


  const handleLoginPopup = () => {
    setShowLogin(true);  // Trigger the login popup
    setShowPopup(false);  // Close the cart popup
  };



  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>Rs. {item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>Rs. {item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs. {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rs. {getTotalCartAmount()===0?0:20}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs. {getTotalCartAmount()===0?0:getTotalCartAmount()+20}</b>
            </div>
          </div>
          {/* <button onClick={()=>navigate('/order')} >PROCEED TO CHECKOUT</button> */}
          <button onClick={handleCheckout} >PROCEED TO CHECKOUT</button>


        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>


      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Please create an account first!</p>
            <button onClick={handleLoginPopup}>Sign Up</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}


    </div>
  )
}

export default Cart










