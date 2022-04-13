import React from 'react'
import classes from "./oldMan.module.scss"
import Image from "next/image"
import old3 from "../../assets/images/old3.svg"
import oldManTwo from "../../assets/images/old__man__variant2.png"
import classNames from 'classnames'
import { Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next"

function OldMan() {
    const { t } = useTranslation()

    function stylesMyText(text: any) {
        return {
            __html: text
        }
    }

    return (
        <div className={classNames("container-fluid p-0 m-0 d-flex justify-content-center", classes.main__container)}>
            <Container className={classNames("row p-0 m-0", classes.inner__container)} >
                <div className={classNames("col-8 row p-0 m-0 d-flex justify-content-center flex-column", classes.text__holder)}>
                    <div className={classNames("col-1", classes.empty__void)}>
                    </div>
                    <div className={classNames("col-11 py-5 row", classes.text__button__container)}>
                        <div className={classNames("col-12", classes.text__container)}>
                            <p dangerouslySetInnerHTML={stylesMyText(t("oldMan.title1"))} className={classes.first__text}></p>
                            <p className={classes.second__text}>{t("oldMan.title2")}</p>
                        </div>
                        <div className={classNames("col-12 d-flex flex-md-row", classes.button__container)}>
                            <a href="#our_droducts">
                                <button className={classes.first__button} style={{ fontSize: '18px' }}>
                                    <b>{t("hero.button")}</b>
                                </button>
                            </a>
                            <a href="tel:+77750300098">
                                <button className={classes.second__button} style={{ fontSize: '18px' }}>
                                    <b>+7 775 030-00-98</b>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={classNames("col-4 position-relative d-flex m-0 p-0 justify-content-end", classes.oldMan_image__container)} >
                    <div className={classes.imageWrapper}>
                        <Image src={oldManTwo} alt="" className={classes.old__image} />
                    </div>
                </div>
            </Container>


        </div >
    )
}

export default OldMan
