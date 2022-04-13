import React from 'react'
import classNames from 'classnames'
import classes from "./Locale.module.scss"
import ruFlag from "../../assets/icons/russion.svg"
import kkFlag from "../../assets/icons/kazakhstan.svg"
import { useMediaQuery } from '@mui/material'
import { localeContext } from '../../providers/LocaleProvider'

const Locale = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { locale, setLocale } = React.useContext(localeContext)

    const handleClick = (value) => {
        setLocale(value === "Русский" ? "ru" : "kz")
    }

    return (
        <div className={classNames(classes.header__items__locale)}>
            <div className={classes.tooltip_locale}>
                <div style={{ cursor: "pointer" }} className={"d-flex align-items-center"}>
                    <img src={locale === "ru" ? ruFlag : kkFlag} />
                    <p style={{ textTransform: "uppercase", textDecoration: "underline" }}>{locale === "ru" ? "RU" : "KZ"}</p>
                </div>
                <div className={isMobile ? classes.bottom_locale_menu : classes.bottom_locale}>
                    <div className={classes.tooltipBottom_locale}>
                        <button onTouchStart={(e) => handleClick(e.currentTarget.innerText)} onClick={(e) => handleClick("Русский")}>
                            <div style={locale === "ru" ? { background: "#fafcfa", color: "#219653" } : undefined} className={classes.ru}>
                                <img src={ruFlag} style={{ width: 28, height: 28 }} />
                                <p>Русский</p>
                            </div>
                        </button>
                        <button onTouchStart={(e) => handleClick(e.currentTarget.innerText)} onClick={(e) => handleClick("Казахский")}>
                            <div style={locale === "kz" ? { background: "#fafcfa", color: "#219653" } : undefined} className={classes.kk}>
                                <img src={kkFlag} style={{ width: 28, height: 28 }} />
                                <p>Қазақша</p>
                            </div>
                        </button>
                    </div>
                    <i />
                </div>
            </div>
        </div >
    )
}

export default Locale

// import React from 'react'

// function Locale() {
//     return (
//         <div>Locale</div>
//     )
// }

// export default Locale