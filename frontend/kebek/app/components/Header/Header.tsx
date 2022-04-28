import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import { Container, Navbar, Nav } from "react-bootstrap";
import classes from "./header.module.scss";
import burgerIcon from "../../assets/icons/burgerMenu.svg";
import cartIcons from "../../assets/icons/cartIcon.svg";
import Location from "../Location/Location";
import AvatarUser from "../Avatar/AvatarUser";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { cartSelectors } from "../../redux/products/cart.slice";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { useTranslation } from "react-i18next";
import Locale from "../Location/Locale";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { getNotifications, getUser, updateLastPage } from "../../redux/products/auth.slice";
import { fetchCities } from "../../redux/products/products.slice";

function Header() {
  const [token, setToken]: any = useState();
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => cartSelectors.selectAll(state));
  const [burgerMenu, setBurgerMenu] = useState(false);
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(min-width: 768px)');
  const selectCity = localStorage.getItem("selectCity")
  const router = useRouter()
  const isToken = !!window.localStorage.getItem("token")
  const { user } = useAppSelector((state) => state.auth)
  const { regions } = useAppSelector(state => state.product)
  const [cityRes, setCityRes] = useState<any>(null)
  const [notAuth, setNotAuth] = useState<string>()
  const pathNames = ["/login", "/register", "/new_password", "/reset_password", "/forgot_password", "/confirmation_sms", "/change_new_password"]

  React.useEffect(() => {
    if (pathNames.includes(router.pathname)) {
      setNotAuth("No")
    } else {
      setNotAuth(router.pathname)
    }
  }, [router.pathname])

  React.useEffect(() => {
    dispatch(fetchCities())
    if (!!window.localStorage.getItem("token")) {
      setToken(window.localStorage.getItem("token"))
      dispatch(getUser())
      dispatch(getNotifications())
    }
  }, [isToken])


  React.useEffect(() => {
    (function reCall() {
      !!regions?.length && regions.map((item: any) => {
        if (!!selectCity && selectCity !== "undefined") {
          return (item.title_ru === selectCity || item.title_kk === selectCity) && setCityRes(item)
        } else {
          return (item.title_ru === "Актобе" || item.title_kk === "Ақтөбе") && window.localStorage.setItem("selectCity", router.locale === "ru" ? item.title_ru : item.title_kk)
        }
      })
    })()
  }, [])

  React.useEffect(() => {
    !selectCity && window.localStorage.setItem("selectCity", router.locale === "ru" ? "Актобе" : "Ақтөбе")
    router.pathname.length && notAuth !== "No" && dispatch(updateLastPage(notAuth))
  }, [router.pathname])


  return (
    <>
      {burgerMenu ? (
        <BurgerMenu city={cityRes} setCity={setCityRes} setBurgerMenu={setBurgerMenu} />
      ) : (
        <>
          <div className={classes.fakeNav} />
          <Navbar
            className={classNames(classes.header, "fixed-top bg-white")}
            expand="lg"
          >
            <Container fluid="md" className={classes.headerContainer}>
              <div className="row w-100 m-0">
                <div className="col-12 col-sm-6 col-md-4 col-lg-2 p-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex flex-row-reverse flex-sm-row">
                      <Link href="/" passHref>
                        <Navbar.Brand href="#home" className={classes.brand}>
                          KEBEK
                        </Navbar.Brand>
                      </Link>
                      <Navbar.Toggle
                        onClick={() => setBurgerMenu(true)}
                        className={classes.toggle}
                        aria-controls="basic-navbar-nav"
                        as="button"
                      >
                        <Image src={burgerIcon} alt="burger menu" />
                      </Navbar.Toggle>
                    </div>
                    <Location city={cityRes} handleChangeCity={setCityRes} className={"d-sm-none d-flex"} />
                    <div
                      style={{ marginRight: 20 }}
                      className={"d-flex align-items-center"}
                    >
                      <div
                        className={
                          classes.header__items__button_and_icon_mobile
                        }
                      >
                        {!!token ? (
                          <div
                            className={classNames("d-block", classes.avatar)}
                            style={{
                              marginLeft: 20,
                              marginRight: 5,
                            }}
                          >
                            <AvatarUser setToken={setToken} data={user} />
                          </div>
                        ) : (
                          <>
                            <div
                              className={classes.header__items__button}
                            >
                              <Link href="/login" passHref>
                                <button>{t("header.button")}</button>
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                      <div
                        className={classNames(
                          "d-flex align-items-center d-none",
                          classes.cartIcon_mobile
                        )}
                      >
                        <Link href="/cart" passHref>
                          <a href="#" className={classes.cart_amountProducts}>
                            <span className={classes.cart_amountProducts_amount}>{cart.length}</span>
                            <Image src={cartIcons} alt="cartIcons" />
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-8 col-lg-10">
                  <div className="d-flex justify-content-end align-items-center h-100" style={{ gridColumnGap: '1vw' }}>
                    <Location city={cityRes} handleChangeCity={setCityRes} className="d-none d-sm-flex" />
                    <Navbar.Collapse className="bg-white" id="basic-navbar-nav">
                      <Nav className="ms-auto d-flex w-100 justify-content-end" style={{ gridColumnGap: '1vw' }}>
                        <Link href="/#home" passHref>
                          <Nav.Link className={`${classes.navItem} p-0`}>
                            {t("header.title1")}
                          </Nav.Link>
                        </Link>
                        <Link href="/ordering/#recipientDataAccordion" passHref>
                          <Nav.Link className={`${classes.navItem} p-0`}>
                            {t("header.title2")}
                          </Nav.Link>
                        </Link>
                        <Link href="/#products" passHref>
                          <Nav.Link className={`${classes.navItem} p-0`}>
                            {t("header.title3")}
                          </Nav.Link>
                        </Link>
                        <Link href="/#how-to-order" passHref>
                          <Nav.Link className={`${classes.navItem} p-0`}>
                            {t("header.title4")}
                          </Nav.Link>
                        </Link>
                        <Link href="/#faq" passHref>
                          <Nav.Link className={`${classes.navItem} p-0`}>
                            {t("header.title5")}
                          </Nav.Link>
                        </Link>
                      </Nav>
                    </Navbar.Collapse>
                    <div className={`h-100 d-flex align-items-center ${classes.header__items__button_and_icon}`}>
                      {!!token ? (
                        <div className={classNames("d-flex align-items-center", classes.avatar)}>
                          <AvatarUser setToken={setToken} data={user} />
                        </div>
                      ) : (
                        <div className={classes.header__items__button}>
                          <Link href="/login" passHref>
                            <button>{t("header.button")}</button>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div
                      style={{ marginTop: -2 }}
                      className={classNames(
                        "d-flex align-items-center",
                        classes.cartIcon
                      )}
                    >
                      <Link href="/cart" passHref>
                        <a href="#" className={`${classes.cart_amountProducts} d-flex align-items-center`}>
                          <span className={classes.cart_amountProducts_amount}>{cart.length}</span>
                          <Image src={cartIcons} alt="circular" />
                        </a>
                      </Link>
                    </div>
                    <div>
                      {isMobile &&
                        <Locale />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </Navbar>
        </>
      )}
    </>
  );
}

export default Header;
