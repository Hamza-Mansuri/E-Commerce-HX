import { useEffect } from "react";

import { Link, useParams } from "react-router";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import Message from "../../components/Message";

import Loader from "../../components/Loader";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  //first we have to take care of Route id which we have mentioned in main.jsx
  const { id: orderId } = useParams();

  //findOrderById
  // getOrderDetails: builder.query({

  //     query: (id) => ({

  //         url: `${ORDERS_URL}/${id}`
  //     })
  // }),
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  //markOrderAsDeliver
  // deliverOrder: builder.mutation({

  //     query: (orderId) => ({

  //         url: `${ORDERS_URL}/${orderId}/deliver`,
  //         method: "PUT"
  //     })
  // }),
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  //markOrderAsPaid
  // payOrder: builder.mutation({

  //     query: ({orderId, details}) => ({

  //         url: `${ORDERS_URL}/${orderId}/pay`,
  //         method: "PUT",
  //         body: details
  //     })
  // }),
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  //index.js paypal Route
  // getPaypalClientId: builder.query({

  //     query: () => ({

  //         url: PAYPAL_URL
  //     })
  // }),

  //   app.get("/api/config/paypal", (req, res) => {
  //     res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
  //   });

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  //PayPal Working
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        //these stuff are coming from paypalDispatch
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is Paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        //method
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();

    toast.success("Marked As Delivered")
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is Empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                {/* orderItems: 
                [
                    {
                        name:{ type: String, required: true},
                        qty:{ type: Number, required: true},
                        image:{ type: String, required: true},
                        price:{ type: Number, required: true},
                        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
                    },
                ], */}

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        ${(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 mb-4 pb-4 border-gray-300">
          <h2 className="mb-2 text-xl font-bold">Shipping</h2>

          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:- </strong>

            {order._id}
          </p>

          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Name:- </strong>

            {order.user.username}
          </p>

          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Email:- </strong>

            {order.user.email}
          </p>

          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Address:- </strong>
            {order.shippingAddress.address}, {order.shippingAddress.postalCode},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.country}.
          </p>

          <p className="mb-4 mt-4">
            <strong className="text-pink-500">PaymentMethod:- </strong>

            {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Message variant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message variant="info">Not Paid</Message>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]"> Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span>Item</span>
          <span>$ {order.itemsPrice}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$ {order.shippingPrice}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$ {order.taxPrice}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>$ {order.totalPrice}</span>
        </div>

        {!order.isPaid && (
          <div>
            {loadingPay && <Loader />}{" "}
            {isPending ? (
              <Loader />
            ) : (
              <div>
                <div>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  ></PayPalButtons>
                </div>
              </div>
            )}
          </div>
        )}

        {loadingDeliver && <Loader />}

        {/* {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )} */}

        {/* {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered ? (
          <Message variant="info">
            <div>
              <button
                type="button"
                className="bg-blue-200 text-white w-full py-2 px-3 rounded-lg"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          </Message>
        ) : (
          <Message variant="success">Delivered</Message>
        )} */}

        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <Message variant="info">
            <div>
              <button
                type="button"
                className="bg-blue-200 text-white w-full py-2 px-3 rounded-lg"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          </Message>
        // ) : (
        //   <Message variant="success">Delivered</Message>
        // )
        )}
      </div>
    </div>
  );
};

export default Order;
