//R
import {configureStore} from '@reduxjs/toolkit';
//R
import {setupListeners} from '@reduxjs/toolkit/query/react';

import {apiSlice} from '../api/apiSlice';
//in apiSlice we have baseQuery, tagpoints, and endpoints.

import authReducer from './auth/authSlice';
//authSlice include credentials, expirationTime and logging out to clear(), and also initialState

import favoritesReducers from '../features/favorites/favoriteSlice';

import { getFavoritesFromLocalStorage } from '../../Utils/localStorage';

                    //if we get that, we have to spread out the result, otherwise return empty string
const initialFavorites = getFavoritesFromLocalStorage() || []


import cartSliceReducer from '../features/cart/cartSlice';

import shopReducer from '../features/shop/shopSlice';

const store = configureStore({

    reducer: {

        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        //register the favorites to store
        favorites: favoritesReducers,
        cart: cartSliceReducer,
        shop: shopReducer,
    },

    //also we have to preload the state of favorites
    preloadedState: {

        favorites: initialFavorites,
    },

    //register the middleware
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware), //concat middleware and apiSlice
    //set devtools true
    devTools: true,
});

//dispatch the store by setupListener

setupListeners(store.dispatch)

export default store;