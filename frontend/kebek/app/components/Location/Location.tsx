import React from 'react'
import Image from "next/image"
import classNames from 'classnames'
import classes from "../Header/header.module.scss"
import locationIcon from "../../images/locationIcon.svg"
import ChangedCities from "../ChangedCitiesModal/ChangedCities"
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const Location = ({ className = "", handleChangeCity, city }: any) => {
    const router = useRouter()
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [yourCityConfirm, setYourCityConfirm] = React.useState(false)
    const [location, setLocation] = React.useState("")
    const cityDefault = {
        title_r: "Актобе",
        title_k: "Ақтөбе"
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const openModal = () => {
        handleOpen()
    }

    React.useEffect(() => {
        if (location === "") {
            setLocation(router.locale === "ru" ? cityDefault.title_r : cityDefault.title_k)
        }
        if (!!window.localStorage.getItem("selectCity")) {
            setLocation(!!city ? router.locale === "ru" ? city?.title_ru : city?.title_kk : router.locale === "ru" ? cityDefault.title_r : cityDefault.title_k)
        }
    }, [city, router.locale])


    return (
        <div className={classNames(classes.header__items__location, className)}>
            <div onClick={() => setYourCityConfirm(!yourCityConfirm)} className={classNames(classes.header__items__location__image)} >
                <Image src={locationIcon} alt="location icon" />
            </div>
            <div className={classes.tooltip}>
                <p onClick={() => setYourCityConfirm(!yourCityConfirm)}>{location}</p>
                {
                    yourCityConfirm &&
                    <div className={classes.bottom}>
                        <div className={classes.headerTooltip}>
                            <p>{t("location.title")} {location}?</p>
                            <div className={classes.tooltipBottom}>
                                <button onClick={() => setYourCityConfirm(false)}>{t("location.button1")}</button>
                                <button onClick={openModal}>{t("location.button2")}</button>
                            </div>
                            <ChangedCities t={t} handleChangeCity={handleChangeCity} open={open} handleClose={handleClose} setYourCityConfirm={setYourCityConfirm} />
                        </div>
                        <i />
                    </div>
                }
            </div>
        </div>
    )
}

export default Location
