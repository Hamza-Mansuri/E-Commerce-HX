import Message from "../../components/Message";

import Loader from "../../components/Loader";

import { Link } from "react-router";

import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  //getUserOrders
  // getMyOrders: builder.query({

  //     query: () => ({

  //         url: `${ORDERS_URL}/mine`
  //     }),
  //     keepUnusedDataFor: 5
  // }),

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  console.log(orders); // Log to inspect the data structure

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error?.data?.Message || error.error}</Message>
      ) : (
        <table className="w-[80%]">
          <thead className="border-b-2">
            <tr>
              <td className="p-2">Image</td>
              <td className="p-2">ID</td>
              <td className="p-2">Date</td>
              <td className="p-2">Total</td>
              <td className="p-2">Paid</td>
              <td className="p-2">Delivered</td>
              <td className="p-2">Order Details</td>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <img
                  src={order.orderItems[0].image}
                  alt={order.user}
                  className="w-[10rem] mb-5 rounded-lg"
                />

                <td className="p-2">{order._id}</td>
                <td className="p-2">{order.createdAt.substring(0, 10)}</td>
                <td className="p-2">$ {order.totalPrice}</td>

                <td className="p-2">
                  {order.isPaid ? (
                    <Message variant="success">Paid</Message>
                  ) : (
                    <Message variant="info">Pending</Message>
                  )}
                </td>

                <td className="p-2">
                  {order.isDelivered ? (
                    <Message variant="success">Delivered</Message>
                  ) : (
                    <Message variant="info">Pending</Message>
                  )}
                </td>

                <td className="px-2 py-2">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-pink-200 text-black py-2 px-3 rounded">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrder;
