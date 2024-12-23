import React from 'react'

//R
import { useState, useEffect } from 'react'
//R
import { Link, useNavigate, useLocation, data } from 'react-router'
//R
import { useDispatch, useSelector } from 'react-redux'

import { setCredential } from '../../redux/features/auth/authSlice'

import { useLoginMutation } from '../../redux/api/usersApiSlice'

import { toast } from 'react-toastify'

import Loader from '../../components/Loader'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')

    const dispatch = useDispatch()  
    const navigate = useNavigate()

    const [login, {isLoading}] = useLoginMutation()

    const {userInfo} = useSelector(state => state.auth)

    const {search} = useLocation()
    const sp = new URLSearchParams(search)
    //redirect or go to Home
    const redirect = sp.get('redirect') || '/'


    useEffect(() => {

        if(userInfo)
        {
            //if we have userInfo navigate and redirect
            navigate(redirect)
        }
    }, { navigate, redirect, userInfo})

    const submitHandler = async(e) => {

        e.preventDefault();

        try {
            
            const res = await login({email, password}).unwrap()
            console.log(res);
            dispatch(setCredential({...res}))
            
                

        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }
    }

  return (



    //My Code
    //===================
    <div>
        
        <section className="pl-[10rem] flex flex-wrap">
            <div className="mr-[4rem] mt-[5rem]">

                <h1 className="text-2xl font-semibold mb-4">Sign In</h1>

                <form onSubmit={submitHandler} className="container w-[40rem]">

                    <div className="my-[2rem]">

                        <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white">
                        
                        Email Address:

                        </label>

                        <input
                        type='email'
                        id='email'
                        className='mt-1 p-2 border rounded w-full'
                        value = {email}
                        onChange={e => setEmail(e.target.value)}
                        />
                            
                    </div>

                    <div className="my-[2rem]">

                        <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white">
                        
                        Password:

                        </label>

                        <input
                            type='password'
                            id='password'
                            className='mt-1 p-2 border rounded w-full'
                            value = {password}
                            onChange={e => setpassword(e.target.value)}
                        />
                            
                        
                    </div>

                        <button
                            //if button is loading it will be disabled
                            disabled={isLoading}
                            type='submit'
                            className='bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]'
                        >
                            {isLoading? "Signing In..." : "Sign In"}
                        </button>

                        {isLoading && <Loader/>}
                </form>

                <div className="mt-4">
                    <p className="text-white">
                    New Customer ?{" "}
                    <Link
                        to={redirect? `/register?redirect=${redirect}`: "/regsiter"}
                        className="text-pink-500 hover:underline"
                    >
                    {/* from here register routing is started */}
                    Register 
                    </Link>
                    </p>
                </div>
                
            </div>

            <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt=""
            className="h-[65rem] w-[59%] xl:block md:hidden sm:hidden rounded-lg"
            />

        </section>
    </div>


//     //CG Code===============================
//     <div className="flex min-h-screen">
//     {/* Left Section: Sidebar/Navigation */}
//     <div className="w-[3%] lg:w-[10%] bg-black fixed h-full z-50">
//         {/* Your Navbar content */}
//     </div>

//     {/* Main Content */}
//     <div className="flex flex-grow ml-[4%] lg:ml-[15%]">
//         {/* Form Section */}
//         <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-10">
//             <h1 className="text-2xl font-semibold mb-4">Sign In</h1>

//             <form onSubmit={submitHandler} className="w-full max-w-lg">
//                 <div className="my-[2rem]">
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-800">
//                         Email Address:
//                     </label>
//                     <input
//                         type="email"
//                         id="email"
//                         className="mt-1 p-2 border rounded w-full"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>

//                 <div className="my-[2rem]">
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-800">
//                         Password:
//                     </label>
//                     <input
//                         type="password"
//                         id="password"
//                         className="mt-1 p-2 border rounded w-full"
//                         value={password}
//                         onChange={(e) => setpassword(e.target.value)}
//                     />
//                 </div>

//                 <button
//                     disabled={isLoading}
//                     type="submit"
//                     className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
//                 >
//                     {isLoading ? "Signing In..." : "Sign In"}
//                 </button>

//                 {isLoading && <Loader />}
//             </form>

//             <div className="mt-4">
//                 <p className="text-gray-800">
//                     New Customer?{" "}
//                     <Link
//                         to={redirect ? `/register?redirect=${redirect}` : "/register"}
//                         className="text-pink-500 hover:underline"
//                     >
//                         Register
//                     </Link>
//                 </p>
//             </div>
//         </div>

//         {/* Image Section */}
//         <div className="hidden md:block md:w-1/2">
//             <img
//                 src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
//                 alt="Login Illustration"
//                 className="h-full w-full object-cover rounded-l-lg"
//             />
//         </div>
//     </div>
// </div>



  );
};

export default Login


