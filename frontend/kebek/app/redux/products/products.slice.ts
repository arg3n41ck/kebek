import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ApiResponse } from "../../types/apiTypes";
import { ICity, IProductProviderV2, IProductV2 } from "../../types/products";
import $api from "../../utils/axios";
import { RootState } from "../store";
import { filterSelector } from "./filter.slice";

const initialState = {
  loading: false,
  error: null as null | string | undefined,
  countPage: 0,
  // faq: null,
  regions: [] as ICity[],
  providers: [] as IProductProviderV2[],
  // providerById: [] as IProductProviderV2[],
  providerById: "" as any,
  stations: [],
  landingProducts: null as null | [],
  productTypes: [],
};

// interface FetchElevatorsByIdDto {
//     id: string | string[]

// }

export const productAdapter = createEntityAdapter<IProductV2>({});
export const productSelectors = productAdapter.getSelectors(
  (state: RootState) => state.product
);

export const fetchProducts = createAsyncThunk(
  "product/fetchproducts",
  async () => {
    const { data } = await $api.get<ApiResponse<IProductV2>>(
      "/products/no-auth/"
    );
    return data;
  }
);

export const fetchFilterProducts = createAsyncThunk(
  "product/fetchFilterProducts",
  async (_, { getState }) => {
    const { type, elevator, elevator__cities } = filterSelector(
      getState() as RootState
    );
    const queryString = new URLSearchParams();
    if (type) queryString.set("type", type.toString());
    if (elevator && elevator !== "ㅤПоставщики")
      queryString.set("elevator", elevator.toString());
    if (elevator__cities)
      queryString.set("elevator__cities", elevator__cities.toString());

    const { data } = await $api.get<ApiResponse<IProductV2>>(
      "/products/no-auth/?" + queryString.toString()
    );
    return data.results;
  }
);

export const fetchStation = createAsyncThunk(
  "products/fetchStation",
  async () => {
    const { data } = await $api.get(`/addresses/stations/`);
    return data.results;
  }
);

export const fetchPagination = createAsyncThunk(
  "products/fetchPagination",
  async (page: number) => {
    const { data } = await $api.get(`/products/no-auth/?page=${page}`);
    return data;
  }
);

// export const fetchFaq = createAsyncThunk(
//     'info/fetchFaq',
//     async (language:string) => {
//         const { data } = await $api.get(`/support/faq/?language=${language}`)
//         return data;
//     }
// )

export const fetchElevators = createAsyncThunk(
  "products/fetchElevators",
  async () => {
    const { data } = await $api.get<ApiResponse<IProductProviderV2>>(
      `/elevators/no-auth/`
    );
    return data;
  }
);

export const fetchElevatorsById = createAsyncThunk(
  "products/fetchElevatorsById",
  async (id: any) => {
    const { data } = await $api.get(`/elevators/no-auth/${id}/`);
    return data;
  }
);

export const fetchCities = createAsyncThunk(
  "products/fetchCities",
  async (search: string | undefined = "") => {
    const { data } = await $api.get<ApiResponse<ICity>>(`/addresses/cities/`, {
      params: {
        search,
      },
    });
    return data.results;
  }
);

export const fetchTypesProducts = createAsyncThunk(
  "products/fetchFilter",
  async () => {
    const { data } = await $api.get(`/products/types/`);
    return data;
  }
);

export const fetchLandingProducts = createAsyncThunk(
  "products/fetchLandingProducts",
  async () => {
    const { data } = await $api.get(`/products/no-auth/landing/`);
    return data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState: productAdapter.getInitialState(initialState),
  reducers: {
    updateProductQuantity: (
      state,
      { payload: { id, quantity } }: PayloadAction<IProductV2>
    ) => {
      productAdapter.updateOne(state, {
        id,
        changes: {
          quantity: quantity,
        },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      productAdapter.setAll(state, action.payload.results);
      state.loading = false;
      state.error = null;
      state.countPage = action.payload.page_count;
    });
    builder.addCase(fetchFilterProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFilterProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchFilterProducts.fulfilled, (state, action) => {
      productAdapter.setAll(state, action.payload);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchPagination.fulfilled, (state, action) => {
      productAdapter.setAll(state, action.payload.results);
      state.countPage = action.payload.page_count;
    }),
      // builder.addCase(fetchFaq.fulfilled, (state, action) => {
      //     state.faq = action.payload.results;
      // }),
      builder.addCase(fetchElevators.fulfilled, (state, action) => {
        state.providers = action.payload.results;
      });

    builder.addCase(fetchCities.fulfilled, (state, action) => {
      state.regions = action.payload;
    });
    builder.addCase(fetchElevatorsById.fulfilled, (state, action) => {
      state.providerById = action.payload;
    });
    builder.addCase(fetchStation.fulfilled, (state, action) => {
      state.stations = action.payload;
    });
    builder.addCase(fetchLandingProducts.fulfilled, (state, { payload }) => {
      state.landingProducts = payload.results;
    });
    builder.addCase(fetchTypesProducts.fulfilled, (state, { payload }) => {
      state.productTypes = payload.results;
    });
  },
});

export const { updateProductQuantity } = productSlice.actions;

export const productReducer = productSlice.reducer;
