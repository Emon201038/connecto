import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import postReducer from "./features/post/postSlice";
import conversationSlice from "./features/conversation/conversationSlice";
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    post: postReducer,
    conversation: conversationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
