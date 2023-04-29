import React from "react";
import { SidebarData } from "../data/SidebarData";
import { useSelector } from "react-redux";
import { getUser } from "../localstorage/User";

import SubMenu from "./SubMenu";

import "../css/Sidebar.css";

const Sidebar = () => {
  const {blog_name} = getUser();
  const sidebarState = useSelector((state) => state.userDisplay.sidebar);

//   const sidebarClasses = "flex flex-col w-[20%] h-[100vh]"

  console.log('blog name: ', blog_name);

  return (
    <div className={sidebarState ? "sidebar" : "mini-sidebar"}>
        {/* <img src={sidebarState ? logo : minilogo} alt="logo" /> */}
        <h1>{blog_name ? blog_name : ''}</h1>  

        {SidebarData.map((item, index) => {
          return <SubMenu item={item} key={index} />;
        })}
    </div>
  );
};

export default Sidebar;
