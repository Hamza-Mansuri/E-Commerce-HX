import { useState } from "react"

import { NavLink } from "react-router"

import { FaTimes } from "react-icons/fa"
// import { FlatESLint } from "eslint/use-at-your-own-risk"

const AdminMenu = () => {

    const [isMenuOpen, setisMenuOpen] = useState(false)

    const toggleMenu = () => {

        setisMenuOpen(!isMenuOpen)
    }

  return (
    <>

      <button className={`${isMenuOpen? "top-2 right-2" : 'top-5 right-7'} bg-[#151515] p-2 fixed rounded-lg`} onClick={toggleMenu}>

            {isMenuOpen ? (

                <FaTimes color="white"/>
            ): (

                <>
                
                    <div className="w-6 h-0.5 bg-pink-500 my-1"></div>
                    <div className="w-6 h-0.5 bg-pink-500 my-1"></div>
                    <div className="w-6 h-0.5 bg-pink-600 my-1"></div>
                </>
            )}
        </button>

        {/* Providing all of the links here */}
        
        {isMenuOpen && (
            <section className="bg-[#151515] p-4 fixed right-7 top-5">
                <ul className="list-none mt-2">
                    <li>
                        <NavLink
                        className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                        to="/admin/dashboard"
                        style={({ isActive }) => ({
                            color: isActive ? "greenyellow" : "white" // Removed the extra period here
                        })}
                        >
                        Admin DashBoard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                        className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                        to="/admin/categorylist"
                        style={({ isActive }) => ({
                            color: isActive ? "greenyellow" : "white" // Removed the extra period here
                        })}
                        >
                        Create Category
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                        className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                        to="/admin/productlist"
                        style={({ isActive }) => ({
                            color: isActive ? "greenyellow" : "white" // Removed the extra period here
                        })}
                        >
                        Create Products
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                        className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                        to="/admin/allproductslist"
                        style={({ isActive }) => ({
                            color: isActive ? "greenyellow" : "white" // Removed the extra period here
                        })}
                        >
                        All Products
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                        className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                        to="/admin/userlist"
                        style={({ isActive }) => ({
                            color: isActive ? "greenyellow" : "white" // Removed the extra period here
                        })}
                        >
                        Manage Users
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                        className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                        to="/admin/orderlist"
                        style={({ isActive }) => ({
                            color: isActive ? "greenyellow" : "white" // Removed the extra period here
                        })}
                        >
                        Manage Orders
                        </NavLink>
                    </li>
                </ul>
            </section>
        )}

    </>
  )
}

export default AdminMenu