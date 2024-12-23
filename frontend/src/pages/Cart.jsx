import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { FaTrash } from "react-icons/fa";

import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

// const addToCartHandler = async () => {
//   try {
//     dispatch(addToCart({ ...product, qty: Number(qty) }));
//     navigate('/cart');
//   } catch (error) {
//     console.error(error);
//     toast.error("Add To Cart Failed");
//   }
// };


  const removeFromCartHandler = (id) => {

    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {

    navigate('/login?redirect=/shipping')
  }

  return (
    <>
      <div className="container flex justify-around items-start flex wrap mx-auto mt-8">
        {cartItems.length == 0 ? (
          <div>
            Your cart is empty <Link to="/shop">Go To Shop</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-enter mb-[1rem] pb-2">
                  <div className="w-[20rem] h-[20rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link to={`/product/${item._id}`} className="text-pink-500 text-xl">
                      {item.name}
                    </Link>
                    <div className="mt-2 text-white text-lg">{item.brand}</div>
                    <div className="text-xl my-4 font-bold mr-2 px-2.5 py-0.5 text-pink-800 rounded-full dark:bg-pink-900 dark:text-pink-300">
                      ${item.price}
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div className="w-24">
                    <select
                      className="w-full p-1 border rounded text-black"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500 mr-[5rem]"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-[1rem] mt-[0.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <div className="text-2xl font-bold">
                    ${""}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </div>

                  <button
                    className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-auto"
                    disabled={cartItems.length == 0}
                      onClick={checkoutHandler}
                  >
                    Procees To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
