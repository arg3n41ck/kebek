import React from 'react';
import facebookIcon from '../../assets/icons/facebook.svg';
import instaIcon from '../../assets/icons/insta.svg';
import Image from 'next/image';
import classes from './Footer.module.scss';
import { useTranslation } from "react-i18next";
import Link from 'next/link';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className={`${classes.main__container} d-flex justify-content-center`}>
      <div className={`${classes.inner__container} row d-flex justify-content-between container`}>
        <div className={`${classes.disa} col-md-5 row d-flex align-items-center`}>
          <div className="col-md-2 col-lg-2">
            <div className={classes.contacts__name}>
              <span style={{ color: "darkgreen", fontWeight: "400" }}>
                <b>{t("header.contacts")}</b>
              </span>
            </div>
          </div>
          <div className="col-md-7 col-lg-9">
            <div className={classes.left__number__text}>
              <span style={{ color: "darkgreen", fontWeight: "300" }}>
                <span>ㅤ</span>+7-775-030-00-98
              </span>
            </div>
          </div>
          <div className="col-md-3 col-lg-1">

          </div>
        </div>
        <div className={`${classes.icon__holder} col-md-2 col-sm-6 col-6 d-flex align-items-center justify-content-center`}>
          <Link href="https://www.facebook.com/Kebek-Kazakhstan-107409368463657/" passHref>
            <div style={{ cursor: "pointer" }} className="col-md-2 col-sm-2 col-2 text-end">
              <Image src={facebookIcon} className={classes.in__image} alt="facebook icon" />
            </div>
          </Link>
          <Link href="https://www.instagram.com/kebek_kz/" passHref>
            <div style={{ cursor: "pointer" }} className="col-md-1 col-sm-2 col-2 col-lg-3 text-center">
              <Image src={instaIcon} className={classes.in__image} alt="instagram icon" />
            </div>
          </Link>
        </div>
        <div className={`${classes.disa} col-md-5 row d-flex align-items-center`}>
          <div className="col-md-12 col-lg-12 text-end">
            <div className={classes.where__we__at__text}>
              <span style={{ color: "darkgreen", fontWeight: "400" }}><b>{t("header.address")}</b></span> <span>ㅤ</span><span style={{ color: "darkgreen", fontWeight: "300" }}>{t("header.adressInfo")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
