import React, { Suspense } from "react";
import classes from "../styles/404.module.scss";
import Image from "next/image";
import error404 from "../assets/images/eroor404.svg";
import fork from "../assets/images/fork.svg";
import socket from "../assets/images/socket.svg";
import Header from "../components/Header/Header";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader/Loader";

const Error404 = () => {
  const { t } = useTranslation();

  function stylesMyText(text: any) {
    return {
      __html: text,
    };
  }

  return (
    <>
      <Suspense fallback={<Loader />} >
        <div className={classes.conteiner}>
          <div
            className={`${classes.content__error} col-md-12 d-flex align-items-center`}
          >
            <div className={classes.fork}>
              <Image src={fork} alt="Вилка" />
            </div>
            <div className={classes.error404}>
              <Image src={error404} alt="404" />
            </div>
            <div className={classes.socket}>
              <Image src={socket} alt="Розетка" />
            </div>
          </div>
          <div className={classes.title}>
            <h1>
              <b>{t("404.title")}</b>
            </h1>
          </div>
          <div
            dangerouslySetInnerHTML={stylesMyText(t("404.text"))}
            className={`${classes.item} d-flex align-items-center`}
          />
          <NextLink href="/">
            <Link className={classes.link} underline="none">
              {t("404.toHome")}
            </Link>
          </NextLink>
        </div>
      </Suspense>
    </>
  );
};

export default Error404;
