import React, { useState } from "react";
import OwlLogo from '../assets/owl.svg';
import GoogleLogo from '../assets/google-logo.svg';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGoogle } from "./firebase";
import { useNavigate, NavLink } from "react-router-dom"; 
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import "../css/responsive-custom-css.css";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(""); // State for handling login errors
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(''); // Clear any previous error

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/");
                console.log(user);
            })
            .catch((error) => {
                setLoginError('Login failed. Please try again.');
                console.log(error.code, error.message);
            });
    };

    const onGoogleLogin = () => {
        signInWithGoogle()
            .then(() => {
                navigate("/");
            })
            .catch((error: any) => {
                console.log(error);
            });
    };

    return (
        <div className="min-h-screen bg-screen-black flex items-center justify-center font-inter">
            <div className="flex flex-col items-center space-y-6 w-1/3">
                
                {/* Logo and Title */}
                <div className="flex items-center space-x-4 center-mobile">
                    <img src={OwlLogo} alt="logo" className="w-12 h-12" />
                    <h1 className="text-3xl text-title-light-grey font-light">forecastAI</h1>
                </div>

                {/* Input Fields */}
                <div className="flex flex-col space-y-4 w-full">
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        required
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-input-mobile px-4 py-3 input-fields-mobile bg-mid-dark-grey text-mid-light-grey rounded-2xl focus:outline-none w-full input-mobile button-mobile"
                    />

                    {/* Password Field with Toggle Visibility */}
                    <div className="relative w-full">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-input-mobile px-4 py-3 input-fields-mobile bg-mid-dark-grey text-mid-light-grey rounded-2xl focus:outline-none w-full input-mobile"
                        />
                        {/* Toggle Button (Show/Hide Password) */}
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Display Login Error */}
                {loginError && (
                    <div className="text-red-600 text-sm text-center">
                        {loginError}
                        <span>
                            {' '}
                            <NavLink to="/recover-password" className="text-indigo-600 hover:text-indigo-500">Forgot Password?</NavLink>
                        </span>
                    </div>
                )}

                {/* Or Text */}
                <div className="text-xl font-light text-title-light-grey">or</div>

                {/* Sign in with Google */}
                <button 
                    onClick={onGoogleLogin}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-white text-black rounded-3xl w-72"
                >
                    <img src={GoogleLogo} alt="Google Logo" className="w-5 h-5" />
                    <span>Sign in with Google</span>
                </button>

                {/* Buttons Row */}
                <div className="flex justify-between w-full buttons-row">
                    {/* Learn More Button */}
                    <button  
                        onClick={() => navigate("/learn-more")}
                        className="px-4 py-2 learn-more-button-mobile font-bold text-title-light-grey bg-black rounded-3xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                        learn more
                    </button>
                    {/* Sign Up and Login Buttons */}
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => navigate("/signup")}
                            className="px-4 py-2 signup-login-button-mobile font-bold bg-white text-light-purple border border-light-purple rounded-3xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            Sign Up
                        </button>
                        <button 
                            onClick={onLogin}
                            className="px-4 py-2 signup-login-button-mobile font-bold text-white border border-white rounded-3xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
