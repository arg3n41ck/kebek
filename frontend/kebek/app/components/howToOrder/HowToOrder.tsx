import React from 'react'
import classes from "./howToOrder.module.scss"
import vector from "../../images/Vec.svg"
import BoxMarket from "../../images/Vector.svg"
import Image from "next/image"
import group40 from "../../images/Group 40.svg"
import classNames from 'classnames'
import group402 from "../../images/Group 402.svg"
import group126 from "../../images/Group 126.svg"
import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';



function HowToOrder() {
  const { t } = useTranslation()

  function stylesMyText(text: any) {
    return {
      __html: text
    }
  }

  return (
    <Container className="position-relative">
      <div id="how-to-order" style={{ position: "absolute", top: "-100px" }}></div>
      <p className={classNames("text-center", classes.greetings)}>{t("howToOrder.heading")}</p>
      <div className="row">
        <div className={classNames("col-12 d-flex align-items-center justify-content-center flex-row ", classes.first__card__container)}>
          <div className={classNames("col-8", classes.card, classes.first__card)}>
            <div style={{ marginLeft: 40 }}>
              <p className={classes.first__text}>{t("howToOrder.card1.heading2")}</p>
              <div className={classes.bullit}>
                <p className={classes.second__text}>{t("howToOrder.card1.title1")}</p>
                <p className={classes.third__text}>{t("howToOrder.card1.title2")}</p>
              </div>

              <div className={classes.bullit}>
                <p className={classes.second__text}>{t("howToOrder.card1.title3")}</p>
                <p className={classes.third__text}>{t("howToOrder.card1.title4")}</p>
              </div>
            </div>
            <hr className={"m-0 p-0"} />
            <div className={classNames("row mt-3", classes.cardBottom_info)}>
              <div style={{ width: 42 }} className={classNames("col-1", classes.cardBottom_info__image)}>
                <Image src={vector} alt="" />
              </div>
              <div className={classNames("col-10 mt-3", classes.cardBottom_info__text)}>
                <p dangerouslySetInnerHTML={stylesMyText(t("howToOrder.card1.title5"))} className={classNames(classes.third__text, classes.third__text_1)}></p>
              </div>
            </div>
          </div>
          <div className={classNames("col-4", classes.image__container)}>
            <Image src={BoxMarket} alt="cart" />
          </div>
        </div>
        <div className={classNames("col-12 d-flex align-items-center justify-content-center flex-row", classes.second__card__container)}>
          <div className={classNames("col-4", classes.image__container)}>
            <Image src={group402} alt="" />
          </div>
          <div className={classNames("col-8", classes.card, classes.second__card)}>
            <div style={{ marginLeft: 40 }}>
              <p className={classes.first__text}>{t("howToOrder.card2.heading")}</p>
              <div className={classes.bullit2}>
                <p className={classes.second__text}>{t("howToOrder.card2.title1")}</p>
                <p className={classes.third__text}>{t("howToOrder.card2.title2")}</p>
              </div>

              <div className={classes.bullit2}>
                <p className={classes.second__text}>{t("howToOrder.card2.title3")}</p>
                <p className={classes.third__text}>{t("howToOrder.card2.title4")}</p>
              </div>
            </div>
            <hr className={"m-0 p-0 mt-2"} />
            <div className={classNames("row mt-3", classes.cardBottom_info)}>
              <div style={{ width: 42 }} className={classNames("col-1", classes.cardBottom_info__image)}>
                <Image src={vector} alt="" />
              </div>
              <div className={classNames("col-10 mt-3", classes.cardBottom_info__text)}>
                <p dangerouslySetInnerHTML={stylesMyText(t("howToOrder.card2.title5"))} className={classNames(classes.third__text, classes.third__text_2)}></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container >
  )
}

export default HowToOrder