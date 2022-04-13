import React from 'react'
import { Container } from 'react-bootstrap'
import classes from "./kebekKz.module.scss"
import classNames from "classnames"
import { useTranslation } from 'react-i18next'

function KebekKz() {

    const { t, i18n } = useTranslation()

    return (
        <div className={"d-flex justify-content-center position-relative"}>
            <div id="about" style={{ position: "absolute", top: "-20px" }}></div>
            <div className={classes.kebekKz_background}></div>
            <Container className={classNames("d-flex align-items-center flex-wrap flex-md-nowrap flex-md-row flex-column", classes.text__holder)}>
                <div className={classNames("px-3", classes.kebek__logo)}>
                    KEBEK<span>.kz</span>
                </div>
                <div className={classNames("px-3", classes.kebek__text)}>
                    {t("kebekKz.title")}
                </div>
            </Container>
        </div>
    )
}

export default KebekKz
