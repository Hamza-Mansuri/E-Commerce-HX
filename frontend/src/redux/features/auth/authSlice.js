import { createSlice } from "@reduxjs/toolkit";

//in the inititaState we are providing the userInfo 
const initialState = {

    //we are gonna store the user info in localstorage and cookie as well.
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,

    //if we have the userinfo so parse it with the JSON
}

const authSlice = createSlice({

    name: 'auth',
    initialState, // declare initialState manually.

    reducers: {

        setCredential: (state, action) => {

            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload))

            const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem('expirationTime', expirationTime)
        },

        //setting the credential while logging out
        logout: (state) => {

            state.userInfo = null;
            localStorage.clear();
        },
    },
});

export const { setCredential, logout } = authSlice.actions;

export default authSlice.reducer;