import React from "react";
import TextInput from "./common/TextInput";
import PasswordInput from "./common/PasswordInput";

const LoginForm = () => {

    return (
        <div className="flex flex-col justify-center items-center h-[100%]">
            <h1 className="font-bold text-2xl">BLOG ADMIN</h1>

            <div className="flex mt-16 justify-center items-center h-[100%] w-full">
                <div className="mt-16 w-[100%] h-[40vh] border-2 flex justify-center">
                    <h2 className="font-semibold text-xl mb-6">LOGIN</h2>
                    <form className="w-[85%] mx-auto mt-10">
                        <TextInput
                            containerStyle="my-4" label="Email" value="" placeholder="Email Address" 
                            onChange={(text) => console.log("email change:", text)}
                            inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                        />
                        <PasswordInput
                            containerStyle="my-4" label="Password" value="" placeholder="Password" 
                            onChange={(text) => console.log("password change:", text)}
                            inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                        />
                    </form>
                </div>
            </div>
        </div>
    );

};

export default LoginForm;