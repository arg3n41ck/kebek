import classes from "../styles/500.module.scss";
import error500img from "../assets/icons/error500.svg";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";
import Loader from "../components/Loader/Loader";

export default function Error500Page() {
  const { t } = useTranslation();
  return (
    <>
      <Suspense fallback={<Loader />} >
        <div className={classes.container}>
          <div className={classes.imageBlock}>
            <Image src={error500img} alt="error 500" />
          </div>

          <div className={classes.notImageBlock}>
            <h1>500</h1>

            <p className={classes.description}>
              <b>{t("500.title")}</b>
            </p>

            <p className={classes.text}>{t("500.text")}</p>

            <button>
              <b>{t("500.toHome")}</b>
            </button>
          </div>
        </div>
      </Suspense>
    </>
  );
}
