import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const store = configureStore({
    reducer: {
        userDisplay: userReducer,
    }
});

export default store;

