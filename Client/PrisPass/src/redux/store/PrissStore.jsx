import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/AuthSlice/AuthSlice";
import vaultReducer from "../slice/VaultSlice/VaultSlice";
import themeReducer from "../slice/themeSlice/ThemeSlice"

export const PrissStore = configureStore({
  reducer: {
    auth: authReducer,
    vault: vaultReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
