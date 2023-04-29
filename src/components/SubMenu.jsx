import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const sidebarState = useSelector((state) => state.userDisplay.sidebar);

  // const [isActive, setIsActive] = useState(false)

  const showSubnav = () => setSubnav(!subnav);

  const fullNavBar = (
    <NavLink
      className="flex justify-between items-center px-3 py-7 list-none no-underline text-lg h-[15%]"
      to={item.path}
      onClick={item.subNav && showSubnav}
    >
      <div>
        {item.icon}
        <span>{item.title}</span>
      </div>
      <div>
        {item.subNav && subnav
          ? item.iconOpened
          : item.subNav
          ? item.iconClosed
          : null}
      </div>
    </NavLink>
  );

  const miniNavBar = (
    <NavLink
      className="flex justify-between items-center p-7 list-none no-underline text-lg"
      to={item.path}
      onClick={item.subNav && showSubnav}
    >
      <div>{item.icon}</div>
      <div>
        {item.subNav && subnav
          ? item.iconOpened
          : item.subNav
          ? item.iconClosed
          : null}
      </div>
    </NavLink>
  );
  return (
    <>
      {sidebarState ? fullNavBar : miniNavBar}
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <NavLink to={item.path} key={index} className="h-14 pl-12 flex items-center no-underline text-lg">
              {item.icon}{" "}
              {sidebarState && <span className="text-base font-bold">{item.title}</span>}
            </NavLink>
          );
        })}
    </>
  );
};

export default SubMenu;
