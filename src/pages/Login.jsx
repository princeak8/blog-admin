import React from "react";
import LoginForm from "../components/LoginForm";

const Login = () => {
    return (
        <div className="flex flex-col items-center h-[100vh] bg-gray-300">
            <div className="w-[50%] mx-10 my-3">
                <LoginForm />
            </div>
        </div>
    );
}

export default Login;