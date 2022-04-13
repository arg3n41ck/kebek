import React, { useEffect, useState } from 'react'
import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import classes from './ChangedCities.module.scss'
import classNames from "classnames"
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { profileContext } from "../../Context/ProfileContext"
import { localeContext } from '../../providers/LocaleProvider';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 780,
    width: "100%",
    height: "auto",
    borderRadius: "3px",
    backgroundColor: "white",
    border: "none",
    outline: "none",
    boxShadow: 24,
    padding: "30px 30px 30px 30px",
};

function ChangedCities({ open, handleClose }) {
    const { getCities, cities } = React.useContext(profileContext)
    const { locale } = React.useContext(localeContext)

    const [search, setSearch] = useState("")
    const [selectCity, setSelectCity] = useState()

    const handleClick = (item) => {
        setSelectCity(item)
    }

    const handleSubmit = async () => {
        await localStorage.setItem("selectCity", locale === "ru" ? selectCity.titleRu : selectCity.titleKk)
        handleClose()
    }

    useEffect(() => {
        getCities(search)
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
                        <p className={classes.first__text}>Выберите город!</p>
                    </div>
                    <div className="col-12 text-center" style={{ maxWidth: "427px" }}>
                        <p className={classes.second__text}>Укажите ваш город или населённый пункт, чтобы пользоваться всеми возможностями сайта</p>
                    </div>
                    <div className={classes.searchInp}>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Поиск"
                        />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", maxHeight: 288, overflowY: "scroll" }}>
                        {!!cities?.length && cities.map((item) => (
                            <div onClick={() => handleClick(item)} key={item.id} style={{ margin: "20px 0", cursor: "pointer", backgroundColor: item.id === selectCity?.id ? '#fafcfa' : 'white', color: item.id === selectCity?.id ? 'green' : 'black' }}>
                                <Typography sx={{ fontSize: 16, fontWeight: 500 }}>{locale === "ru" ? item.titleRu : item.titleKk}</Typography>
                                <Typography sx={{ color: "#828282", fontSize: 14 }}>{locale === "ru" ? item.district.titleRu : item.district.titleKk}</Typography>
                            </div>
                        ))}
                    </div>
                    <div className="col-12 text-center mt-4">
                        <button onClick={handleSubmit} className={classes.button__delete}>
                            <b>Применить</b>
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
        // <div>siu</div>
    )
}

export default ChangedCities;
