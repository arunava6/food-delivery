import { createContext, useEffect, useState } from "react";
import axios from "axios"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "https://food-delivery-backend-0vvs.onrender.com";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    // const addToCart = async (itemId) => {
    //     if (!cartItems[itemId]) {
    //         setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
    //     }
    //     else {
    //         setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
    //     }
    //     if (token) {
    //         await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
    //     }
    // }

    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to local storage
            return updatedCart;
        });
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };
    

    // const removeFromCart = async (itemId) => {
    //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    //     if(token){
    //         await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
    //     }
    // }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) };
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to local storage
            return updatedCart;
        });
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };
    

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                totalAmount += itemInfo.price * cartItems[item];
            }

        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartData);
            localStorage.setItem("cart", JSON.stringify(response.data.cartData)); // Save to local storage
        } catch (error) {
            console.error("Error loading cart:", error);
            setCartItems(JSON.parse(localStorage.getItem("cart")) || {}); // Load from local storage if API fails
        }
    };
    

    // const loadCartData=async(token)=>{
    //     const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
    //     setCartItems(response.data.cartData);
    // }
    // useEffect(() => {
    //     async function loadData() {
    //         await fetchFoodList();
    //         if (localStorage.getItem("token")) {
    //             setToken(localStorage.getItem("token"))
    //             await loadCartData(localStorage.getItem("token"))
    //         }
    //     }
    //     loadData();
    // }, [])

    const clearCart = () => {
        setCartItems({}); // Reset cart items state
        localStorage.removeItem("cart"); // Remove cart data from localStorage
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            } else {
                setCartItems({});  // Reset cart only if the user logs out
            }
        }
        loadData();
    }, [token]);  // Depend on `token`, so it reloads on login/logout


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        clearCart
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
