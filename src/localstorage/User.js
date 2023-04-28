/* eslint-disable no-unused-vars */
import { useCallback } from "react";

let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjustedExpirationTime = new Date(expirationTime).getTime();
  
    const remainingDuration = adjustedExpirationTime - currentTime;
  
    return remainingDuration;
  };

// Save User session data in session storage
export async function saveUserLogin({email, domain, token, expirationTime})
{
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("domain", domain);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("expirationTime", expirationTime);
    // console.log("saved user");

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logout, remainingTime);
}

export const saveUser = async (user) => {
    sessionStorage.setItem("user", user.name);
    sessionStorage.setItem("blog_name", user.blog_name);
    sessionStorage.setItem("about", user.about);
};

// Retrieve user data from sessionStorage
export function getUser()
{
    console.log("retrieve user");
    let user = (sessionStorage?.user) ? sessionStorage.user : null;
    let token = (sessionStorage?.token) ? sessionStorage.token : null;
    let token_expires = (sessionStorage?.token_expires) ? sessionStorage.token_expires : null;
    const isLoggedIn = (token) ? true : false;
    return { user, token, token_expires, isLoggedIn};
}

// Clear session storage i.e logout
export const logout = () =>
{
    sessionStorage.clear();
    if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
}