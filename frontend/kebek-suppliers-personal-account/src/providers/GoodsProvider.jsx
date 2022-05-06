import React, { createContext, useState } from "react";
import { $api } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/consts";

export const goodsContext = createContext(null);

export default function GoodsProvider({ children }) {
    const [products, setProducts] = useState(null);
    const [elevators, setElevators] = useState(null);
    const [elevatorsCount, setElevatorsCount] = useState(null);
    const [productTypes, setProductTypes] = useState([]);
    const [count, setCount] = useState(null);
    const [productById, setProductById] = useState(null);
    const [cities, setCities] = useState(null);
    const [addresses, setAddresses] = useState(null);
    const navigate = useNavigate();

    const getElevators = async (search = "") => {
        try {
            const { data } = await $api.get('/elevators/', {
                params: { search }
            });
            setElevators(data.results)
            setElevatorsCount(data.count)
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const getProducts = async (
        suplier,
        status,
        goodsType,
        currentPage,
        pageSize
    ) => {
        try {
            const { data } = await $api.get("/products/", {
                params: {
                    elevator: suplier !== "default" ? suplier : "",
                    page: currentPage,
                    page_size: pageSize,
                    status: status !== "default" ? status : "",
                    type: goodsType !== "default" ? goodsType : "",
                },
            });
            setProducts(data.results);
            setCount(data.count);
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!");
        }
    };

    const deleteProducts = async (id) => {
        try {
            await $api.delete(`/products/${id}/`);
            // toast.success('Вы успешно удалили товар!');
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!");
        }
    };

    const getProductById = async (id) => {
        try {
            const { data } = await $api.get(`/products/${id}/`);
            setProductById(data)
            // toast.success('Вы успешно удалили товар!');
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!");
        }
    };

    const getCities = async () => {
        try {
            const { data } = await $api.get(`/addresses/cities/`);
            setCities(data.results)
            // toast.success('Вы успешно удалили товар!');
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!");
        }
    };

    const getAddresses = async () => {
        try {
            const { data } = await $api.get(`/addresses/stations/`);
            setAddresses(data.results)
            // toast.success('Вы успешно удалили товар!');
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!");
        }
    };

    // /addresses/cities/

    const postProducts = async (data) => {
        try {
            await axios.post(`${BASE_URL}/products/`, data, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Вы успешно добавили товар!");
            navigate("/goods/");
        } catch ({ response: { data } }) {
            await !!data?.non_field_errors ? toast.error("Такой товар уже существует") :
                toast.error("Произошла непредвиденная ошибка!")
            navigate("/goods/");
        }
    };

    const patchProduct = async (id, data) => {
        try {
            await axios.patch(`${BASE_URL}/products/${id}/`, data, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Вы успешно изменили товар!");
            navigate("/goods/");
        } catch ({ response: { data } }) {
            !!data?.non_field_errors ? toast.error("Такой товар уже существует") :
                toast.error("Произошла непредвиденная ошибка!")
            navigate("/goods/");
        }
    };


    // /products/1/status/

    const getProductTypes = async () => {
        try {
            const { data } = await $api.get("/products/types/");
            setProductTypes(data.results);
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!");
        }
    };

    const activateProduct = async (id) => {
        try {
            await $api.patch(`/products/${id}/status/`, {
                status: "AC",
            });
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!");
        }
    };

    //     try {
    //         await $api.patch(`/products/${id}/status/`, {
    //             status: "AC"
    //         });
    //     } catch ({ response }) {
    //         await toast.error('Произошла непредвиденная ошибка!');
    //     }
    // };

    const activateManyGoods = async (ids, status) => {
        try {
            await $api.post(`/products/status/bulk/`, {
                status,
                ids
            });
            // toast.success('Вы успешно вошли в личный кабинет!');
        } catch ({ response: { status } }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    return (
        <goodsContext.Provider
            value={{
                elevators,
                productTypes,
                products,
                elevatorsCount,
                count,
                productById,
                cities,
                addresses,
                getElevators,
                postProducts,
                getProducts,
                getProductTypes,
                deleteProducts,
                activateProduct,
                patchProduct,
                activateManyGoods,
                getProductById,
                getCities,
                getAddresses,
            }}
        >
            {children}
        </goodsContext.Provider>
    );
}
