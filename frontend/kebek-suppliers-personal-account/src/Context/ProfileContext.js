import React, { createContext } from "react";
import { $api } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialState = {
  cities: null,
  requisites: [],
  addresses: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CITIES":
      return {
        ...state,
        cities: action.payload,
      };
    case "SET_REQUISITES":
      return {
        ...state,
        requisites: action.payload,
      };
    case "SET_ADDRESSES":
      return {
        ...state,
        addresses: action.payload,
      };
    default:
      return state;
  }
};

export const profileContext = createContext(null);

export default function ProfileProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const navigate = useNavigate();

  const getAddresses = async () => {
    try {
      const { data } = await $api.get("/users/profile/addresses/");
      dispatch({
        type: "SET_ADDRESSES",
        payload: data.results,
      });
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const getRequisites = async () => {
    try {
      const { data } = await $api.get("/users/profile/requisites/");
      dispatch({
        type: "SET_REQUISITES",
        payload: data.results,
      });
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const changeProfileNotification = async (data) => {
    try {
      await $api.patch("/users/profile/notifications/", data);
    } catch ({ response }) {
      return response;
    }
  };

  const getCities = async (search) => {
    try {
      const {
        data: { results },
      } = await $api.get("/addresses/cities/", {
        params: { search },
      });
      dispatch({
        type: "SET_CITIES",
        payload: results,
      });
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const changeProfileInfo = async (data) => {
    try {
      await $api.patch("/users/profile/general/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Вы успешно поменяли информация о себе!");
      //   setTimeout(() => {
      //     navigate("/profile");
      //   }, 3000);
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const changePassword = async (data) => {
    try {
      await $api.patch("/users/password/change/", data);
      toast.success("Вы успешно поменяли пароль!");
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const postSupport = async (content) => {
    try {
      await $api.post("/support/request/", content);
      toast.success("Ваше обращение отправлено!");
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const addRequisite = async (requisites) => {
    try {
      await $api.post("/users/profile/requisites/", requisites);
      toast.success("Ваше обращение отправлено!");
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const deleteRequisite = async (id) => {
    try {
      await $api.delete(`/users/profile/requisites/${id}/`).then(() => {
        toast.success("Ваше обращение отправлено!");
      });
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const changedRequisite = async (id, data) => {
    try {
      await $api.patch(`/users/profile/requisites/${id}/`, data).then(() => {
        toast.success("Ваш реквизит успешно измененен!");
      });
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const addAddresses = async (data) => {
    try {
      await $api.post(`/users/profile/addresses/`, data);
      toast.success("Вы успешно добавили адрес!");
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const deleteAddresses = async (id) => {
    try {
      await $api.delete(`/users/profile/addresses/${id}/`).then(() => {
        toast.success("Вы успешно удалили адрес!");
      });
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  const changedAddresses = async (id, data) => {
    try {
      await $api.patch(`/users/profile/addresses/${id}/`, data).then(() => {
        toast.success("Ваш адрес успешно измененен!");
      });
    } catch ({ response }) {
      response
        ? toast.error(response)
        : toast.error(`Произошла непредвиденная ошибка!`);
    }
  };

  return (
    <profileContext.Provider
      value={{
        getCities,
        cities: state.cities,
        addresses: state.addresses,
        requisites: state.requisites,
        changeProfileInfo,
        changePassword,
        postSupport,
        addRequisite,
        addAddresses,
        getRequisites,
        getAddresses,
        deleteAddresses,
        deleteRequisite,
        changedAddresses,
        changedRequisite,
        changeProfileNotification,
      }}
    >
      {children}
    </profileContext.Provider>
  );
}
