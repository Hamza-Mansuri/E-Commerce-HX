import { useEffect } from "react";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import {
  addToFavorite,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  removeFavoriteFromLocalStorage,
  getFavoritesFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();

  //this favorites, we are getting from the store
  const favorites = useSelector((state) => state.favorites) || [];

  //if its true give us all the data from database, if its not give us nothing, cause we won't haeve anything in localStorage
  const isFavorite = favorites.some((p) => p._id == product._id);

  useEffect(() => {
    //check the favorites from localstorage
    const favoritesFromLocaStorage = getFavoritesFromLocalStorage();

    //setFavorites is teh apiSlice
    dispatch(setFavorites(favoritesFromLocaStorage));
  }, []);

  const toggleFavorites = () => {
    if (isFavorite) {
      //dispatch favorite from localStorage
      //apiSlice
      dispatch(removeFromFavorites(product));

      //remove the product from localStorage as Well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorite(product));

      //add the product as well
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      onClick={toggleFavorites}
      className="absolute top-2 right-5 cursor-pointer"
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-white" />
      )}
    </div>
  );
};

export default HeartIcon;
