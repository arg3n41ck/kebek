import React from 'react'
import classNames from "classnames"
import classes from "../Header/header.module.scss"
import Link from "next/link"
import Image from "next/image"
import xIcon from "../../assets/images/close.png";
import facebookIcon from "../../assets/icons/facebook.svg";
import instagramIcon from "../../assets/icons/insta.svg";
import locationIcon from "../../images/locationIcon.svg";
import Locale from '../Location/Locale';
import ChangedCities from "../ChangedCitiesModal/ChangedCities"
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/router'

interface Props {
    setBurgerMenu: any,
    city: any,
    setCity: any
}

function BurgerMenu({ setBurgerMenu, city, setCity }: Props) {
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
        if (!!window.localStorage.getItem("selectCity")) {
            setLocation(!!city ? router.locale === "ru" ? city?.title_ru : city?.title_kk : router.locale === "ru" ? cityDefault.title_r : cityDefault.title_k)
        }
    }, [city, router.locale])


    return (
        <div>

            <div
                className={classes.burger_block}
                style={{
                    height: "100%",
                    width: "100%",
                    position: "fixed",
                    zIndex: "99",
                    background: "white",
                    overflowY: "auto",
                }}
            >
                <div
                    className={classes.x_kebek}
                    style={{ display: "flex", width: "auto", alignItems: "center" }}
                >
                    <p style={{ cursor: "pointer", margin: 0, padding: 0 }}>
                        <Image
                            className={classes.x_icon}
                            width={26}
                            height={26}
                            onClick={() => setBurgerMenu(false)}
                            src={xIcon}
                            alt=""
                        />
                    </p>
                    <h3 style={{ marginLeft: "25px" }}>KEBEK</h3>
                </div>
                <hr />

                <div className={classes.location_language_block}>
                    <div className={classNames(classes.header__items__location_menu)}>
                        <div onClick={() => setYourCityConfirm(!yourCityConfirm)} className={classNames(classes.header__items__location__image)} >
                            <Image src={locationIcon} alt="location icon" />
                        </div>
                        <div className={classes.tooltip_menu}>
                            <p onClick={() => setYourCityConfirm(!yourCityConfirm)} className={"m-0"}>{location}</p>
                            {yourCityConfirm &&
                                <div className={yourCityConfirm ? classes.bottom_menu : "d-none"}>
                                    <div className={classes.headerTooltip_menu}>
                                        <p>{t("location.title")} {location}?</p>
                                        <div className={classes.tooltipBottom_menu}>
                                            <button onClick={() => setYourCityConfirm(false)}>{t("location.button1")}</button>
                                            <button onClick={openModal}>{t("location.button2")}</button>
                                        </div>
                                        <ChangedCities t={t} handleChangeCity={setCity} open={open} handleClose={handleClose} setYourCityConfirm={setYourCityConfirm} />
                                    </div>
                                    <i />
                                </div>
                            }
                        </div>
                    </div>
                    <div className={classes.language}>
                        <Locale />
                    </div>
                </div>
                <hr />
                <div className={classes.info_titles}>
                    <Link href="/#home" passHref>
                        <p onClick={() => setBurgerMenu(false)}>{t("header.title1")}</p>
                    </Link>
                    <Link href="/#about" passHref>
                        <p onClick={() => setBurgerMenu(false)}>{t("header.title2")}</p>
                    </Link>
                    <Link href="/#products" passHref>
                        <p onClick={() => setBurgerMenu(false)}>{t("header.title3")}</p>
                    </Link>
                    <Link href="/#how-to-order" passHref>
                        <p onClick={() => setBurgerMenu(false)}>{t("header.title4")}</p>
                    </Link>
                    <Link href="/#faq" passHref>
                        <p
                            style={{ marginBottom: "30px" }}
                            onClick={() => setBurgerMenu(false)}
                        >
                            {t("header.title5")}
                        </p>
                    </Link>
                </div>
                <hr />
                <div className={classes.info_block}>
                    <div className={classes.contacts}>
                        <p style={{ marginBottom: "7px" }}>{t("header.contacts")}</p>
                        <p style={{ fontWeight: "300", fontSize: "14px" }}>
                            +7-775-030-00-98
                        </p>
                    </div>
                    <div className={classes.our_location}>
                        <p style={{ marginBottom: "7px" }}>{t("header.address")}</p>
                        <p style={{ fontWeight: "300", fontSize: "14px" }}>
                            г.Актобе, 41 разъезд, дом 9В
                        </p>
                    </div>
                    <div className={classes.icons}>
                        <div className={classes.icon}>
                            <Link href="#" passHref>
                                <a href="#">
                                    <Image width={25} height={25} src={facebookIcon} alt="" />
                                </a>
                            </Link>
                        </div>
                        <div className={classes.icon}>
                            <Link href="#" passHref>
                                <a href="#">
                                    <Image width={25} height={25} src={instagramIcon} alt="" />
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BurgerMenu
