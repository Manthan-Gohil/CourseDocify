import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/Authcontext";

const Login = () => {
  const { login } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await login(user.email, user.password);
      toast.success(response.message); // Only one toast now
      navigate("/course-details");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="h-screen w-full flex items-start">
      <div className="relative w-1/2 h-full flex flex-col">
        <img
          src="https://images.unsplash.com/photo-1738599778390-af77d7cf10e6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login Page Background"
          className="w-full h-full object-cover absolute"
        />
      </div>

      <div className="h-full w-1/2 bg-[#f5f5f5] flex flex-col px-20 py-10 justify-between">
        <h1 className="text-3xl text-[#060606] font-semibold">CourseDocify</h1>

        <form onSubmit={submitHandler}>
          <div className="w-full flex flex-col max-w-[450px]">
            <div className="w-full flex flex-col mb-5">
              <h3 className="text-3xl font-semibold mb-2">Login</h3>
              <p className="text-sm mb-2">
                Welcome Back! Please enter your details.
              </p>
            </div>

            <div className="w-full flex flex-col">
              <input
                value={user.email}
                name="email"
                onChange={changeHandler}
                type="email"
                placeholder="Email"
                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              />
              <input
                value={user.password}
                name="password"
                onChange={changeHandler}
                type="password"
                placeholder="Password"
                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              />
            </div>

            <div className="w-full flex flex-col my-4">
              <button
                type="submit"
                className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-3 text-center flex items-center justify-center cursor-pointer"
              >
                Log in
              </button>
              <Link
                to="/register"
                className="w-full text-[#060606] my-2 font-semibold border border-black bg-white rounded-md p-3 text-center flex items-center justify-center cursor-pointer"
              >
                Register
              </Link>
            </div>
          </div>
        </form>

        <div className="w-full flex items-center justify-center">
          <p className="text-sm font-normal text-[#060606]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="underline underline-offset-2 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
