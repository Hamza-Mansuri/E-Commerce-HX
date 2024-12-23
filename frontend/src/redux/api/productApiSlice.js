import { PRODUCT_URL, UPLOAD_URL } from "../features/constants";

import { apiSlice } from "./apiSlice";

const productApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({


        //commmon thing in builder.query is the are getting(fetching) things.
        getProducts: builder.query({

            //fetchProducts controller
            //New Concept
            query: ({keyword}) => ({

                url: `${PRODUCT_URL}`,
                params: {keyword},
            }),
            keepUnusedDataFor: 5,
            providesTags: ["Product"], //this is coming from apiSlice
        }),

        getProductById: builder.query({

            query: (productId) => ({url: `${PRODUCT_URL}/${productId}`}),
            providesTags: (result, error, productId) => [
                {type: "Product", id: productId},
            ],
        }),

        allProducts: builder.query({

            query: () => `${PRODUCT_URL}/allproducts`,
        }),


        getProductDetails: builder.query({

            query: (productId) => ({

                url: `${PRODUCT_URL}/${productId}`
            }),

            keepUnusedDataFor: 5,
        }),

        //mutation
        createProduct: builder.mutation({

            query: (productData) => ({

                url: `${PRODUCT_URL}`,
                method: "POST",
                body: productData,
            }),
            invalidatesTags: ["Product"],
        }),

        updateProduct: builder.mutation({

            //also de-structuring the form data
            query: ({productId, formData}) => ({

                url: `${PRODUCT_URL}/${productId}`,
                method: "PUT",
                body: formData,
            }),
        }),

        uploadProductImage: builder.mutation({

            query: (data) => ({

                url: `${UPLOAD_URL}`,
                method: "POST",
                body: data,
            }),
        }),

        deleteProduct: builder.mutation({

            query: (productId) => ({

                url: `${PRODUCT_URL}/${productId}`,
                method: "DELETE",

            }),
            providesTags: ["Product"],
        }),

        createReview: builder.mutation({

            query: (data) => ({

                url: `${PRODUCT_URL}/${data.productId}/reviews`,
                method: "POST",
                body: data,
            }),
            
        }),

        getTopProducts: builder.query({

            query: () => `${PRODUCT_URL}/top`,
            keepUnusedDataFor: 5,
        }),

        getNewProduct: builder.query({

            query: () => `${PRODUCT_URL}/new`,
            keepUnusedDataFor: 5,
        }),

        getFilteredProducts: builder.query({

            query: ({checked, radio}) => ({

                url: `${PRODUCT_URL}/filtered-products`,
                method: "POST",
                body: {checked,radio},
            }),
        }),
        
    }),
});

export const 
{
    useGetProductsQuery,
    useGetProductByIdQuery,
    useAllProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useGetNewProductQuery,
    useUploadProductImageMutation,
    useGetFilteredProductsQuery,

} = productApiSlice