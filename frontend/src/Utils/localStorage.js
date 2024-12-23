// Be Carefull while setItem, getItem in localStorage
// do Not Mistake in Spellings


// Retrieve favorites from localStorage

export const getFavoritesFromLocalStorage = () => {


    const favoritesJSON = localStorage.getItem("favorites");

    return favoritesJSON? JSON.parse(favoritesJSON) : [];
}


// Add a Product to localStorage

export const addFavoriteToLocalStorage = (product) => {

    const favorites = getFavoritesFromLocalStorage()

    if(!favorites.some((p) => p._id == product._id))
    {
        favorites.push(product)
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }
}


// Remove product from localStorage

export const removeFavoriteFromLocalStorage = (productId) => {

    const favorites = getFavoritesFromLocalStorage()

    const updateFavorites = favorites.filter((product) => product._id != productId);

    localStorage.setItem('favorites', JSON.stringify(updateFavorites))
}