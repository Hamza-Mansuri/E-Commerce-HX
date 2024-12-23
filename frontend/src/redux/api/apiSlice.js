//R
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../features/constants";

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL});

//create baseQuery by the inbuilt function of fetchQuery

//export a method called apiSlice

export const apiSlice = createApi(

    {
        //parameters
        baseQuery,
        tagTypes: ["Product", "Order", "User", " Category"],
        endpoints: () => ({}),
    }
);
