import React from 'react'
import { Typography, MenuItem, Menu, TextField } from "@mui/material"
import classes from "./Application.module.scss"
import classNames from "classnames"
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';

function ApplicationByIdProductList({ item, locale, deleteProductFromOrderById, id, data, elevators, setPaymentType, paymentType, setDeliveryType, deliveryType, handleChangeDelivery, handleChangePayment }) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const opens = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };


    const selectPaymentTypes = React.useMemo(() => {
        const res = []
        !!elevators && elevators.map((item) => {
            return data?.elevator.id === item.id && item.payments.forEach((payment) => {
                return payment.status === "AC" && res.push(payment)
            })
        })
        return res
    }, [data])


    const selectDeliveryTypes = React.useMemo(() => {
        const res = []
        !!elevators && elevators.map((item) => {
            return data?.elevator.id === item.id && item.deliveries.forEach((delivery) => {
                return delivery.status === "AC" && res.push(delivery)
            })
        })
        return res
    }, [data])

    return (
        <>
            <div style={{ border: "1px solid #E0E0E0" }} />
            <div
                className={classes.confidant__container}
                style={{
                    backgroundColor: '#FAFCFA',
                    margin: 0,
                    padding: "20px 0"
                }}
            >
                <div

                    className={classNames(
                        classes.confidantInfo
                    )}
                >

                    <div
                        className={classes.confidantItem_item}
                        style={{ maxWidth: 250, width: '100%' }}
                    >
                        <Typography
                            sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                        >
                            Наименование
                        </Typography>
                        <Typography
                            sx={{
                                color: '#092F33',
                                fontSize: 18,
                                fontWeight: 500,
                            }}
                        >
                            {!!item.product.type && locale === "ru" ? item.product.type.titleRu : item.product.type.titleKk}
                        </Typography>
                    </div>
                    <div
                        className={classes.confidantItem_item}
                        style={{ maxWidth: 150, width: '100%' }}
                    >
                        <Typography
                            sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                        >
                            Кол-во
                        </Typography>
                        <Typography sx={{ color: '#092F33', fontSize: 18 }}>
                            {!!item?.amount && item.amount}
                        </Typography>
                    </div>
                    <div
                        className={classes.confidantItem_item}
                        style={{ maxWidth: 200, width: '100%' }}
                    >
                        <Typography
                            sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                        >
                            Поставщик
                        </Typography>
                        <Typography sx={{ color: '#092F33', fontSize: 18 }}>
                            {!!(data.elevator.titleRu && data.elevator.titleKk) && locale === "ru" ? (data.elevator.titleRu.length > 20 ? `${data.elevator.titleRu.slice(0, 15)}...` : data.elevator.titleRu) : (data.elevator.titleKk.length > 20 ? `${data.elevator.titleKk.slice(0, 15)}...` : data.elevator.titleKk)}
                        </Typography>
                    </div>
                    <div
                        className={classes.confidantItem_item}
                        style={{ maxWidth: 150, width: '100%' }}
                    >
                        <Typography
                            sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                        >
                            Стоимость
                        </Typography>
                        <Typography sx={{ color: '#092F33', fontSize: 18 }}>
                            {item.productPayment * 1000} ₸
                        </Typography>
                    </div>
                    <div
                        className={classes.confidantItem_item}
                        style={{ maxWidth: 200, width: '100%' }}
                    >
                        <Typography
                            sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                        >
                            Тип оплаты
                        </Typography>
                        <div style={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                id='outlined-select-currency'
                                select
                                value={paymentType}
                                onChange={(e) => handleChangePayment(e.target.value)}
                            >
                                {!!selectPaymentTypes && selectPaymentTypes.map((item) => (
                                    <MenuItem
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {locale === "ru" ? item.type.titleRu : item.type.titleKk}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </div>
                    <div
                        className={classNames(
                            classes.confidantItem
                        )}
                    >
                        <div
                            className={classes.confidantItem_item}
                            style={{ maxWidth: 210, width: '100%' }}
                        >
                            <Typography
                                sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                            >
                                Способ доставки
                            </Typography>
                            <div style={{ width: '100%' }}>
                                <TextField
                                    fullWidth
                                    id='outlined-select-currency'
                                    select
                                    value={deliveryType}
                                    onChange={(e) => handleChangeDelivery(e.target.value)}
                                >
                                    {!!selectDeliveryTypes && selectDeliveryTypes.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.id}>
                                            {locale === "ru" ? item.type.titleRu : item.type.titleKk}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                        </div>
                    </div>
                </div>
                <MoreVertSharpIcon
                    style={{ color: '#219653', cursor: 'pointer' }}
                    onClick={handleClick}
                />
                <Menu
                    id='demo-positioned-menu'
                    aria-labelledby='demo-positioned-button'
                    anchorEl={anchorEl}
                    open={opens}
                    onClick={(e) => handleClick(e)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'bottom',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'bottom',
                    }}
                >
                    <MenuItem onClick={() => deleteProductFromOrderById(!!item?.id && item.id, id)}>
                        Удалить
                    </MenuItem>
                </Menu>
            </div>
        </>


    )
}

export default ApplicationByIdProductList