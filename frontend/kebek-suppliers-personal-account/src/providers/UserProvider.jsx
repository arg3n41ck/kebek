import React, { createContext, useState } from 'react';
import { $api } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const userContext = createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = useState();
  const [clients, setClients] = useState();
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const { data } = await $api.get('/users/profile/general/');
      // toast.success('Вы успешно вошли в личный кабинет!');
      setUser(data);
    } catch ({ response }) {
      console.log(response)
      // if (Number(status) === 401) {
      //   await toast.error('Ошибка авторизации!');
      //   setTimeout(() => {
      //     navigate('/');
      //   }, 3000);
      // }
    }
  };

  const getClients = async () => {
    try {
      const { data } = await $api.get('/users/clients/');
      setClients(data.results);
    } catch ({ response }) {
      await toast.error('Произошла непредвиденная ошибка!');
    }
  };



  return (
    <userContext.Provider
      value={{
        user,
        clients,
        getUser,
        getClients,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
