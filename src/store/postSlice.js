import { createSlice } from "@reduxjs/toolkit";

const initialState = { allPosts: [], allTags: [] };

const postSlice = createSlice({
  name: "postsDisplay",

  initialState,

  reducers: {
    initializePosts(state, action) {
      state.allPosts = action.payload;
    },

    addPost(state, action) {
      state.allPosts.push(action.payload);
    },

    updatePost(state, action) {
      const update_state = [...state.allPosts];
      const old_post_index = update_state.findIndex(
        (post, index) => post.id === action.payload.id
      );
      update_state[old_post_index] = action.payload;

      state.allPosts = update_state;
    },

    deletePost(state, action) {
      const updated = state.allPosts.filter(
        (post) => post.id !== action.payload
      );
      state.allPosts = updated;
    },
  },
});

export const postActions = postSlice.actions;

export default postSlice.reducer;
