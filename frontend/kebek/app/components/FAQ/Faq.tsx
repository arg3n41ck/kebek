import React, { useEffect, useState } from "react";
import classes from "./faq.module.scss";
import FaqItem from "./FaqItem";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { NextRouter, useRouter } from "next/router";
import $api from "../../utils/axios";

const getFaq = async ({ language }: { language: string }) => {
  try {
    const { data }: any = await $api.get(`/support/faq/?language=${language}`);
    return data?.results?.[0] || null;
  } catch (e: any) {
    return e?.response;
  }
}

const Faq: React.FC = () => {
  const router: NextRouter = useRouter()
  const language: string = router.locale === "kz" ? "kk" : "ru";
  const [col1, setCol1] = useState<[] | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    getFaq({ language }).then(data => {
      setCol1(data?.qa?.slice(0, data?.qa?.length) || []);
    })
  }, [language]);

  return (
    <>
      <div className={classNames("container position-relative", classes.faq)}>
        <div id="faq" style={{ position: "absolute", top: "-140px" }} />
        <div className={classes.container}>
          <div>
            <h1 className={classes.faq__name}>{t("faq.heading")}</h1>
            <div className={classes.faq__contact}>
              {t("faq.title1")}<br /> <span className={classes.faq__phone}>+7 775 030-00-98</span>
            </div>
          </div>
          <div>
            <div className={`row ${classes.faq__column}`}>
              <div style={{ display: "grid", gridTemplateColumns: "50% 50%" }} className={`${classes.faq__column_items}`}>
                {!!col1 && col1.filter((item: any) => {
                  return !!item
                }).map((item: any) => (
                  <>
                    <FaqItem data={item} key={item.id} />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
