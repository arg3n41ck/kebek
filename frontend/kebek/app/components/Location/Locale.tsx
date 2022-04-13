import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from "next/image"
import classNames from 'classnames'
import classes from "../Header/header.module.scss"
import ruFlag from "../../assets/icons/russion.svg"
import kkFlag from "../../assets/icons/kazakhstan.svg"
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'

const Locale = () => {
  const { i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();
  const [pathname, setPathname] = useState(router.asPath);

  const handleClick = (value: string) => {
    const ifLang = value === "Русский"
    ifLang ? i18n.changeLanguage("ru") : i18n.changeLanguage("kz");
  }

  const path: any = router.pathname

  useEffect(() => {
    if (router.route === '/about/[id]') {
      if (router.asPath === "/about/[id]") {
        const aboutAsPath = window.localStorage.getItem('dynamicPageAsPath');
        if (aboutAsPath) {
          setPathname(aboutAsPath);
          return
        }
        router.push('/');
      } else {
        window.localStorage.setItem('dynamicPageAsPath', pathname);
        setPathname(router.asPath);
      }
    }
  }, []);

  return (
    <div className={classNames(classes.header__items__locale)}>
      <div className={classes.tooltip_locale}>
        <div className={"d-flex align-items-center"}>
          <Image src={router.locale === "ru" ? ruFlag : kkFlag} />
          <p
            style={{ textTransform: "uppercase", textDecoration: "underline" }}>{router.locale === "ru" ? "RU" : "KZ"}</p>
        </div>
        <div className={isMobile ? classes.bottom_locale_menu : classes.bottom_locale}>
          <div className={classes.headerTooltip_locale}>
            <div className={classes.tooltipBottom_locale}>
              <Link href={path} locale="ru">
                <div onClick={(e) => handleClick(e.currentTarget.innerText)} className={classes.ru}>
                  <Image src={ruFlag} width={28} height={28} />
                  <p>Русский</p>
                </div>
              </Link>
              <Link href={path} locale="kz">
                <div onClick={(e) => handleClick(e.currentTarget.innerText)} className={classes.kk}>
                  <Image src={kkFlag} width={28} height={28} />
                  <p>Қазақша</p>
                </div>
              </Link>
            </div>
          </div>
          <i />
        </div>
      </div>
    </div>
  )
}

export default Locale
