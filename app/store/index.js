import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postsReducer from '../features/posts/postsSlice';
import commentsReducer from '../features/comments/commentSlice'; // Add this line
import postLikesReducer from '../features/posts/postsLikesSlice'; // Add this line

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,      // Add this line
    postLikes: postLikesReducer,    // Add this line
  },
});