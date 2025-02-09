import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//R
import { Route, RouterProvider, createRoutesFromElements } from 'react-router';

//R
import { createBrowserRouter } from 'react-router-dom';

//R
import { Provider } from 'react-redux';

import store from './redux/features/store.js';

//Auth
import Login from './pages/Auth/Login.jsx';

import Register from './pages/Auth/Register.jsx';

//Private Route
import PrivateRoute from './components/PrivateRoute.jsx';

import Profile from './pages/User/Profile.jsx';

//Admin Routes
import AdminRoutes from './pages/Admin/AdminRoutes.jsx';

import UserList from './pages/Admin/UserList.jsx';

import CategoryList from './pages/Admin/CategoryList.jsx';

import ProductList from './pages/Admin/ProductList.jsx';

import ProductUpdate from './pages/Admin/ProductUpdate.jsx';

import AllProducts from './pages/Admin/AllProducts.jsx';

import Home from './pages/Home.jsx';

import Favorites from './pages/Products/Favorites.jsx';

import ProductDetails from './pages/Products/ProductDetails.jsx';

import Cart from './pages/Cart.jsx';

import Shop from './pages/Shop.jsx';

import Shipping from './pages/Orders/Shipping.jsx';

import PlaceOrder from './pages/Orders/PlaceOrder.jsx';

import {PayPalScriptProvider} from '@paypal/react-paypal-js';

import Order from './pages/Orders/Order.jsx';

import UserOrder from './pages/User/UserOrder.jsx';

import OrderList from './pages/Admin/OrderList.jsx';

import AD from './pages/Admin/AD.jsx';

import AdminDashboard from './pages/Admin/AdminDashboard.jsx';

const router = createBrowserRouter(
  createRoutesFromElements
  (
    <Route path='/' element={<App/>} >

      {/* Public Routes */}
      <Route path='/login' element={<Login/>}/>

      <Route path='register' element={<Register/>}/>

      <Route index={true} path='/' element={<Home/>}/>

      <Route path='/favorite' element={<Favorites/>}/>

      <Route path='/product/:id' element={<ProductDetails/>}/>

      <Route path='/cart' element={<Cart/>}/>

      <Route path='/shop' element={<Shop/>}/>

      <Route path='/user-orders' element={<UserOrder/>}/>



      {/* Protected Routes */}
      <Route path='' element={<PrivateRoute />}>

        <Route path="/profile" element={<Profile />} />

        <Route path='/shipping' element={<Shipping/>}/>

        <Route path='/placeorder' element={<PlaceOrder/>}/>

        <Route path='/order/:id' element={<Order/>}/>
      </Route>

      {/* Admin Routes */}
      <Route path='/admin/' element={<AdminRoutes/>}>

        <Route path='userlist' element={<UserList/>}/>
        <Route path='categorylist' element={<CategoryList/>} />

        {/* <Route path='productlist/:pageNumber' element={<ProductList/>} /> */}
        <Route path='productlist' element={<ProductList/>} />
        <Route path='allproductslist' element={<AllProducts/>}/>

        <Route path='product/update/:_id' element={<ProductUpdate/>}/>

        <Route path='orderlist' element={<OrderList/>}/>

        <Route path='dashboard' element={<AdminDashboard/>}/>

        {/* <Route path='dashboard' element={<AD/>}/> */}
        

      </Route>

    </Route>
    
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>

    <PayPalScriptProvider>

      <RouterProvider router={router}/>
    </PayPalScriptProvider>
  </Provider>
  
)
