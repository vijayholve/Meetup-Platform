// Home.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import "../../css/base/Home.css";
import Navbar from "../../components/navbar/Navbar";
import Cards from "../../components/card/Cards";
import TopNavbar from "../../components/navbar/TopNavbar";
import Footer from "../../components/footer/Footer";
const Home = () => {
  const user = useSelector((state) => state.auth.user);


  return (
    <div className="">
      <TopNavbar />
      <Navbar />
      <Cards />
      <Footer />
    </div>
  );
};

export default Home;
