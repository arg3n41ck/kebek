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
    i18n.changeLanguage(value)
  }


  useEffect(() => {
    console.log(pathname)
    if (router.route === '/about-product/[productId]') {
      if (router.asPath === "/about-product/[productId]") {
        const aboutAsPath = window.localStorage.getItem('dynamicPageAsPath');
        if (aboutAsPath) {
          setPathname(aboutAsPath);
          return
        }
        router.push('/');
      } else {
        setPathname(router.asPath);
        window.localStorage.setItem('dynamicPageAsPath', router.asPath);
      }
    } else {
      setPathname(router.asPath);
      window.localStorage.setItem('dynamicPageAsPath', router.asPath);
    }
  }, [router.route]);

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
              <Link href={pathname} locale="ru">
                <div onClick={(e) => handleClick("ru")} className={classes.ru}>
                  <Image src={ruFlag} width={28} height={28} />
                  <p>Русский</p>
                </div>
              </Link>
              <Link href={pathname} locale="kz">
                <div onClick={(e) => handleClick("kz")} className={classes.kk}>
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
