import { apiSlice } from "./apiSlice";

import { CATEGORY_URL } from "../features/constants";

export const categoryApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({

        createCategory: builder.mutation({

            query: (newCategory) => ({

                url: `${CATEGORY_URL}`,
                method: "POST",
                body: newCategory, //name of category
            }),
        }),

        updateCategory: builder.mutation({

            query: ({categoryId, updatedCategory}) => ({

                url: `${CATEGORY_URL}/${categoryId}`,
                method: "PUT",
                body: updatedCategory, //updated name
            }),
        }),
 
        deleteCategory: builder.mutation({

            query: (categoryId) => ({

                url: `${CATEGORY_URL}/${categoryId}`,
                method: "DELETE",
                
            }),
        }),

        fetchCategories: builder.query({

            query: () => `${CATEGORY_URL}/categories`,
        }),

    }),
});

export const {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery,

} = categoryApiSlice