import React from 'react'

import { useState, useEffect } from 'react'

//R
import { data, Link, useLocation, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import { toast } from 'react-toastify'

import Loader from '../../components/Loader'

import { setCredential } from '../../redux/features/auth/authSlice'

import { useRegisterMutation } from '../../redux/api/usersApiSlice'

const Register = () => {

    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, {isLoading}] = useRegisterMutation();

    //we are getting the userInfo from store auth
    //authReducer -> authSlice
    const {userInfo} = useSelector(state => state.auth);

    //redirect part
    const search = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {

        if(userInfo)
        {
            navigate(register)
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async(e) => {

        e.preventDefault();

        if(password != confirmPassword)
        {
            toast.error("Passowrd Do Not match")
        }else{

            try 
            {
            
                const res = await register({username, email, password}).unwrap();
                // console.log(res);
                dispatch(setCredential({...res}))
                navigate(redirect)
                toast.success('User Successfully Registered');
                

            } catch (error) {
                console.log(error);
                toast.error(error.data.message);
            }
        }

        
    }

  return (
    
    

    <section className="pl-[10rem] flex flex-wrap">
        
        <div className="mr-[4rem] mt-[5rem]">
            

            <h1 className="text-2xl font-semibold mb-4">
                
                Register

            </h1>

            <form onSubmit={submitHandler} className="container w-[40rem]">

                <div className="my-[2rem]">

                    <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white"
                    >
                    
                    Name:

                    </label>

                    <input
                    type='text'
                    id='name'
                    className='mt-1 p-2 border rounded w-full'
                    value = {username}
                    placeholder='Enter Your Name'
                    onChange={e => setUserName(e.target.value)}
                    />
                        
                </div>

                <div className="my-[2rem]">

                    <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                    >
                    
                    Email:

                    </label>

                    <input
                    type='email'
                    id='email'
                    className='mt-1 p-2 border rounded w-full'
                    value = {email}
                    placeholder='Enter Your Email'
                    onChange={e => setEmail(e.target.value)}
                    />
                        
                </div>

                <div className="my-[2rem]">

                    <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white">
                    
                    Password:

                    </label>

                    <input
                    type='password'
                    id='password'
                    className='mt-1 p-2 border rounded w-full'
                    value = {password}
                    placeholder='Enter Your Password'
                    onChange={e => setPassword(e.target.value)}
                    />
                        
                    
                </div>

                <div className="my-[2rem]">

                    <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-white">
                    
                    confirm Passowrd:

                    </label>

                    <input
                        type='password'
                        id='confirmPassword'
                        className='mt-1 p-2 border rounded w-full'
                        value = {confirmPassword}
                        placeholder='Confirm Your Password'
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                        
                    
                </div>

                <button
                    //if button is loading it will be disabled
                    disabled={isLoading}
                    type='submit'
                    className='bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]'
                >
                    {isLoading? "Registering ..." : " Register"}
                </button>

                {isLoading && <Loader/>}

                
            </form>

            <div className="mt-4">
                <p className="text-white">
                Already Have An Account ?{" "}
                <Link
                    to={redirect? `/login?redirect=${redirect}`: "/login"}
                    className="text-pink-500 hover:underline"
                >
                {/* if user already have an account redirect him to login page. */}
                Login 
                </Link>
                </p>
            </div>
        </div>

        <img
            src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
            alt=""
            className="h-[65rem] w-[59%] xl:block md:hidden sm:hidden rounded-lg"
        />

    </section>
  )
}

export default Register