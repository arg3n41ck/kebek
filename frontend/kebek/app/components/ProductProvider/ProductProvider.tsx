import React, { useEffect } from "react";
import Image from "next/dist/client/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageSharpIcon from "@mui/icons-material/LanguageSharp";
import classes from "../../styles/provider.module.scss";
import classNames from "classnames";
import Link from "@mui/material/Link";
import ArrowBackIcon from '../../assets/icons/leftArrow.svg'
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchElevatorsById } from "../../redux/products/products.slice";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Loader from "../Loader/Loader";


const ProductProvider: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { providerById } = useAppSelector((state) => state.product);

  const { id } = router.query ?? "";
  const { t } = useTranslation()

  useEffect(() => {
    if (id) {
      dispatch(fetchElevatorsById(id))
    }
  }, [dispatch, id])

  if (!providerById) {
    return <Loader />
  }

  return (
    <div className={classNames("container", classes.container_provider)}>
      <section className={classes.provider}>
        <Link className={classes.back_button_link} href="/all_products">
          <div className={classes.back_button}>
            <Image src={ArrowBackIcon} alt='' />
            <b className={"ms-2"}>{t("allProducts.pagination.title1")}</b>
          </div>
        </Link>
        <h2 className={classes.about__provider}><b>{t("about.title1")}</b></h2>
        <div className={classes.provider__logoNone}>
          {providerById.logo &&
            <img src={providerById.logo} width={238} alt="logo" style={{ objectFit: "contain" }} />
          }
        </div>
        <div className={`row ${classes.provider__column}`}>
          <div className={`col-8 ${classes.provider__info}`}>

            {providerById.title_ru && providerById.title_kk && (
              <h2 className={classes.provider__title}>
                <b>«{router.locale === "ru" ? providerById.title_ru : providerById.title_kk}»</b>
              </h2>
            )}

            {providerById.description_ru && providerById.description_kk && (
              <p className={classes.provider__text}>
                {router.locale === "ru" ? providerById.description_ru : providerById.description_kk}
              </p>
            )}
          </div>
          <div className={`col-4 ${classes.provider__logo}`}>
            {providerById.logo &&
              <img src={providerById.logo} alt="logo" style={{ objectFit: "contain" }} />
            }
          </div>
        </div>
      </section>
      {(!!providerById.address_ru || !!providerById.email || !!providerById.website) && (
        <section className={classes.contact} >
          <h2 className={classes.contact__title}>{t("header.contacts")}</h2>
          <ul className={classes.contact__info}>
            <li className={classes.contact__address}>

              {providerById.address_ru && providerById.address_kk && (
                <>
                  <LocationOnIcon className={classes.contact__icon} />
                  <Link className={classes.contact_icon_link} href={`#`}>
                    {router.locale === "ru" ? providerById.address_ru : providerById.address_kk}
                  </Link>
                </>
              )}
            </li>
            <li className={classes.contact__address}>
              {providerById.email && (
                <>
                  <LanguageSharpIcon className={classes.contact__icon} />
                  <Link className={classes.contact_icon_link} href={`#`}>
                    {providerById.email}
                  </Link>
                </>
              )}
            </li>
            <li className={classes.contact__address}>
              {providerById.website && (
                <>
                  <LanguageSharpIcon className={classes.contact__icon} />
                  <Link className={classes.contact_icon_link} href={`${providerById.website}`} target="_blank">
                    {providerById.website}
                  </Link>
                </>
              )}
            </li>
          </ul>
        </section >
      )}
    </div >
  );
};

export default ProductProvider;

