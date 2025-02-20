import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/Authcontext'

const Register = () => {
    const [user, setUser] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const {register} = useAuth();
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await register(user);
            toast.success('Registration successful');
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className="h-screen w-full flex items-start">
            <div className="relative w-1/2 h-full flex flex-col">
                <img
                    src="https://images.unsplash.com/photo-1738762389613-fefd979dbb39?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Registration Page Background"
                    className="w-full h-full object-cover absolute"
                />
            </div>

            <div className="h-full w-1/2 bg-[#f5f5f5] flex flex-col px-20 py-10 justify-between ">
                <h1 className="text-3xl text-[#060606] font-semibold">CourseDocify</h1>

                <div className="w-full flex flex-col max-w-[450px]">
                    <div className="w-full flex flex-col mb-5">
                        <h3 className="text-3xl font-semibold mb-2">Register</h3>
                        <p className="text-sm mb-2">Welcome! Please enter your details.</p>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="w-full flex flex-col">
                            <input
                                value={user.fullname}
                                name="fullname"
                                onChange={changeHandler}
                                type="text"
                                placeholder="Full Name"
                                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                            />
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
                                autoComplete="new-password"
                                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                            />
                        </div>

                        <div className="w-full flex flex-col my-4">
                            <button type="submit" className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-3 text-center flex items-center justify-center cursor-pointer">
                                Register
                            </button>
                        </div>
                    </form>


                    
                </div>

                <div className="w-full flex items-center justify-center">
                    <p className="text-sm font-normal text-[#060606]">
                        Already have an account?{" "}
                        <Link to={'/login'} className="underline underline-offset-2 font-semibold cursor-pointer">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register;
