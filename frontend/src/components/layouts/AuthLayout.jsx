import React from 'react';
import cover from "../../assets/bg.png";
import logo from "../../assets/logo.png";

const AuthLayout = ({ children }) => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Section */}
            <div className="w-full md:w-[60vw] px-6 mt-12 sm:mt-0 sm:px-8 md:px-12 pt-6 sm:pt-8 pb-10 flex flex-col">
                <div className="flex justify-center md:justify-start mb-6">
                    <img
                        src={logo}
                        alt="Task Manager Logo"
                        className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                    />
                </div>

                <div className="flex-grow flex items-center justify-center md:block">
                    {children}
                </div>
            </div>

            {/* Right Section (Background Image) */}
            <div
                className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8"
                style={{ backgroundImage: `url(${cover})` }}
            />
        </div>
    );
};

export default AuthLayout;