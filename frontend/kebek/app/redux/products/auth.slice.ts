import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import $api from "../../utils/axios";
import Router from "next/router";
import { toast } from "react-toastify";

const initialState: any = {
  username: "",
  key: "",
  addresses: null,
  requisites: null,
  lastPage: "",
  user: {},
  notifications: null,
  payment: null,
  delivery: null,
  orders: null as null,
  fatal: false,
};

export interface SignInUserDto {
  username: string;
  password: string;
}

export interface SignUpUserDto {
  username: string;
  password: string;
  first_name?: string;
}

export interface SignUpUserConfirmationSmsDto {
  username: string;
  code: string;
}

export interface ForgotPasswordCheckCodeDto {
  username: string;
  code: string;
}
export interface ForgotPasswordSendCodeDto {
  username: string;
  type: string;
}

export interface NewPasswordDto {
  new_password: string;
  key: string;
}

export interface ChangePasswordDto {
  old_password: string;
  new_password: string;
}

export const signInUser = createAsyncThunk(
  "user/loginUser",
  async ({ username, password }: SignInUserDto, { getState }) => {
    const state: any = getState();
    try {
      return await $api
        .post("/users/login/", { username, password })
        .then(({ data }: any) => {
          window.localStorage.setItem("token", data.token);
          window.localStorage.setItem("user_role", data.user.user_type);
          window.localStorage.setItem("client", data.user.id);
          !!state.auth.lastPage?.length && state.auth.lastPage !== "/about/[id]"
            ? Router.push(
                !!state.auth.lastPage.length ? state.auth.lastPage : "/"
              )
            : Router.push(
                window.localStorage.getItem("dynamicPageAsPath") as string
              );
        });
    } catch (e: any) {
      if (e.response.data.status === 404) {
        toast.error(
          "Пользователь с таким логином не зарегистрирован. Пожалуйста, проверьте правильность введенного логина или зарегистрируйтесь!"
        );
      } else if (e.response.data.status === 400) {
        toast.error("Неверный логин или пароль!");
      } else {
        toast.error("Возникла непредвиденная ошибка!");
      }
    }
  }
);

export const logOutUser = () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("username");
};

export const forgotPasswordUserCheckCode = createAsyncThunk(
  "user/forgotPasswordUserCheckCode",
  async ({ username, code }: ForgotPasswordCheckCodeDto) => {
    try {
      const data: any = await $api
        .post("/users/check-code/", { username, code })
        .then(({ data }: any) => {
          Router.push("/new_password");
          return data.key;
        });
      return data;
    } catch (e) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const forgotPasswordUserSendCode = createAsyncThunk(
  "user/postSendCodeUser",
  async ({ username, type }: ForgotPasswordSendCodeDto) => {
    try {
      await $api
        .post("/users/send-code/", { username, type })
        .then(() => Router.push("/reset_password"));
      return { username };
    } catch (e: any) {
      e.response.status === 404
        ? toast.error(
            "Пользователь с таким логином не зарегистрирован. Пожалуйста, проверьте правильность введенного логина или зарегистрируйтесь!"
          )
        : toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const getUser = createAsyncThunk("user/getUser", async () => {
  try {
    const { data } = await $api.get("/users/profile/general/");
    return data;
  } catch (e) {}
});

export const changeNewPassword = createAsyncThunk(
  "user/newPassword",
  async ({ key, new_password }: NewPasswordDto) => {
    try {
      return await $api
        .post("/users/password/reset/", { key, new_password })
        .then(() => Router.push("/login"));
    } catch (e: any) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const getNotifications = createAsyncThunk(
  "user/getNotifications",
  async () => {
    try {
      const { data } = await $api.get("/notifications/unread/");
      return data.unread;
    } catch (e: any) {}
  }
);

export const signUpUser = createAsyncThunk(
  "user/registerUser",
  async ({ username, password, first_name }: SignUpUserDto) => {
    try {
      await $api
        .post("/users/register/", { username, password, first_name })
        .then(() => Router.push("/confirmation_sms"));
      return { username };
    } catch (e: any) {
      (e.response.data.detail &&
        toast.error(
          "Пользователь с таким логином уже зарегистрирован. Пожалуйста, проверьте правильность введенного логина или воспользуйтесь функцией смены пароля."
        )) ||
        (e.response.data.username &&
          toast.error(e.response.data.username[0])) ||
        toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const signUpUserConfirmationCode = createAsyncThunk(
  "user/registerUserCheckCode",
  async ({ username, code }: SignUpUserConfirmationSmsDto, { getState }) => {
    const state: any = getState();
    try {
      await $api
        .post("/users/register/activate/", { username, code })
        .then(({ data }: any) => {
          window.localStorage.setItem("token", data.token);
          window.localStorage.setItem("user_role", data.user.user_role);
          window.localStorage.setItem("client", data.user.id);
          !!state.auth.lastPage?.length && state.auth.lastPage !== "/about/[id]"
            ? Router.push(
                !!state.auth.lastPage.length ? state.auth.lastPage : "/"
              )
            : Router.push(
                window.localStorage.getItem("dynamicPageAsPath") as string
              );
        });
    } catch (e) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const fetchAddresses = createAsyncThunk(
  "user/fetchAddresses",
  async () => {
    try {
      const { data } = await $api.get("/users/profile/addresses/");
      return data.results;
    } catch (e) {}
  }
);

export const deleteAddresses = createAsyncThunk(
  "user/deleteAddresses",
  async (id: number) => {
    try {
      await $api.delete(`/users/profile/addresses/${id}/`);
    } catch (e) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const createAddresses = createAsyncThunk(
  "user/createAddresses",
  async (data: any) => {
    try {
      await $api.post("/users/profile/addresses/", data);
      return data;
    } catch (e) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const createOrder = createAsyncThunk(
  "user/createAddresses",
  async (data: any) => {
    try {
      const response = await $api
        .post("/orders/", data)
        .then(({ data }: any) => {
          return data;
        });
      return response;
    } catch (e) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const updateAddresses = createAsyncThunk(
  "user/updateAddresses",
  async (id: number, data: any) => {
    // try {
    //     await $api.patch(`/users/profile/addresses/${id}/`, data)
    //     return data
    // } catch (e) {
    //     // alert((e as any).response.detail)
    // }
  }
);

export const fetchRequisites = createAsyncThunk(
  "user/fetchRequisites",
  async () => {
    try {
      const { data } = await $api.get("/users/profile/requisites/");
      return data.results;
    } catch (e) {}
  }
);

export const fetchPayment = createAsyncThunk("user/fetchPayment", async () => {
  try {
    const { data } = await $api.get("/payments/types/");
    return data.results;
  } catch (e) {}
});

export const fetchDelivery = createAsyncThunk(
  "user/fetchDelivery",
  async () => {
    try {
      const { data } = await $api.get("/elevators/no-auth/");
      return data.results;
    } catch (e) {}
  }
);

export const deleteRequisites = createAsyncThunk(
  "user/deleteRequisites",
  async (id: number) => {
    try {
      await $api.delete(`/users/profile/requisites/${id}/`);
    } catch (e) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const createRequisites = createAsyncThunk(
  "user/createRequisites",
  async (data: any) => {
    try {
      await $api.post("/users/profile/requisites/", data);
      return data;
    } catch (e) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const updateRequisites = createAsyncThunk(
  "user/updateRequisites",
  async (id, data) => {
    try {
      await $api.patch(`/users/profile/requisites/${id}/`, data);
      return data;
    } catch (e) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/registerUserCheckCode",
  async ({ old_password, new_password }: ChangePasswordDto) => {
    try {
      return await $api.post("/users/password/change/", {
        old_password,
        new_password,
      });
    } catch (e) {
      toast.error("Возникла непредвиденная ошибка!");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateLastPage: (state, { payload }) => {
      state.lastPage = payload;
    },
    clearUser: (state) => {
      state.user = null;
      window.localStorage.getItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUpUser.fulfilled, (state: any, action) => {
      state.username = action.payload?.username;
    });
    builder.addCase(
      forgotPasswordUserSendCode.fulfilled,
      (state: any, action) => {
        state.username = action.payload?.username;
      }
    );
    builder.addCase(forgotPasswordUserCheckCode.fulfilled, (state, action) => {
      state.key = action.payload;
    }),
      builder.addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      }),
      builder.addCase(fetchRequisites.fulfilled, (state, action) => {
        state.requisites = action.payload;
      }),
      builder.addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
      }),
      builder.addCase(getNotifications.fulfilled, (state, { payload }) => {
        state.notifications = payload;
      }),
      builder.addCase(fetchPayment.fulfilled, (state, { payload }) => {
        state.payment = payload;
      }),
      builder.addCase(fetchDelivery.fulfilled, (state, { payload }) => {
        state.delivery = payload;
      }),
      builder.addCase(createOrder.fulfilled, (state, { payload }) => {
        state.orders = payload;
      });
  },
});

export const { updateLastPage, clearUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
