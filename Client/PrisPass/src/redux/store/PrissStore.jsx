import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/AuthSlice";

export const PrissStore = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
