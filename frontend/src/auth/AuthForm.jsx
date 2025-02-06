import React, { useState } from 'react';
import * as Unicons from '@iconscout/react-unicons';
import InputField from '../components/InputField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from '../store/slices/auth';
import { toast } from 'react-toastify';

export default function AuthForm() {
    let registerForm = false;
    const [inputType, setInputType] = useState("loginFormFields");
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const updateInputType = () => {
        if (inputType === "registerFormFiels") {
            setInputType("loginFormFields")
        } else {
            setInputType("registerFormFiels")
        }
    }

    const registerFormFiels = [
        {
            type: "text",
            name: "username",
            placeholder: "Username",
            required: true,
        },
        {
            type: "email",
            name: "email",
            placeholder: "Email",
            required: true,
        },
        {
            type: "password",
            name: "password",
            placeholder: "Password",
            required: true,
        },
        {
            type: "password",
            name: "confirmPassword",
            placeholder: "Confirm Password",
            required: true,
        },
        {
            type: "button",
            name: "Register"
        }
    ]
    const loginFormFields = [
        {
            type: "email",
            name: "email",
            placeholder: "Email",
            required: true,
        },
        {
            type: "password",
            name: "password",
            placeholder: "Password",
            required: true,
        },
        {
            type: "button",
            name: "Login"
        }
    ]

    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        axios.defaults.withCredentials = true;
        if (inputType === "registerFormFiels") {
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            if (password !== confirmPassword) {
                toast.error("Passwords do not match", { type: 'error' });
                return;
            }
            axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/register`, formData)
                .then(res => {
                    const data = res.data;
                    dispatch(setAuthData({ isLogin: true, _id: data._id, role: data.role, name: data.name, email: data.email }));
                    toast.success(data.message, { type: 'success' });
                    navigate('/KahutaCarGo/Dashboard');
                })
                .catch(err => {
                    toast.error(err.response.data.message, { type: 'error' });
                });
        } else {
            const email = formData.get('email');
            const password = formData.get('password');
            axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/login`, { email, password })
                .then(res => {
                    const data = res.data;
                    dispatch(setAuthData({ isLogin: true, _id: data._id, role: data.role, name: data.name, email: data.email }));
                    toast.success(data.message, { type: 'success' });
                    navigate('/KahutaCarGo/Dashboard');
                }).catch(err => {
                    toast.error(err.response.data.message, { type: 'error' });
                });
        }
    }

    console.log(registerForm);

    return (
        <div className="h-screen w-full flex justify-center items-center bg-white text-white gap-6">
            <div className="hidden lg:flex flex-col justify-center bg-cyan-500 items-center w-2/6 h-4/6 text-black rounded-2xl">
                <img src="/cargo.png" alt="Car Rental Logo" className="rounded-full max-h-44 w-20 mb-4" />
                <h2 className="text-5xl font-bold">Car Rental System</h2>
                <h3 className="text-2xl font-extrabold">Kahuta</h3>
            </div>
            <div className="w-full lg:w-2/6 flex flex-col justify-center items-center bg-white text-cyan-900 rounded-lg shadow-lg py-10 px-5">
                <h2 className="text-4xl font-bold mb-4">
                    {inputType === "registerFormFiels" ? "Welcome" : "Welcome Back"}
                </h2>
                <h3 className="text-2xl font-semibold mb-6">
                    {inputType === "registerFormFiels" ? "REGISTER" : "LOGIN"}
                </h3>
                <form
                    className="flex flex-col justify-center items-center w-full lg:w-3/5"
                    onSubmit={handleSubmit}
                >
                    <InputField props={inputType === "registerFormFiels" ? registerFormFiels : loginFormFields} />
                    <div className="text-center mt-4">
                        <h2>
                            {inputType === "registerFormFiels" ? "Already have an account?" : "Don't have an account?"}
                            <button
                                className="text-cyan-900 font-bold mx-1 hover:underline"
                                type="button"
                                onClick={() => {
                                    updateInputType();
                                }}
                            >
                                {inputType === "registerFormFiels" ? "Login" : "Register Now"}
                            </button>
                        </h2>
                    </div>
                </form>
            </div>
        </div>
    )
}
