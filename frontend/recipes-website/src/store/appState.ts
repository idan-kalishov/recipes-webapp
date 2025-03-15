import { configureStore, createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import { PostModel } from "../intefaces/Pots";
import { UserModel } from "../intefaces/User";

interface AppState {
  user: UserModel | null;
  posts: PostModel[];
  lastUpdateTime: string | null;
}

const initialState: AppState = {
  user: null,
  posts: [],
  lastUpdateTime: null,
};

const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload; // Replace all posts
    },
    addPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload]; // Append new posts
    },
    updatePost: (state, action) => {
      const { postId, updatedPost } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = updatedPost;
      }
    },
    deletePost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId);
    },
    setLastUpdateTime: (state, action) => {
      state.lastUpdateTime = action.payload;
    },
    updateUserPosts: (state, action) => {
      if (state.user) {
        state.user.posts = [...(state.user.posts || []), ...action.payload];
      }
    },
  },
});

export const {
  setUser,
  setPosts,
  addPosts,
  updatePost,
  deletePost,
  setLastUpdateTime,
  updateUserPosts,
} = appStateSlice.actions;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["appState"],
};

const rootReducer = combineReducers({
  appState: appStateSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
