import { lazy } from "react";
import { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import './App.css';

import { getUser } from "./localstorage/User";

//Pages
import Login from "./pages/Login";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AddProfile from "./pages/profile/Add";
import AddPost from "./pages/Add_post";
import EditPost from "./pages/Edit_post";
import Post from "./pages/Post";
const Posts = lazy(() => import("./pages/Posts"));



function App() {
    const {user, isLoggedIn} = getUser();
    const navigate = useNavigate();

    const location = useLocation();
    console.log(location);
    useEffect(() => {
        if(!isLoggedIn && location.pathname !== "/login") {
            console.log("redirect to login");
            navigate("/login", { replace: true });
        }
    })

  return (
    <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        {isLoggedIn && user ? (
                <>
                    <Route path="/" element={<Index />}>
                        <Route index element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/posts/add" element={<AddPost />} />
                        <Route path="/edit_post/:postId" element={<EditPost />} />
                        <Route path="/post/:postId" element={<Post />} />
                        <Route path="*" element={<Dashboard />} />
                    </Route>
                </>
            ): isLoggedIn && !user ? (
                <Route path="/" element={<Index />}>
                    <Route path="/add_profile" element={<AddProfile />} />
                    <Route path="/*" element={<AddProfile />} />
                </Route>
            ) : (
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Login />} />
                </>
            )
        }
    </Routes>
  );
}

export default App;
