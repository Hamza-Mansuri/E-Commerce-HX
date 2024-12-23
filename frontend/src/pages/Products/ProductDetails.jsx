import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";

import Loader from "../../components/Loader";
import Message from "../../components/Message";

import {
  FaBox,
  FaShoppingCart,
  FaClock,
  FaStar,
  FaStore,
} from "react-icons/fa";

import moment from "moment";

import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";

import ProductTabs from "./ProductTabs";

import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  //api
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  //api
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({ productId, rating, comment }).unwrap();

      refetch();

      // Reset the rating and comment inputs
      setRating(0);
      setComment("");

      toast.success("review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = async (e) => {
    e.preventDefault();

    try {
      if (product && qty > 0) {

        dispatch(addToCart({ ...product, qty }));
        navigate("/cart");
        
      } else {
        toast.error("Invalid product or quantity");
      }
    } catch (error) {
      console.error(error);
      toast.error("Add To Cart Failed");
    }
  };

  return (
    <>
      <div>
        <Link
          to="/"
          className="ml-[10rem] bg-pink-100 text-pink-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 hover:underline"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-start mt-[2rem] ml-[10rem]">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <HeartIcon product={product} />
              </div>
            </div>

            <div className="flex flex-col justify-between ml-8">
              <h2 className="text-2xl font-semibold">{product.name}</h2>

              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
                {product.description}
              </p>

              <p className="text-2xl my-4 font-extrabold mr-2 px-2.5 py-0.5 bg-pink-100 text-pink-800 rounded-full dark:bg-pink-900 dark:text-pink-300">
                ${product.price}
              </p>

              <div className="flex items-start justify-between w-[25rem]">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaStore className="mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      Brand: {product.brand}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FaClock className="mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      Added: {moment(product.createAt).fromNow()}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FaStar className="mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      Reviews: {product.numReviews}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaStar className="mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      Ratings: {rating}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaShoppingCart className="mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      Quantity: {product.quantity}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaBox className="mr-2 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      In Stock: {product.countInStock}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between flex-wrap">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </div>

              {product.countInStock > 0 && (
                <div className="mt-5">
                  <select
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="p-2 w-[6rem] rounded-lg text-black"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="btn-container mt-8">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock == 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add To Cart
                </button>
              </div>

              <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
                <ProductTabs
                  loadingProductReview={loadingProductReview}
                  userInfo={userInfo}
                  submitHandler={submitHandler}
                  rating={rating}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  product={product}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;

//My
// import { useState } from "react";

// import { Link, useParams, useNavigate } from "react-router-dom";

// import { useSelector } from "react-redux";

// import { toast } from "react-toastify";

// import {
//   useGetProductDetailsQuery,
//   useCreateReviewMutation,
// } from "../../redux/api/productApiSlice";

// import Loader from "../../components/Loader";

// import Message from "../../components/Message";

// import {
//   FaBox,
//   FaShoppingCart,
//   FaClock,
//   FaStar,
//   FaStore,
// } from "react-icons/fa";

// import moment from "moment";

// import HeartIcon from "./HeartIcon";

// const ProductDetails = () => {
//   // First of all we are going to get our ID, which is in the params(URL)
//   const { id: productId } = useParams();

//   const navigate = useNavigate();

//   const [query, setQty] = useState(1);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");

//   //Fetching the data form EndPoints
//   const {
//     data: product,
//     isLoading,
//     refetch,
//     error,
//   } = useGetProductDetailsQuery(productId);

//   //getting userInfo from store
//   const { userInfo } = useSelector((state) => state.auth);

//   const [createReview, { isLoading: loadingProductReview }] =
//     useCreateReviewMutation();

//   // Function to determine price badge color
//   const getPriceBadgeColor = (price) => {
//     if (price < 50) return "bg-green-100 text-green-800";
//     if (price < 100) return "bg-yellow-100 text-yellow-800";
//     return "bg-red-100 text-red-800";
//   };

//   return (
//     <>
//       <div>
//         <Link
//           to="/"
//           className="ml-[10rem] bg-pink-100 text-pink-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 hover:underline"
//         >
//           Go Back
//         </Link>
//       </div>

//       {isLoading ? (
//         <Loader />
//       ) : error ? (
//         <Message variant="danger">
//           {error?.data?.message || error.message}
//         </Message>
//       ) : (
//         <>
//           {/* justify-between */}

//           {/* CG */}
//           <div>
//         <Link
//           to="/"
//           className="ml-[10rem] bg-pink-100 text-pink-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 hover:underline"
//         >
//           Go Back
//         </Link>
//       </div>

//       {isLoading ? (
//         <Loader />
//       ) : error ? (
//         <Message variant="danger">
//           {error?.data?.message || error.message}
//         </Message>
//       ) : (
//         <>
//           <div className="flex flex-wrap relative items-start mt-[2rem] ml-[10rem]">
//             <div className="relative">
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] rounded-lg"
//               />
//               {/* HeartIcon positioned at top-right */}
//               <div className="absolute top-4 right-4">
//                 <HeartIcon product={product} />
//               </div>
//             </div>

//             <div className="flex flex-col justify-between ml-8">
//               <h2 className="text-2xl font-semibold">{product.name}</h2>
//               <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
//                 {product.description}
//               </p>

//               {/* Dynamic background for price */}
//               <p
//                 className={`text-2xl my-4 font-extrabold mr-2 px-4 py-1 rounded-full ${
//                   getPriceBadgeColor(product.price)
//                 }`}
//               >
//                 ${product.price}
//               </p>

//               {/* Details Section */}
//               <div className="flex items-start justify-between w-[25rem]">
//                 <div className="space-y-4">
//                   <div className="flex items-center">
//                     <FaStore className="mr-2 text-gray-500" />
//                     <span className="text-gray-700 font-medium">
//                       Brand: {product.brand}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaClock className="mr-2 text-gray-500" />
//                     <span className="text-gray-700 font-medium">
//                       Added: {moment(product.createAt).fromNow()}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaStar className="mr-2 text-gray-500" />
//                     <span className="text-gray-700 font-medium">
//                       Reviews: {product.numReviews}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center">
//                     <FaStar className="mr-2 text-gray-500" />
//                     <span className="text-gray-700 font-medium">
//                       Ratings: {rating}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaShoppingCart className="mr-2 text-gray-500" />
//                     <span className="text-gray-700 font-medium">
//                       Quantity: {product.quantity}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaBox className="mr-2 text-gray-500" />
//                     <span className="text-gray-700 font-medium">
//                       In Stock: {product.countInStock}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* My */}
//           {/* <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
//             <div>
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
//               />
//               <HeartIcon product={product} />
//             </div>

//             <div className="flex flex-col justify-between">
//               <h2 className="text-2xl font-semibold">{product.name}</h2>
//               <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
//                 {product.description}
//               </p>
//               <p className="text-2xl my-4 font-extrabold mr-2 px-2.5 py-0.5 bg-pink-100 text-pink-800 rounded-full dark:bg-pink-900 dark:text-pink-300">
//                 ${product.price}
//               </p>

//               <div className="flex items-center justify-between w-[20rem]">
//                 <div className="one">
//                   <h1 className="flex-items-center-mb-6">
//                     <FaStore className="mr-2 text-white" /> Brand:{" "}
//                     {product.brand}
//                   </h1>

//                   <h1 className="flex-items-center-mb-6">
//                     <FaClock className="mr-2 text-white" /> Added:{" "}
//                     {moment(product.createAt).fromNow()}
//                   </h1>

//                   <h1 className="flex-items-center-mb-6">
//                     <FaStar className="mr-2 text-white" /> Reviews:{" "}
//                     {product.numReviews}
//                   </h1>
//                 </div>

//                 <div className="two">
//                   <h1 className="flex items-center mb-6">
//                     <FaStar className="mr-2 text-white" /> Ratings: {rating}
//                   </h1>

//                   <h1 className="flex items-center mb-6">
//                     <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
//                     {product.quantity}
//                   </h1>

//                   <h1 className="flex items-center mb-6">
//                     <FaBox className="mr-2 text-white" /> In Stock:{" "}
//                     {product.countInStock}
//                   </h1>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//         </>
//       )}
//     </>
//   );
// };

// export default ProductDetails;
