import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/AuthSlice/AuthSlice";
import vaultReducer from "../slice/VaultSlice/VaultSlice";

export const PrissStore = configureStore({
  reducer: {
    auth: authReducer,
    vault: vaultReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
