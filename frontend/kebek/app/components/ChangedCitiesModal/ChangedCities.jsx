import React, { useEffect, useState } from 'react'
import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import { style } from '../Modals/Success';
import classes from '../AttentionProviderModal/AttentionProviderModal.module.scss'
import classNames from "classnames"
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useRouter } from 'next/router';
import { fetchCities } from '../../redux/products/products.slice';

function ChangedCities({ open, handleClose, setYourCityConfirm, handleChangeCity, t }) {
    const { regions } = useAppSelector(state => state.product)
    const [search, setSearch] = useState("")
    const dispatch = useAppDispatch()
    const router = useRouter()
    const city = window.localStorage.getItem("selectCity")
    const [selectCity, setSelectCity] = useState()

    const handleClick = (item) => {
        setSelectCity(item)
    }

    const handleSubmit = async () => {
        await window.localStorage.setItem("selectCity", router.locale === "ru" ? !!selectCity && selectCity.title_ru : !!selectCity && selectCity.title_kk)
        handleChangeCity(selectCity)
        handleClose()
        setYourCityConfirm(false)
    }

    useEffect(() => {
        dispatch(fetchCities(search))
    }, [search])

    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className={classNames("row d-flex align-items-center justify-content-center flex-column", classes.modal__container)}>
                    <div style={{ cursor: "pointer" }} className="col-1 offset-10 pt-0 my-0">
                        <CloseIcon onClick={handleClose} />
                    </div>
                    <div className="col-12 text-center">
                        <p className={classes.first__text}>{t("location.modal.title1")}</p>
                    </div>
                    <div className="col-12 text-center" style={{ maxWidth: "427px" }}>
                        <p className={classes.second__text}>{t("location.modal.title2")}</p>
                    </div>
                    <div className={classes.searchInp}>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder={t("location.modal.inputPlaceholder")}
                        />
                    </div>
                    <div className={classes.citiesList}>
                        {!!regions?.length && regions.map((item) => (
                            <div onClick={() => handleClick(item)} key={item.id} style={{ margin: "20px 0", cursor: "pointer", backgroundColor: item.id === selectCity?.id ? '#fafcfa' : 'white', color: item.id === selectCity?.id ? 'green' : 'black' }}>
                                <Typography sx={{ fontSize: 16 }}>{router.locale === "ru" ? item.title_ru : item.title_kk}</Typography>
                                <Typography sx={{ color: "#828282", fontSize: 14 }}>{router.locale === "ru" ? item.district.title_ru : item.district.title_kk}</Typography>
                            </div>
                        ))}
                    </div>
                    <div className="col-12 text-center mt-4">
                        <button onClick={handleSubmit} className={classes.button__delete}>
                            <b>{t("location.modal.button")}</b>
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default ChangedCities;
