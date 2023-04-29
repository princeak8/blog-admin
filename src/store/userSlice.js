import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  user: {},
  sidebar: true,
};

const userSlice = createSlice({
  name: "userDisplay",
  initialState: initialUserState,
  reducers: {
    setUser(state, action) {
      state.user = { ...action.payload };
    },

    toggleSideBar(state) {
      state.sidebar = !state.sidebar;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
