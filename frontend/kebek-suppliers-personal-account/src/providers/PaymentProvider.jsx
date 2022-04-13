import React, { createContext, useState } from 'react';
import { $api } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../utils/consts";

export const paymentContext = createContext(null);

export default function PaymentProvider({ children }) {
    const [payment, setPayment] = useState(null);
    const [paymentType, setPaymentType] = useState([]);
    const [paymentById, setPaymentById] = useState(null);
    const [count, setCount] = useState(null);
    const navigate = useNavigate();

    const getPayment = async (suplier, status, paymentTypes, currentPage, pageSize) => {
        try {
            const { data } = await $api.get('/payments/', {
                params: {
                    elevator: suplier !== "default" ? suplier : "",
                    page: currentPage,
                    page_size: pageSize,
                    status: status !== "default" ? status : "",
                    type: paymentTypes !== "default" ? paymentTypes : ""
                }
            });
            // toast.success('Вы успешно вошли в личный кабинет!');
            setPayment(data.results)
            setCount(data.count)
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    // /payments/1/

    const getPaymentById = async (id) => {
        try {
            const { data } = await $api.get(`/payments/${id}/`);
            setPaymentById(data)
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };


    const postPayment = async (data) => {
        try {
            await $api.post('/payments/', data);
            toast.success('Вы успешно добавили оплату!');
        } catch ({ response: { data } }) {
            !!data?.non_field_errors ? toast.error("Такой тип оплаты уже существует") :
                toast.error("Произошла непредвиденная ошибка!")
        }
    };

    const changedPayment = async (id, data) => {
        try {
            await $api.patch(`/payments/${id}/`, data);
            toast.success('Вы успешно изменили оплату!');
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const getPaymentTypes = async () => {
        try {
            const { data } = await $api.get('/payments/types/');
            // toast.success('Вы успешно вошли в личный кабинет!');
            setPaymentType(data.results)
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const deletePayment = async (id) => {
        try {
            await $api.delete(`/payments/${id}/`);
            toast.success('Вы успешно заархивировали оплату!');
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const activatePayment = async (id) => {
        try {
            await $api.patch(`/payments/${id}/status/`, {
                status: "AC"
            });
            toast.success('Вы успешно активировали оплату!');
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const activateManyPayment = async (ids, status) => {
        try {
            await $api.post(`/payments/status/bulk/`, {
                status,
                ids
            });
            // toast.success('Вы успешно вошли в личный кабинет!');
        } catch ({ response: { status } }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    return (
        <paymentContext.Provider
            value={{
                paymentType,
                payment,
                count,
                paymentById,
                postPayment,
                getPaymentTypes,
                changedPayment,
                getPayment,
                deletePayment,
                activatePayment,
                getPaymentById,
                setPaymentById,
                activateManyPayment
            }}
        >
            {children}
        </paymentContext.Provider>
    );
}
