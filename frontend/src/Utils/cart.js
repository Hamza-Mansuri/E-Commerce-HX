export const addDecimal = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //in this we are going to calculate the itemsPrice
  state.itemsPrice = addDecimal(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  //calculate the shipping price
  state.shippingPrice = addDecimal(state.itemsPrice > 100 ? 0 : 10);

  //calculate the Tax Price
  state.taxPrice = addDecimal(Number((0.15 * state.itemsPrice).toFixed(2)));

  //calculating the total Price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  //set the state to the localstorage
  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
