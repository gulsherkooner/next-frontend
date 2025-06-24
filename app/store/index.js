import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postsReducer from '../features/posts/postsSlice';
import commentsReducer from '../features/comments/commentSlice';
import postLikesReducer from '../features/posts/postsLikesSlice';
import membershipReducer from '../features/sub/membershipslice';
import storiesReducer from '../features/stories/storiesslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,
    postLikes: postLikesReducer,
    membership: membershipReducer,
    membership: membershipReducer,
    stories: storiesReducer,
  },
});