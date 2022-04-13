import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { CartItem, IProductV2 } from "../../types/products";
import { RootState } from "../store";

interface Filter {
  type: string | null;
  elevator: string | null;
  elevator__cities: string | null;
}

const initialState: Filter = {
  type: null,
  elevator: null,
  elevator__cities: null,
};

export const filterSelector = (state: RootState) => state.filters;

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<string | null>) => {
      state.type = action.payload;
    },
    setElevator: (state, action: PayloadAction<string | null>) => {
      state.elevator = action.payload;
    },
    setElevatorCity: (state, action: PayloadAction<string | null>) => {
      state.elevator__cities = action.payload;
    },
    clearFilters: () => {
      return initialState;
    },
    setFilters: (state, action: PayloadAction<Filter>) => {
      return action.payload;
    },
    changeFilters: (state, action: PayloadAction<Filter>) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setType,
  setElevator,
  setElevatorCity,
  clearFilters,
  setFilters,
  changeFilters,
} = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
