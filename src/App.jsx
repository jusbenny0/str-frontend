import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import DashBoard from "./pages/DashBoard";
import { ToastContainer } from 'react-toastify'
import About from "./pages/About";
import Contact from "./pages/Contact";
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from "./components/App/PrivateRoute";
import Profile from "./pages/Profile";
import GetInfoAboutUser from "./pages/GetInfoAboutUser";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<DashBoard />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path='/getinfo' element={<GetInfoAboutUser />} />
        </Route>
        <Route path="*" element={<Navigate to={"/"} replace />} />
      </Routes>


      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
        toggle={false}
        pauseOnHover={false}
      />
    </Router>
  );
}

export default App;
