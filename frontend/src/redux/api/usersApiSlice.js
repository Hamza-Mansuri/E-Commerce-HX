import { apiSlice } from './apiSlice';

import { USERS_URL } from '../features/constants';


export const usersApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({

        //if we are providing any data, we have to write mutation.
        //and if we weren't providing any data, so write query.
        // the nameof endpoint is login
        login: builder.mutation({

            query: (data) => ({

                // http://localhost:5000/api/users
                //backend
                //router.post('/auth', loginUser)
                url: `${USERS_URL}/auth`,
                method: "POST",
                body: data,
            }),
        }),

        logout: builder.mutation({

            query: () => ({

                url: `${USERS_URL}/logout`,
                method: "POST",
                
            }),
        }),

        register: builder.mutation({

            query: (data) => ({

                url: `${USERS_URL}`,
                method: "POST",
                body: data,
            }),
        }),

        profile: builder.mutation({
            query: (data) => ({
              url: `${USERS_URL}/profile`,
              method: "PUT",
              body: data,
            }),
        }),

        //From Here We are creating api's for Admin Rights

        getUsers: builder.query({

            query: () => ({

                url: USERS_URL,
            }),
            providesTags: ['Users'], //this is coming from apiSlice
            keepUnusedDataFor : 5,
        }),

        deleteUser: builder.mutation({

            query: userId => ({

                url: `${USERS_URL}/${userId}`,
                method: "DELETE",
            }),
        }),

        getUserDetails: builder.query({

            query: (id) => ({

                url: `${USERS_URL}/${id}`,
                
            }),
            keepUnusedDataFor: 5,
        }),

        updateUser: builder.mutation({

            query: (data) => ({

                url: `${USERS_URL}/${data.userId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

    }),
});

// `use${Login}Mutation`

// `use${Login}Query`

export const {
    useLoginMutation, 
    useLogoutMutation, 
    useRegisterMutation, 
    useProfileMutation, 
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,

} = usersApiSlice;