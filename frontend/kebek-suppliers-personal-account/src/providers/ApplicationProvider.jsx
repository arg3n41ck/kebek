import React, { createContext, useState } from 'react';
import { $api } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { month } from "../Pages/Home/Home"

export const applicationContext = createContext(null);

export default function ApplicationProvider({ children }) {
    const [applications, setApplications] = useState(null);
    const [applicationById, setApplicationById] = useState(null);
    const [dashboardOrders, setDashboardOrders] = useState(null);
    const [dashboardProfit, setDashboardProfit] = useState(null);
    const [dashboardInfo, setDashboardInfo] = useState(null);
    const [downloadFile, setDownloadFile] = useState(null);
    const [count, setCount] = useState(null)
    const navigate = useNavigate();

    // elevatorFilter, productTypeFilter, statusFilter, deliveryTypeFilter, paymentTypeFilter, client

    // client,delivery,elevator,payment,product,status

    const getApplications = async (elevatorFilter, productTypeFilter, statusFilter, deliveryTypeFilter, paymentTypeFilter, client, search, currentPage, pageSize) => {
        try {
            const { data } = await $api.get('/orders/', {
                params: {
                    client: client !== "default" ? client : "",
                    delivery: deliveryTypeFilter !== "default" ? deliveryTypeFilter : "",
                    elevator: elevatorFilter !== "default" ? elevatorFilter : "",
                    payment: paymentTypeFilter !== "default" ? paymentTypeFilter : "",
                    product: productTypeFilter !== "default" ? productTypeFilter : "",
                    status: statusFilter !== "default" ? statusFilter : "",
                    search,
                    page: currentPage,
                    page_size: pageSize
                }
            });

            // toast.success('Вы успешно вошли в личный кабинет!');
            setApplications(data.results);
            setCount(data.count)
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const getApplicationsById = async (id) => {
        try {
            const { data } = await $api.get(`/orders/${id}/`);
            setApplicationById(data);
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const getDashboardOrders = async () => {
        try {
            const { data } = await $api.get(`/dashboard/orders/`);
            setDashboardOrders(data.results);
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    }

    const getDashboardInfo = async () => {
        try {
            const { data } = await $api.get(`/dashboard/general/`);
            setDashboardInfo(data);
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    }

    const postDocumentsToOrderById = async (data) => {
        try {
            await $api.post(`/orders/documents/`, data, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            });
            await toast.success('Вы успешно добавили документ!');

        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const getReportToOrder = async (client, delivery, elevator, payment, status, report_type) => {
        try {
            const { data } = await $api.get(`/orders/report/`, {
                params: {
                    client, delivery, elevator, payment, status, report_type
                }
            });
            setDownloadFile(data)
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const getDashboardProfit = async (currentYears, currentMonth, currentDay) => {
        try {
            const { data } = await $api.get(`/dashboard/profit/`, {
                params: {
                    start_date: `${currentYears}-${month.indexOf(currentMonth) + 1 < 10 && "0"}${month.indexOf(currentMonth) + 1}-${currentDay < 10 ? "0" : ""}${currentDay}`
                }
            });
            setDashboardProfit(data.results);
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    }

    const deleteProductsOrderById = async (res, id, elevator, client, delivery, payment, delivery_payment) => {
        try {
            await $api.patch(`/orders/${id}/`, { products: res, elevator, client, delivery, payment, delivery_payment });
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const changeDeliveryOrderById = async (res, id, elevator, client, delivery) => {
        try {
            await $api.patch(`/orders/${id}/`, { products: res, elevator, client, delivery });
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const changePaymentOrderById = async (res, id, elevator, client, payment) => {
        try {
            await $api.patch(`/orders/${id}/`, { products: res, elevator, client, payment });
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const deleteOrderById = async (id) => {
        try {
            await $api.delete(`/orders/${id}/`);
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };


    const deleteDocumentOrderById = async (document_id) => {
        try {
            await $api.delete(`/orders/documents/${document_id}/`);
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const patchDocumentOrderById = async (document_id, data) => {
        try {
            await $api.patch(`/orders/documents/${document_id}/`, data, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            });
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const patchProxyOrderById = async (id, data) => {
        try {
            await $api.patch(`/orders/${id}/proxy/`, data);
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    const patchStatusOrderById = async (id, data) => {
        try {
            await $api.patch(`/orders/${id}/status/`, {
                status: data
            });
        } catch ({ response }) {
            await toast.error('Произошла непредвиденная ошибка!');
        }
    };

    return (
        <applicationContext.Provider
            value={{
                applications,
                count,
                applicationById,
                dashboardOrders,
                dashboardInfo,
                getApplications,
                getApplicationsById,
                getDashboardOrders,
                getDashboardProfit,
                setDashboardProfit,
                dashboardProfit,
                downloadFile,
                postDocumentsToOrderById,
                deleteProductsOrderById,
                patchProxyOrderById,
                patchStatusOrderById,
                setApplicationById,
                deleteDocumentOrderById,
                getDashboardInfo,
                patchDocumentOrderById,
                deleteOrderById,
                changeDeliveryOrderById,
                changePaymentOrderById,
                getReportToOrder
            }}
        >
            {children}
        </applicationContext.Provider>
    );
}
