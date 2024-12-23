import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Link, useNavigate, useLocation } from 'react-router-dom'

import { useProfileMutation } from '../../redux/api/usersApiSlice'

import Loader from '../../components/Loader'

import { useState, useEffect } from 'react'

import { toast } from 'react-toastify'

import { setCredential } from '../../redux/features/auth/authSlice'

const Profile = () => {

    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {userInfo} = useSelector(state => state.auth)

    const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation();

    
    useEffect(()=> {

        setUserName(userInfo.username)
        setEmail(userInfo.email)

    },[userInfo.email, userInfo.username])

    const dispatch = useDispatch();

    const submitHandler = async(e) => {

        e.preventDefault();

        if(password != confirmPassword)
        {
            toast.error("Password Do No Match");

            
        }else{

            try 
            {
            
                const res = await updateProfile({_id: userInfo._id, username, email, password}).unwrap();
                // console.log(res);
                dispatch(setCredential({...res}))
                
                toast.success("Profile Updated Successfully");
                
            } catch (error) {
                // if we have the error, if we have the data
                toast.error(error?.data?.message)
                console.log(error);
            }

            
        }
    }

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
        <div className="flex justify-center align-center md:flex md: space-x-4">
            <div className="md:w-1/3">
                <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>

                <form onSubmit={submitHandler}>

                    <div className="mb-4">

                    <label className="block text-white mb-2">Name:</label>

                    <input
                    type="text"
                    placeholder="Enter name"
                    className="form-input p-4 rounded-sm w-full border"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    />
                    </div>

                    <div className="mb-4">

                    <label className="block text-white mb-2">Email:</label>

                    <input
                    type="email"
                    placeholder="Enter Email"
                    className="form-input p-4 rounded-sm w-full border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>

                    <div className="mb-4">

                    <label className="block text-white mb-2">Password:</label>

                    <input
                    type="password"
                    placeholder="Enter Password"
                    className="form-input p-4 rounded-sm w-full border"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>

                    <div className="mb-4">

                    <label className="block text-white mb-2">Confirm Password</label>

                    <input
                    type="password"
                    placeholder="Confirm Password"
                    className="form-input p-4 rounded-sm w-full border"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    </div>

                    <div className="flex justify-between">
                        <button
                        type="submit"
                        className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                        >
                        Update
                        </button>

                        <Link
                        to="/user-orders"
                        className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700">
                        My Orders
                        </Link>
                    </div>

                </form>
            </div>

            {loadingUpdateProfile && <Loader/>}

        </div>
    </div>
    );
};

export default Profile
