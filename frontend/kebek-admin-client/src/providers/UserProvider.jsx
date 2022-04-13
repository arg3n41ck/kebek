import React, { createContext, useState } from "react";
import { $api } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const userContext = createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const { data } = await $api.get('/users/profile/')
      // toast.success('Вы успешно вошли в личный кабинет!');
      setUser(data);
    } catch ({ response: { status } }) {
      if (Number(status) === 401) {
        await toast.error('Ошибка авторизации!');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    }
  }

  return (
    <userContext.Provider
      value={{
        user,
        getUser,
      }}
    >
      {children}
    </userContext.Provider>
  )
}
