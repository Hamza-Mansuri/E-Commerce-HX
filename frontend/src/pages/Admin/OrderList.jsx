import Message from "../../components/Message";

import Loader from "../../components/Loader";

import { Link } from "react-router";

import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";

import AdminMenu from "./AdminMenu";

const OrderList = () => {
  //getAllOrders
  // getOrders: builder.query({

  //     query: () => ({

  //         url: ORDERS_URL
  //     })
  // }),
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <table className="container mx-auto">
          <AdminMenu />

          <thead className="w-full border">
            <tr className="mb-[5rem]">
              <td className="text-left pl-1">ITEMS</td>
              <td className="text-left pl-1">ID</td>
              <td className="text-left pl-1">USER</td>
              <td className="text-left pl-1">DATA</td>
              <td className="text-left pl-1">TOTAL</td>
              <td className="text-left pl-1">PAID</td>
              <td className="text-left pl-1">DELIVERED</td>
              <td className="text-left pl-1">ORDER DETAILS</td>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="items-center">
                  <img
                    src={order.orderItems[0].image}
                    alt=""
                    // className="h-20 w-20 object-cover rounded-lg"
                    className="w-[12rem] pt-4 rounded-lg"
                  />
                </td>

                <td className="items-center">{order._id}</td>

                <td className="items-center">
                  {order.user ? order.user.username : "N/A"}
                </td>

                <td className="items-center">
                  {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                </td>

                <td className="items-center">$ {order.totalPrice}</td>

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
    </>
  );
};

export default OrderList;
