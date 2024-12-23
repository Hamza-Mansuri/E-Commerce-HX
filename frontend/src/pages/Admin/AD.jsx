import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useGetOrdersQuery,
} from "../../redux/api/orderApiSlice";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AD = () => {
  const { data: totalOrdersData } = useGetTotalOrdersQuery();
  const { data: totalSalesData } = useGetTotalSalesQuery();
  const { data: salesByDateData } = useGetTotalSalesByDateQuery();
  const { data: ordersData } = useGetOrdersQuery();

  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalSales: 0,
    recentOrders: [],
    salesChartData: {
      labels: [],
      datasets: [],
    },
  });

  // useEffect(() => {
  //   if (totalOrdersData && totalSalesData && salesByDateData && ordersData) {
  //     const totalOrders = totalOrdersData?.totalOrders || 0;
  //     const totalSales = totalSalesData?.totalSales || 0;
  //     const recentOrders = ordersData || [];

  //     const salesChartData = {
  //       labels: salesByDateData?.map((item) => item._id) || [],
  //       datasets: [
  //         {
  //           label: "Sales Over Time",
  //           data: salesByDateData?.map((item) => item.totalSales) || [],
  //           borderColor: "#06b6d4",
  //           backgroundColor: "rgba(6, 182, 212, 0.2)",
  //           tension: 0.4,
  //         },
  //       ],
  //     };

  //     setDashboardData({
  //       totalOrders,
  //       totalSales,
  //       recentOrders,
  //       salesChartData,
  //     });
  //   }
  // }, [totalOrdersData, totalSalesData, salesByDateData, ordersData]);


  useEffect(() => {
        if (salesDetail && Array.isArray(salesDetail)) {
            // Filter out invalid entries
            const filteredSalesData = salesDetail.filter(item => item._id && item.totalSales !== undefined);
    
            // Map to formatted data for the chart
            const formattedSalesData = filteredSalesData.map(item => ({
                x: new Date(item._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }), // Format date
                y: item.totalSales, // Total sales value
            }));
    
            // Update chart state
            setState(prevState => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: formattedSalesData.map(item => item.x), // Dates as labels
                    },
                },
                series: [
                    { name: "Sales", data: formattedSalesData.map(item => item.y) }, // Sales data
                ],
            }));
    
            console.log("Formatted sales data for chart:", formattedSalesData);
        } else {
            console.warn("Invalid or empty salesDetail.");
            setState(prevState => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: ["No Data"], // Fallback for x-axis labels
                    },
                },
                series: [{ name: "Sales", data: [0] }], // Fallback for series
            }));
        }
    }, [salesDetail]);

  const { totalOrders, totalSales, recentOrders, salesChartData } =
    dashboardData;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-700">Total Sales</h3>
          <p className="text-2xl font-bold text-teal-500">
            ${totalSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-700">Total Orders</h3>
          <p className="text-2xl font-bold text-teal-500">
            {totalOrders.toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-700">Total Customers</h3>
          <p className="text-2xl font-bold text-teal-500">
            {recentOrders.length}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-4">
          Sales Over Time
        </h4>
        <Line data={salesChartData} />
      </div>

      {/* Orders Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-700 mb-4">
          Recent Orders
        </h4>
        <table className="w-full border-collapse border border-gray-200 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-200">Order ID</th>
              <th className="px-4 py-2 border border-gray-200">Customer</th>
              <th className="px-4 py-2 border border-gray-200">Total Price</th>
              <th className="px-4 py-2 border border-gray-200">Status</th>
              <th className="px-4 py-2 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-200">
                  {order._id}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {order.user?.username || "N/A"}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  ${order.totalPrice.toLocaleString()}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {order.isDelivered ? "Delivered" : "Pending"}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  <button className="text-teal-500 hover:underline">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AD;
