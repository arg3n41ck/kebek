import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { cartReducer } from "./products/cart.slice";
import { productReducer } from "./products/products.slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authReducer } from "./products/auth.slice";
import { filterReducer } from "./products/filter.slice";

const store = configureStore({
  reducer: {
    product: persistReducer(
      {
        key: "products",
        blacklist: ["loading", "error"],
        storage,
      },
      productReducer
    ),
    // cart: cartReducer
    cart: persistReducer(
      {
        key: "cart",
        storage,
      },
      cartReducer
    ),
    auth: authReducer,
    filters: persistReducer(
      {
        key: "filters",
        storage,
      },
      filterReducer
    ),
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      // ignoredPaths:["register"]
      ignoredActions: ["persist/PERSIST"],
    },
  }),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
