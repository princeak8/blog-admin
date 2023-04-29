import React, { useState } from "react";
import * as FaIcon from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import * as BiIcon from "react-icons/bi";
import * as RiIcon from "react-icons/ri";
import * as VscIcon from "react-icons/vsc";
import { userActions } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { logout, getUser } from "../localstorage/User";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleDrop = () => {
    setShowDropdown(!showDropdown);
  };

  const handleToggleSidebar = () => {
    dispatch(userActions.toggleSideBar());
  };

  const {user, email} = getUser();

  return (
    <>
      <header>
        <VscIcon.VscThreeBars
          onClick={handleToggleSidebar}
          className="cursor-pointer"
        />

        <div className="flex flex-row justify-between mb-2 w-full">
          
            {/* <div className={styles.rightIcons}>
              <div className={styles.notifyIcon}>
                <IoIcon.IoMdNotificationsOutline />
              </div>
              <span>Notifications</span>
            </div> */}
            <div className="w-full pr-[10%]">
                <div className="flex flex-row justify-end self-end ml-12 mr-[25%] w-full">
                    <div className="bg-[#d8dde2] h-9 w-9 rounded-2xl flex justify-center items-center">
                        <FaIcon.FaUser />
                    </div>
                    <span onClick={() => navigate("/profile", { replace: true })} className="cursor-pointer">
                        {user ? user : email}
                    </span>
                    <BiIcon.BiChevronDown onClick={handleDrop} className="ml-0 w-12 cursor-pointer" />
                </div>
                {showDropdown &&
                (<div className="text-right">
                    <div>
                        <div><Link to="/change_password" onClick={handleDrop}>Change Password</Link></div>
                    </div>

                    <div className="flex flex-row justify-end mt-2 cursor-pointer" onClick={handleLogout}>
                        <div>Logout</div>
                        <div><RiIcon.RiLogoutBoxRLine /></div>
                    </div>
                </div>)
                }
            </div>
        </div>
        
                
                {/* <HeaderDropDown
                  className={styles.drop}
                  onClick={handleLogout}
                  name={"Logout"}
                  icon={<RiIcon.RiLogoutBoxRLine />}
                /> */}
      </header>
    </>
  );
};

export default Header;
