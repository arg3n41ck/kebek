import React, { useEffect, useState } from 'react';
import arrow from "../../assets/icons/leftArrow.svg";
import Box from '@mui/material/Box';
// import { $api } from '../../services/api';
import { Stack } from '@mui/material';
import $api from '../../utils/axios';
import Image from "next/image"
import { useAppSelector } from '../../redux/hooks';
import Router from "next/router";


const Policy = () => {
    const [data, setData] = useState<any>([]);
    // const navigate = useNavigate();
    const { lastPage } = useAppSelector((state) => state.auth)

    useEffect(() => {
        $api
            .get('/support/policies/')
            .then((res) =>
                res?.data?.results.forEach((item: any) => setData((prev: any) => [...prev, ...item?.policy]))
            );
    }, []);

    return (
        <div className={"d-flex justify-content-center align-items-center"}>
            <div style={{ minHeight: "73vh", margin: "0 50px" }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        marginBottom: 5,
                        marginTop: 2
                    }}
                    onClick={() => Router.back()}
                >
                    <Image src={arrow} alt='left-rrow' />
                    <h5 style={{ margin: '0 0 0 10px', fontWeight: 600 }}>Назад</h5>
                </Box>
                <h5 style={{ fontSize: 30, color: "#092f33", fontWeight: 600 }}>Пользовательское соглашение</h5>
                <div style={{ margin: 0, padding: 0, maxWidth: 900 }}>
                    {data.map((item: any) => (
                        <div style={{ marginBottom: 50 }} key={item.id}>
                            <p style={{ fontSize: 23, fontWeight: 600, color: "#092f33" }}>{item.title}</p>
                            <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 30 }}>{item.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Policy;