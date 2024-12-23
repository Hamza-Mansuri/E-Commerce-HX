import Chart from "react-apexcharts";

import { useGetUsersQuery } from "../../redux/api/usersApiSlice";

import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";

import AdminMenu from "./AdminMenu";

import OrderList from "./OrderList";

import Loader from "../../components/Loader";

const AdminDashboard = () => {

    //countTotalOrders
    // getTotalOrders: builder.query({

    //     query: () => `${ORDERS_URL}/total-orders`
    // }),
    const {data: orders, loadingTwo} = useGetTotalOrdersQuery()

    // getUsers: builder.query({

    //     query: () => ({

    //         url: USERS_URL,
    //     }),
    //     providesTags: ['Users'], //this is coming from apiSlice
    //     keepUnusedDataFor : 5,
    // }),
    const {data: customers, isLoading: loading} = useGetUsersQuery()

    //calculateTotalSales
    // getTotalSales: builder.query({

    //     query: () => `${ORDERS_URL}/total-sales`
    // }),
    const {data: sales, isLoading} = useGetTotalSalesQuery()

    //calculateTotalSalesByDate
    // getTotalSalesByDate: builder.query({

    //     query: () => `${ORDERS_URL}/total-sales-by-date`
    // })
    const {data: salesDetail} = useGetTotalSalesByDateQuery()

    const [state, setState] = useState({

        options: {

            chart: {

                type: "line",
            },
            tooltip: {

                theme: "dark",
            },
            colors: ["#00E396"],

            dataLabels: {

                enabled: true,
            },
            stroke: {

                curve: "smooth",
            },
            title: {

                text: "Sales Trend",
                align: "left",
            },
            grid: {

                borderColor: "#ccc",
            },
            markers: {

                size: 1,
            },
            xaxis: {

                categories: [],
                title: {

                    text: "Date",
                },
            },
            yaxis: {

                title: {
                    text: "Sales",
                },
                min: 0,
            },
            legend: {

                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5,

            },

        },

        series: [{ name: "Sales", data: [] }]
    });

    // useEffect(() => {

    //     if(salesDetail)
    //     {
    //         // Formate the data from SalesDetail to match the chart's Requirement

    //         const formattedSalesDate = salesDetail.map((item) => ({

    //             x: item._id,
    //             y: item.totalSales,
    //         }));

    //         setState((prevState) => ({

    //             // Setting the prevState
    //             ...prevState,

    //             //then we have to change the options
    //             options: {

    //                 // inside that we are getting all of the prevState options
    //                 ...prevState.options,

    //                 // providing new xaxis
    //                 xaxis: {

    //                     categories: formattedSalesDate.map((item) => item.x), // Dates
    //                 },
    //             },

    //             // providing new series
    //             series: [ 
    //                 { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
    //             ], // Sales
    //         }));
    //     }
    // }, [salesDetail] );


    // Updated with some CG
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

    

  return (

    <>

        <AdminMenu/>

        <section className="xl:ml-[4rem] md:ml-[0rem]">

            <div className="w-[80%] flex justify-around flex-wrap">

                <div className="rounded-lg bg-blue-100 p-5 w-[20rem] mt-5">

                    <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">

                        $

                    </div>

                    <p className="mt-5">

                        Sales
                    </p>

                    <h1 className="text-lg font-bold">

                        $ {isLoading ?  <Loader/>  : sales.totalSales.toFixed(2)}

                    </h1>

                </div>

                <div className="rounded-lg bg-blue-100 p-5 w-[20rem] mt-5">

                    <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">

                        🤵

                    </div>

                    <p className="mt-5">

                        Customers
                    </p>

                    <h1 className="text-lg font-bold">

                         {isLoading ?  <Loader/>  : customers?.length}

                    </h1>

                </div>

                <div className="rounded-lg bg-blue-100 p-5 w-[20rem] mt-5">

                    <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">

                        📦

                    </div>

                    <p className="mt-5">

                        All Orders
                    </p>

                    <h1 className="text-lg font-bold">

                         {isLoading ?  <Loader/>  : orders?.totalOrders}

                    </h1>

                </div>

            </div>

            {/* Chart Section */}

            <div className="ml-[10rem] mt-[4rem]">
                <Chart
                    options={state.options}
                    series={state.series}
                    type="line"
                    width="70%"
                />
            </div>


            <div className="mt-[4rem]">

                <OrderList/>

            </div>

        </section>

    </>
  );
};

export default AdminDashboard;
