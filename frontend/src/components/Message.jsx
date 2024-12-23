// const Message = ({variant, children}) => {

//     const getVariantClass = () => {

//         switch(variant){

//             case "success":
//                 return "bg-green-100 text-green-800"
//             case "error":
//                 return "bg-red-100 text-red-800"
//             default:
//                 break;

//         }
//     }
//   return <div className={`p-4 rounded ${getVariantClass()}`}>{children}</div>
// }

// export default Message

import { useState } from "react";

const Message = ({ variant = "info", children }) => {
//   const [isVisible, setIsVisible] = useState(true);

  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800 border-green-400";
      case "error":
        return "bg-red-100 text-red-800 border-red-400";
      case "info":
      default:
        return "bg-blue-100 text-blue-800 border-blue-400";
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case "success":
        return "✔️"; // Checkmark for success
      case "error":
        return "❌"; // Cross for error
      case "info":
      default:
        return "ℹ️"; // Info icon for info
    }
  };

//   if (!isVisible) return null;

  return (
    <div
      className={`p-4 rounded border ${getVariantClass()} flex items-center justify-between shadow-md transition-opacity duration-300`}
    >
      <div className="flex items-center">
        <span className="mr-2">{getVariantIcon()}</span>
        <span>{children}</span>
      </div>
      {/* <button
        className="text-sm font-bold text-gray-600 hover:text-gray-800"
        onClick={() => setIsVisible(false)}
      >
        ✖
      </button> */}
    </div>
  );
};

export default Message;
