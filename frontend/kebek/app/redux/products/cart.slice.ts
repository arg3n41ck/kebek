import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { CartItem, IProductV2 } from "../../types/products";
import $api from "../../utils/axios";
import { RootState } from "../store";

const initialState = {};

export const cartAdapter = createEntityAdapter<CartItem>({});

export const cartSelectors = cartAdapter.getSelectors(
  (state: RootState) => state.cart
);

export const cartSelectorsLocal = cartAdapter.getSelectors();

interface IChangeCartItemCount {
  id: CartItem["id"];
  count: number;
}

export const cartSlice = createSlice({
  name: "cart",
  initialState: cartAdapter.getInitialState(initialState),
  reducers: {
    addProductToCart: (state, action: PayloadAction<IProductV2>) => {
      cartAdapter.addOne(state, {
        ...action.payload,
        count: action.payload.quantity || 1,
        checked: true,
      });
    },
    removeProductFromCart: (state, action: PayloadAction<CartItem["id"]>) => {
      cartAdapter.removeOne(state, action.payload);
    },
    removeProductsFromCart: (state, action) => {
      cartAdapter.removeMany(state, action.payload);
    },
    changeCartItemCount: (
      state,
      { payload: { id, count } }: PayloadAction<IChangeCartItemCount>
    ) => {
      const item = cartSelectorsLocal.selectById(state, id);
      let newCount = count;
      if (count <= 0) {
        newCount = 1;
      }
      if (item?.max_limit && item?.max_limit < count * 1000) {
        newCount = item.max_limit / 1000;
      }
      if (item?.min_limit && item?.min_limit > count * 1000) {
        newCount = item.min_limit / 1000;
      }
      cartAdapter.updateOne(state, {
        id: id,
        changes: {
          count: newCount,
        },
      });
    },
    changeCheckedItemAll: (state, { payload }: any) => {
      cartAdapter.updateMany(state, payload);
    },
    changeCheckedItem: (state, { payload }: any) => {
      let newChecked = !payload.checked;
      cartAdapter.updateOne(state, {
        id: payload.id,
        changes: {
          checked: newChecked,
        },
      });
    },
    clearCart: (state) => {
      cartAdapter.removeAll(state);
    },
  },
});

export const {
  addProductToCart,
  changeCartItemCount,
  removeProductFromCart,
  removeProductsFromCart,
  clearCart,
  changeCheckedItemAll,
  changeCheckedItem,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
