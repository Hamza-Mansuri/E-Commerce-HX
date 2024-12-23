import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],

  reducers: {
    addToFavorite: (state, action) => {
      //Checking if the product already favorite
      if (!state.some((product) => product._id == action.payload._id)) {
        state.push(action.payload);
      }
    },

    removeFromFavorites: (state, action) => {
      //Remove the Product with Match ID
      // filter is generally used to remove things
      return state.filter((product) => product._id != action.payload._id)
    },

    setFavorites: (state, action) => {

        //Set the Favourites from local storage
        return action.payload
    }
  },
});

export const {addToFavorite, removeFromFavorites, setFavorites} = favoriteSlice.actions;
export const selectFavorites = (state) => state.favorites;

export default favoriteSlice.reducer;