import { createSlice } from "@reduxjs/toolkit";

import { updateCart } from "../../../Utils/cart";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      // we have to destructure things with ...item, but we don't want any of these 4 things, thats why we wright before the ...Item
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      //checking if the item exists in the cart or not
      const exitsItem = state.cartItems.find((x) => x._id == item._id);

      if (exitsItem) {
        //iterate through map, if there is cartItem, render that itm, if not, give all the data in the x.
        state.cartItems = state.cartItems.map(
          (x) => (x._id == exitsItem._id ? item : x)
          //   x._id === exitsItem._id ? { ...x, qty: x.qty + item.qty } : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
      // state.cartItems = state.cartItems.filter((x) => x._id == action.payload);

      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      return updateCart(state);
    },

    //     How it Works:
    // When the shippingAddress reducer is triggered:

    // An action is dispatched with a payload.
    // action.payload carries the new shipping address data.
    // The reducer updates the state.shippingAddress with the value in action.payload.

    // The entire state is then serialized into a JSON string and saved to localStorage under the key "cart".
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload; //Corrected
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    //this method is for those, who has added the products in their cart, and when they logout, all of the items should be gone
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,

  //this will be using in Shipping.jsx
  saveShippingAddress,
  savePaymentMethod,
  
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
