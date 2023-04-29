import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postReducer from "./postSlice";
import modalReducer from "./modalSlice";

const store = configureStore({
    reducer: {
        userDisplay: userReducer,
        postsDisplay: postReducer,
        modal: modalReducer,
    }
});

export default store;

