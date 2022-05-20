import React, { createContext, useState } from "react";
import { $api } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const staffContext = createContext(null);

export default function StaffProvider({ children }) {
    const [staff, setStaff] = useState(null);
    const [staffById, setStaffById] = useState(null);
    const [count, setCount] = useState(null);
    const navigate = useNavigate();

    const getStaff = async (suplier, status, pageSize, currentPage, value) => {
        try {
            const { data } = await $api.get("/users/staff/", {
                params: {
                    elevator: suplier !== "default" ? suplier : "",
                    page_size: pageSize,
                    page: currentPage,
                    user_role: status !== "default" ? status : "",
                    search: value
                }
            });
            // toast.success('Вы успешно вошли в личный кабинет!'); 
            setStaff(data.results);
            setCount(data.count)
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!");
        }
    };

    const getStaffById = async (id) => {
        try {
            const { data } = await $api.get(`/users/staff/${id}/`);
            setStaffById(data)
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!")
        }
    };

    const postStaff = async (data) => {
        try {
            await $api.post("/users/staff/", data);
        } catch ({ response: { status } }) {
            status === 409 ? toast.error("Такой сотрудник уже существует") :
                toast.error("Произошла непредвиденная ошибка!")
        }
    };

    const patchStaff = async (id, data) => {
        try {
            await $api.patch(`/users/staff/${id}/`, data);
        } catch ({ response: { status } }) {
            status === 409 ? toast.error("Такой сотрудник уже существует") :
                toast.error("Произошла непредвиденная ошибка!")
        }
    };

    const deleteStaff = async (id) => {
        try {
            await $api.delete(`/users/staff/${id}/`);
        } catch ({ response }) {
            await toast.error("Произошла непредвиденная ошибка!");
        }
    };


    return (
        <staffContext.Provider
            value={{
                staff,
                count,
                staffById,
                getStaff,
                postStaff,
                deleteStaff,
                patchStaff,
                getStaffById
            }}
        >
            {children}
        </staffContext.Provider>
    );
}
