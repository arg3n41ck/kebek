import React, { createContext, useState } from 'react';
import { $api } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const deliveryContext = createContext(null);

export default function DeliveryProvider({ children }) {
    const [delivery, setDelivery] = useState(null);
    const [deliveryType, setDeliveryType] = useState([]);
    const [count, setCount] = useState(null);
    const [deliveryById, setDeliveryById] = useState(null);
    const navigate = useNavigate();

    const getDelivery = async (suplier, status, deliveryTypes, currentPage, pageSize) => {
        try {
            const { data } = await $api.get('/deliveries/', {
                params: {
                    elevator: suplier !== "default" ? suplier : "",
                    page: currentPage,
                    page_size: pageSize,
                    status: status !== "default" ? status : "",
                    type: deliveryTypes !== "default" ? deliveryTypes : ""
                }
            });
            // toast.success('Вы успешно вошли в личный кабинет!');
            setDelivery(data.results);
            setCount(data.count)
        } catch ({ response: { status } }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const changedDelivery = async (id, data) => {
        try {
            await $api.patch(`/deliveries/${id}/`, data);
            toast.success('Вы успешно изменили доставку!');
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const getDeliveryById = async (id) => {
        try {
            const { data } = await $api.get(`/deliveries/${id}/`);
            setDeliveryById(data)
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const getDeliveryTypes = async () => {
        try {
            const { data } = await $api.get('/deliveries/types/');
            // toast.success('Вы успешно вошли в личный кабинет!');
            setDeliveryType(data.results);
        } catch ({ response: { status } }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const postDelivery = async (data) => {
        try {
            await $api.post('/deliveries/', data);
            // toast.success('Вы успешно вошли в личный кабинет!');
        } catch ({ response: { data } }) {
            await !!data?.non_field_errors ? toast.error('Такой тип доставки уже существует') : toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const deleteDelivery = async (id) => {
        try {
            await $api.delete(`/deliveries/${id}/`);
            // toast.success('Вы успешно вошли в личный кабинет!');
        } catch ({ response: { status } }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };


    const activateDelivery = async (id) => {
        try {
            await $api.patch(`/deliveries/${id}/status/`, {
                status: "AC"
            });
            // toast.success('Вы успешно вошли в личный кабинет!');
        } catch ({ response: { status } }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const activateManyDelivery = async (ids, status) => {
        try {
            await $api.post(`/deliveries/status/bulk/`, {
                status,
                ids
            });
            // toast.success('Вы успешно вошли в личный кабинет!');
        } catch ({ response: { status } }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    return (
        <deliveryContext.Provider
            value={{
                delivery,
                deliveryType,
                count,
                deliveryById,
                getDelivery,
                getDeliveryTypes,
                postDelivery,
                deleteDelivery,
                activateDelivery,
                activateManyDelivery,
                getDeliveryById,
                changedDelivery
            }}
        >
            {children}
        </deliveryContext.Provider>
    );
}
