import React, {useRef, useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextInput from "./common/TextInput";
import PasswordInput from "./common/PasswordInput";
import { saveUser, saveUserLogin } from "../localstorage/User";
import { loginUser } from "../api/auth";
import { getUser } from "../api/user";

const LoginForm = () => {

    const errorRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     emailRef.current.focus();
    // }, [emailRef]);

    useEffect(() => {
        setErrorMsg("");
        return () => {
            setErrorMsg("");
        };
    }, [email, password]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const renderError = () => {
        if(errorMsg !== "") {
            return(
                <p ref={errorRef} className="bg-[lightpink] text-[firebrick] font-bold p-2 mb-2 w-[80%] text-center rounded">
                    {errorMsg}
                </p>
            );
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const domain_name = window.location.hostname;
        const result = await loginUser(email, password, domain_name);
        if (!result.ok) {
            setIsLoading(false);
            if(result.status === 500) {
              //console.log(result.data.message);
              handleError('Serious Error Occured! Please contact the administrator');
            }
            console.log(result);
            handleError(
              result?.data?.error ? result.data.error : "Login Failed"
            );
        }else{
            const user_email = result.data.data.user.email;
            const token = result.data.data.token;
            const domain = result.data.data.user.domain;
            let expirationTime = new Date(
            new Date().getTime() + result.data.data.token_expires_in * 1000
            );
            expirationTime = expirationTime.toISOString();
            await saveUserLogin({user_email, domain, token, expirationTime});

            const user = await getUser(result.data.data.user.id, domain, token);
            if (!user.ok) console.log(user);

            if (!user.data.data) {
                navigate("/add_profile/");
            } else {
                await saveUser(user.data.data);
                console.log("move to index page");
            (location.pathname === "/") ? window.location.reload(true) : navigate("/");
            }
        }
    }

    const handleError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => {
            setErrorMsg("");
        }, 5000);
    }

    return (
        <div className="flex flex-col justify-center items-center h-[100%]">
            <h1 className="font-bold text-2xl">BLOG ADMIN</h1>

            <div className="flex mt-16 justify-center items-center h-[100%] w-full">
                <div className="mt-16 w-[100%] h-[40vh] border-2 flex justify-center">
                    <h2 className="font-semibold text-xl mb-6">LOGIN</h2>
                    <form className="w-[85%] mx-auto mt-10" onSubmit={handleSubmit}>
                        {renderError()}
                        <TextInput
                            containerStyle="my-4" label="Email" value={email} placeholder="Email Address" 
                            onChange={handleEmailChange} focus={true}
                            inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                        />
                        <PasswordInput
                            containerStyle="my-4" label="Password" value={password} placeholder="Password" 
                            onChange={handlePasswordChange}
                            inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                        />
                        {isLoading && (
                            <button className="mt-2 btn" disabled={true}>
                                <i className="fa fa-circle-o-notch fa-spin"></i>
                                Loading
                            </button>
                        )}
                        {!isLoading && <button className="mt-2 btn btn-primary">Submit</button>}
                    </form>
                </div>
            </div>
        </div>
    );

};

export default LoginForm;