import React, { createContext, useState } from "react";
import { $api } from "../services/api";

export const notificationsContext = createContext(null);

const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [notificationsUnRead, setNotificationsUnRead] = useState(null);

  const getNotifications = async (
    search = "",
    read = "",
    page = 1,
    pageSize = 3,
    order__status = "",
  ) => {
    try {
      const { data } = await $api.get("/notifications/", {
        params: { read, search, page, page_size: pageSize, order__status },
      });
      setNotifications(data);
    } catch ({ response }) {
      return response;
    }
  };

  const getAllNotifications = async (search) => {
    try {
      const { data } = await $api.get("/notifications/", {
        params: { search }
      });
      setAllNotifications(data.results);
    } catch ({ response }) {
      return response;
    }
  };

  const markAsRead = (ids) => {
    try {
      $api.post("/notifications/read/", { ids });
    } catch (e) {
      // throw `${e} in notifications`;
      console.log(e)
    }
  };

  const getNotReadNotifications = async () => {
    try {
      const { data } = await $api.get("/notifications/unread/");
      setNotificationsUnRead(data.unread)
    } catch (e) {
      // throw `${e} in notifications`;
      console.log(e)
    }
  };

  return (
    <notificationsContext.Provider
      value={{
        notifications,
        getNotifications,
        markAsRead,
        getNotReadNotifications,
        allNotifications,
        getAllNotifications,
        notificationsUnRead,
      }}
    >
      {children}
    </notificationsContext.Provider>
  );
};

export default NotificationsProvider;
