import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../localstorage/User";

export default function Index()
{
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
        console.log("logged out");
    }

    return(
        <div>
            <p>Welcome to the Index page</p>
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </div>
    );

}