import { useSelector } from "react-redux"

import { selectFavorites } from "../../redux/features/favorites/favoriteSlice"

import Product from "./Product"


const Favorites = () => {

    const Favorites = useSelector(selectFavorites)
    // console.log(Favorites);
    

  return (
    <div className="ml-[10rem]">
        <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">

            FAVORITE PRODUCTS
        </h1>


        <div className="flex flex-wrap">

            {Favorites.map((product) => (

                <Product key={product._id} product={product}/>
            ))}
        </div>
    </div>
  )
}

export default Favorites