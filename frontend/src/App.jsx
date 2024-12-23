import {Outlet} from "react-router-dom";

import Navigation from "./pages/Auth/Navigation";

//R
import {ToastContainer} from "react-toastify";

//R
import "react-toastify/dist/ReactToastify.css";



function App() {
 

  return (
    <>
      <ToastContainer />

      <Navigation />

      <main className="py-5">
        
        <Outlet />
      </main>
    </>
  )
}

export default App
