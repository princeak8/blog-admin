import React, {useState} from "react";
import { Outlet, useNavigate, NavLink, Link } from "react-router-dom";

import * as BiIcon from "react-icons/bi";
import * as RiIcon from "react-icons/ri";

import { logout, getUser } from "../localstorage/User";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Index()
{
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
        console.log("logged out");
    }

    const handleDrop = () => {
        setShowDropdown(!showDropdown);
    };

    const {user, email} = getUser();

    return(
        <React.Fragment>
            <div className="lg:hidden md:hidden border-2 h-[12vh] w-full mx-auto flex flex-row justify-between pt-[2vh[ pl-[2%] mb-[5vh]">
                <div className="flex flex-row justify-evenly">
                    <NavLink to="/" className="text-[dodgerblue] mr-[20%]">Dashboard</NavLink>
                    <NavLink to="/tags" className="text-[dodgerblue]">Tags</NavLink>
                </div>
                <div>
                    <span onClick={() => navigate("/profile")} className="cursor-pointer">
                        {user ? user : email}
                    </span>
                    <BiIcon.BiChevronDown onClick={handleDrop} className="ml-0 w-[50px] cursor-pointer" />
                    {showDropdown &&
                        (<div style={{textAlign:"right"}}>
                            <div>
                                <div><Link to="/change_password" onClick={handleDrop}>Change Password</Link></div>
                            </div>

                            <div style={{display:"flex", flexDirection:"row", justifyContent:"end", marginTop:"0.5em", cursor:"pointer"}} onClick={handleLogout}>
                                <div>Logout</div>
                                <div><RiIcon.RiLogoutBoxRLine /></div>
                            </div>
                        </div>)
                        }
                </div>
            </div>

            <div className="container-fluid">
                <Header />
                <div className="flex flex-row">
                    <Sidebar />
                    <div className="flex flex-col w-full bg-[#fafbfc]">
                        <Outlet />
                    </div>
                </div>
            </div>
    </React.Fragment>
    );

}