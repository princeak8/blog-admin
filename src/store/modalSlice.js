import { createSlice } from "@reduxjs/toolkit";

const initialModalState = { isVisible: false, data: [] };

const modalSlice = createSlice({
  name: "modal",
  initialState: initialModalState,
  reducers: {
    showModal(state, action) {
      state.data = action.payload;
      state.isVisible = true;
    },

    rejectUser(state, action) {
      state.data = action.payload;
    },

    acceptUser(state, action) {
      state.data = action.payload;
    },

    closeModal(state) {
      state.isVisible = false;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
