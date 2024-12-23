import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";

import Message from "../../components/Message";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";

import "slick-carousel/slick/slick-theme.css";

import moment from "moment";

import {
  FaCheck,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaBox,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const CustomPrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 z-10"
    >
      ←
    </div>
  );

  const CustomNextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 z-10"
    >
      →
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className="mb-4 xl:block lg:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
        >
          {/* this is the main Slider */}

          {products.map(
            ({
              image,
              _id,
              name,
              price,
              quantity,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[30rem]"
                />

                <div className="flex justify-between h-[30rem">
                  <div className="one">
                    <h2>{name}</h2>
                    <p>$ {price}</p> <br /> <br />
                    <p className="w-[25rem]">
                      {description.substring(0, 170)}...
                    </p>
                  </div>

                  <div className="flex justify-between w-[20rem]">
                    <div className="one">
                      <h1 className="flex items-center mb-6 w-[8rem]">
                        <FaStore className="mr-2 text-white" /> Brand: {brand}
                      </h1>
                      <h1 className="flex items-center mb-6 w-[rem]">
                        <FaClock className="mr-2 text-white" /> Added:{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-6 w-[8rem]">
                        <FaStar className="mr-2 text-white" /> Reviews:{" "}
                        {numReviews}
                      </h1>
                    </div>

                    <div className="two">
                      <h1 className="flex items-center mb-6 w-[10rem]">
                        <FaStar className="mr-2 text-white" /> Ratings:
                        {Math.round(rating)}
                      </h1>
                      <h1 className="flex items-center mb-6 w-[10rem]">
                        <FaShoppingCart className="mr-2 text-white" /> Quantity:
                        {quantity}
                      </h1>
                      <h1 className="flex items-center mb-6 w-[10rem]">
                        <FaBox className="mr-2 text-white" /> In Stock:
                        {countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>


  );
};

export default ProductCarousel;



//My
// import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";

// import Message from "../../components/Message";

// import Slider from "react-slick";

// import "slick-carousel/slick/slick.css";

// import "slick-carousel/slick/slick-theme.css";

// import moment from "moment";

// import {
//   FaCheck,
//   FaClock,
//   FaShoppingCart,
//   FaStar,
//   FaStore,
//   FaBox,
// } from "react-icons/fa";

// const ProductCarousel = () => {
//   const { data: products, isLoading, error } = useGetTopProductsQuery();

//   const CustomPrevArrow = ({ onClick }) => (
//     <div
//       onClick={onClick}
//       className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 z-10"
//     >
//       ←
//     </div>
//   );

//   const CustomNextArrow = ({ onClick }) => (
//     <div
//       onClick={onClick}
//       className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 z-10"
//     >
//       →
//     </div>
//   );

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//   };

//   return (
//     <div className="mb-4 xl:block lg:block md:block">
//       {isLoading ? null : error ? (
//         <Message variant="danger">
//           {error?.data?.message || error.message}
//         </Message>
//       ) : (
//         <Slider
//           {...settings}
//           className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
//         >
//           {products.map(
//             ({
//               image,
//               _id,
//               name,
//               price,
//               quantity,
//               description,
//               brand,
//               createdAt,
//               numReviews,
//               rating,
//               countInStock,
//             }) => (
//               <div key={_id}>
//                 <img
//                   src={image}
//                   alt={name}
//                   className="w-full rounded-lg object-cover h-[30rem]"
//                 />
//                 <div className="p-4 bg-gray-800 text-white rounded-b-lg">
//                   <h2 className="text-2xl font-bold">{name}</h2>
//                   <p className="text-lg font-semibold my-2">$ {price}</p>
//                   <p className="text-gray-300">{description.substring(0, 170)}...</p>

//                   <div className="flex justify-between mt-4">
//                     {/* First Column */}
//                     <div className="flex flex-col gap-4">
//                       <div className="flex items-center text-lg">
//                         <FaStore className="mr-2 text-pink-500 text-2xl" />
//                         <span>Brand: {brand}</span>
//                       </div>
//                       <div className="flex items-center text-lg">
//                         <FaClock className="mr-2 text-blue-500 text-2xl" />
//                         <span>Added: {moment(createdAt).fromNow()}</span>
//                       </div>
//                       <div className="flex items-center text-lg">
//                         <FaStar className="mr-2 text-yellow-500 text-2xl" />
//                         <span>Reviews: {numReviews}</span>
//                       </div>
//                     </div>

//                     {/* Second Column */}
//                     <div className="flex flex-col gap-4">
//                       <div className="flex items-center text-lg">
//                         <FaStar className="mr-2 text-green-500 text-2xl" />
//                         <span>Ratings: {Math.round(rating)}</span>
//                       </div>
//                       <div className="flex items-center text-lg">
//                         <FaShoppingCart className="mr-2 text-purple-500 text-2xl" />
//                         <span>Quantity: {quantity}</span>
//                       </div>
//                       <div className="flex items-center text-lg">
//                         <FaBox className="mr-2 text-red-500 text-2xl" />
//                         <span>In Stock: {countInStock}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )
//           )}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default ProductCarousel;
