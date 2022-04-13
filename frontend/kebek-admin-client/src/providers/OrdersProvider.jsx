import { createContext, useState } from "react";
import { $api } from "../services/api";
import { toast } from "react-toastify";

export const ordersContext = createContext(null);

export default function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(null);
  const [allOrders, setAllOrders] = useState(null);

  const getOrders = async (
    search = "",
    status = "",
    page = 1,
    pageSize = 3
  ) => {
    try {
      const { data } = await $api.get("/orders/", {
        params: { status, search, page, page_size: pageSize },
      });
      setOrders(data);
    } catch ({ response }) {
      return response;
    }
  };

  const getAllOrders = async (search = "") => {
    try {
      const { data } = await $api.get("/orders/", {
        params: { search }
      });
      console.log(data)
      setAllOrders(data.results);
    } catch ({ response }) {
      return response;
    }
  };

  const deleteProxy = async (id) => {
    try {
      await $api.delete(`/orders/${id}/proxy/`).then(() => {
        toast.success("Вы успешно удалили доверенное лицо!")
      })
    } catch ({ response }) {
      console.log(response)
    }
  }


  return (
    <ordersContext.Provider
      value={{
        orders,
        getOrders,
        allOrders,
        getAllOrders,
        deleteProxy,
      }}
    >
      {children}
    </ordersContext.Provider>
  );
}
