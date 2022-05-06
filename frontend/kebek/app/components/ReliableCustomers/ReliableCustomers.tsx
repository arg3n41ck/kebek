import React from 'react'
import classes from './ReliableCustomers.module.scss'
import Image from 'next/image'
import pngwing1 from '../../assets/images/pngwing1.svg'
import pngwing2 from '../../assets/images/pngwing2.svg'
import classNames from 'classnames'
import Circle from '../../assets/icons/reliable_circle.svg'
import { useTranslation } from 'react-i18next'

function ReliableCustomers() {
  const { t, i18n } = useTranslation()

  return (
    <div className={classNames("container p-0 d-flex justify-content-center", classes.main__container)}>
      <div className={classNames("row container m-0 p-0", classes.inner__container)}>
        <div className={classNames("col-6 col-12 col-sm-6 row d-flex justify-content-center", classes.particle__container)} style={{ position: 'relative', marginRight: "10px", marginBottom: "80px" }}>
          <div className={classNames("", classes.svg__container)} style={{ marginTop: "40px" }}>
            <Image src={Circle} alt="circle" />
          </div>
          <div className={classNames("col-12 row", classes.block__card1)}>
            <div className={classNames("col-4")}></div>
            <div className={classNames("col-8 row text-center", classes.mini__cards, classes.mini__card1)} style={{ marginBottom: "50px" }}>
              <div className={`col-12`} style={{ marginTop: "-25px" }}>
                <Image src={pngwing2} alt="a bag of seeds 1" className={classNames("text-center")} />
              </div>
              <div className={`col-12 text-center mt-2 mb-2`} >
                <h5 style={{ color: "#219653", fontWeight: 500, fontSize: 25 }}>
                  {t("hero.kebek.title1")}
                </h5>
                <p>
                  {/* <b><span style={{ fontWeight: 500, fontSize: 18 }}>75 ₸</span></b> {t("reliableCustomers.za1kg")} */}
                </p>
              </div>
            </div>
          </div>
          <div className={classNames("col-12 row", classes.block__card2)} style={{ marginTop: "50px" }}>
            <div className={classNames("col-8 row text-center", classes.mini__cards, classes.mini__card2)}>
              <div className={`col-12`} style={{ marginTop: "-50px" }}>
                <Image src={pngwing1} alt="a bag of seeds 1" />
              </div>
              <div className={`col-12 text-center mt-2 mb-2`}>
                <b>
                  <h5 style={{ fontSize: 25, fontWeight: 500, color: "#219653" }}>
                    {t("hero.kebek.title2")}
                  </h5>
                </b>
                <p>
                  {/* <b> <span style={{ fontWeight: 500, fontSize: 18 }}>85 ₸</span> </b>{t("reliableCustomers.za1kg")} */}
                </p>
              </div>
            </div>
            <div className={classNames("col-4")}></div>
          </div>
        </div>
        <div className={classNames("col-md-6 col-sm-6 col-12", classes.text__container, classes.particle__container)}>
          <p className={classNames("", classes.first__text)}>
            {t("reliableCustomers.title1")}
          </p>
          <p className={classNames("", classes.second__text)}>
            {t("reliableCustomers.title2")}
          </p>
          <p className={classNames("", classes.third__text)}>
            {t("reliableCustomers.title3")}
            <br />
            <br />
            {t("reliableCustomers.title4")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReliableCustomers
