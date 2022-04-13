import React from 'react'
import Image from 'next/image'
import heroPng from '../../assets/images/Hero.png'
import halfHeroPng from '../../assets/images/Half-Hero.png'
import classes from './Hero.module.scss';
import Button from '@mui/material/Button';
import { Container } from 'react-bootstrap';
import classNames from 'classnames';
import circleSvg from '../../assets/icons/PlusCircle.svg';
import Link from "next/link"
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation()

  return (
    <div className={classes.hero} style={{ position: 'relative' }}>
      <div id="home" style={{ position: "absolute", top: "-20px" }}/>
      <Container className={classNames(classes.pointerDisable, classes.container)}>
        <div>
          <div className="d-lg-none col-12">
            <Image src={halfHeroPng} alt="hero" width={768} height={384} objectFit="contain" objectPosition="bottom" />
          </div>
          <div className={classNames(classes.hero__content, 'col-lg-7')}>
            <div className="d-flex flex-column-reverse flex-lg-column">
              <p className={classNames(classes.heroTopText, 'text-primary')}><b>{t("hero.title1")}</b></p>
              <h1 className={classes.heroTitle}>{t("hero.title2")}</h1>
            </div>
            <p className={classes.heroSubTitle}>{t("hero.title3")}</p>
            <div className={classNames("col-lg-11", classes.pointerEnable)}>
              <div className={classNames("row")}>
                <div className="col-md-6">
                  <Link href="/#our_droducts">
                    <Button fullWidth variant="contained" color="primary">
                      {t("hero.button")}
                    </Button>
                  </Link>
                </div>
                <div className="col-md-6 d-none d-md-block">
                  <Link href="tel:+77750300098">
                    <Button fullWidth variant="text" color="primary">
                      +7 775 030-00-98
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className={classes.image}>
        <Link href="#products" passHref>
          <button className={classNames(classes.action, classes.actionOne)}>
            <b>{t("hero.kebek.title1")}</b>
            <Image src={circleSvg} alt="plus" width={25} height={25} />
          </button>
        </Link>
        <Link href="#products" passHref>
          <button className={classNames(classes.action, classes.actionTwo)}>
            <b>{t("hero.kebek.title2")}</b>
            <Image src={circleSvg} alt="plus" width={25} height={25} />
          </button>
        </Link>

        <Image src={heroPng} alt="hero" width={1920} height={1080} objectFit="contain" objectPosition="right" />
      </div>
    </div>
  )
}

export default Hero
