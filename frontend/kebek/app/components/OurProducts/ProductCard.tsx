import React, { useState } from 'react'
import { Card, Button } from 'react-bootstrap';
import classes from './OurProducts.module.scss'
import Slider from '@mui/material/Slider';
import classNames from 'classnames';
import { IProductV2 } from '../../types/products';
import { MoreInfo } from '../AllProductsCard/AllProductsCard';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { addProductToCart, cartSelectors } from "../../redux/products/cart.slice";
import { useAppSelector } from '../../redux/hooks';
import { changeProviderModalCtx } from '../ChangeProviderModal/ChangeProviderModal';

type Props = {
  data: IProductV2
}

const ProductCard: React.FC<Props> = ({ data }) => {
  const cart = useAppSelector((state) => cartSelectors.selectAll(state));
  const [quantity, setQuantity] = useState(0)
  const dispatch = useDispatch();
  const defaultPrice = (data.price * quantity === 0 ? data.min_limit : quantity).toLocaleString('ru-RU')
  const [priceTon, setPriceTon] = useState(defaultPrice)
  const countInCart = cart.filter((item: any) => item.id === data.id && item.quantity)
  const isInCart = useAppSelector(
    (state: any) => !!cartSelectors.selectById(state, data.id)
  );
  const router = useRouter()
  const { t } = useTranslation();

  const handleChange = (e: any) => {
    const newQuantity = e.target.value
    const newPriceForTon = (newQuantity * data.price * 1000).toLocaleString("ru-RU")
    setQuantity(newQuantity)
    setPriceTon(newPriceForTon)
  }

  const { setOpenChange: setProviderChange } = React.useContext(
    changeProviderModalCtx
  );

  const handleClickOrder = async () => {
    if (cart.length) {
      const isCartContainsDifferentElevator = cart.some(({ elevator: { id } }) => id !== data?.elevator?.id);

      isCartContainsDifferentElevator ?
        setProviderChange({ status: true, product: { ...data, quantity: quantity === 0 ? data.min_limit / 1000 : quantity } })
        :
        dispatch(addProductToCart({ ...data, quantity: quantity === 0 ? data.min_limit / 1000 : quantity }))
    } else {
      await dispatch(addProductToCart({ ...data, quantity: quantity === 0 ? data.min_limit / 1000 : quantity }))
      // router.push('/cart')
    }
  };

  return (
    <Card className={`${classes.card__main} mt-4`}>
      <div className="row" style={{ marginTop: "20px" }}>
        <div className="col-2">
        </div>
        <div className="col-8">
          {data.image && <div className={classes.card__image} style={{ backgroundImage: `url(${data?.image})` }} />}
        </div>
        <div className={classNames("col-2", classes.info_icon)} style={{ cursor: "pointer", padding: "0" }}>
          <MoreInfo className="d-sm-flex" data={data.elevator} />
        </div>
      </div>
      <Card.Body>
        <h4 className="text-center" style={{
          color: "darkgreen",
          fontSize: "25px",
          fontWeight: 500
        }}>{router.locale === "ru" ? data.type.title_ru : data.type.title_kk}</h4>

        {/* <Slider
          size="small"
          defaultValue={1}
          aria-label="Custom marks"
          valueLabelDisplay="auto"
          step={1}
          min={data.min_limit / 1000}
          max={data.max_limit / 1000}
          style={{ color: "#219653", marginTop: "25px" }}
          value={quantity}
          onChange={handleChange}
        /> */}
        <div style={isInCart ? { paddingTop: 25 } : undefined} className="d-flex align-items-start justify-content-start">
          {isInCart ?
            (
              <Slider
                disabled
                size="small"
                aria-label="Disabled slider"
                valueLabelDisplay="auto"
                min={Math.round(data.min_limit / 1000)}
                max={Math.round(data.max_limit / 1000)}
                value={countInCart[0]?.quantity}
                onChange={handleChange}
              />
            )
            :
            (
              <Slider
                size="small"
                defaultValue={0}
                aria-label="Custom marks"
                valueLabelDisplay="auto"
                step={1}
                min={Math.round(data.min_limit / 1000)}
                max={Math.round(data.max_limit / 1000)}
                style={quantity > data.residue / 1000 ? { color: "red", marginTop: "25px" } : { color: "#219653", marginTop: "25px" }}
                value={Math.round(quantity)}
                onChange={handleChange}
              />
            )
          }
        </div>

        <div className="row">
          <div className={`col-md-6 col-6 ${classes.p}`}>
            <p style={{ color: "#4F4F4F", fontSize: "12px" }}>
              Мин. {Math.round(data.min_limit / 1000)} тонн.
            </p>
          </div>
          <div className="col-md-6 col-6 d-flex justify-content-end">
            <p style={{ color: "#4F4F4F", fontSize: "12px" }}>
              Макс. {Math.round(data.max_limit / 1000)} тонн.
            </p>
          </div>
        </div>
        <hr />
        <h4 style={{ color: 'darkgreen' }} className="text-center mt-2">{priceTon} ₸</h4>
        <p className={classNames("text-center", classes.preliminary)}
          style={{ color: "#4f4f4f", fontSize: "13px", fontWeight: "300" }}>*{t("ourProducts.title3")}</p>
        <div className="row align-items-center justify-content-between">
          {/* <div className="col-md-7 col-5 col-sm-7">
            <Button className={classes.card__button} variant="primary"
              onClick={handleClickOrder}> {t("hero.button")} </Button>
          </div> */}
          <div style={isInCart || quantity > data.residue / 1000 ? { margin: 0 } : undefined} className="col-md-7 col-5 col-sm-7">
            {isInCart || quantity > data.residue / 1000 ? (
              <Button
                disabled
                className={classes.card__button}
                variant="outlined"
                style={{ background: "none", color: "gray" }}
                color="primary"
              >
                {quantity > data.residue / 1000 ? (
                  t("allProducts.addButton")
                ) :
                  t("allProducts.inCartButton")
                }
              </Button>
            ) : (
              <Button
                onClick={handleClickOrder}
                className={classes.card__button}
                variant="contained"
              >
                {t("hero.button")}
              </Button>
            )}
          </div>
          <div className={"d-flex justify-content-around"} style={router.locale === "ru" ? { maxWidth: 120, paddingRight: 0 } : { maxWidth: 102, paddingRight: 0 }}>
            <div style={{ fontWeight: 500 }} className={classNames(classes.ton__text)}>
              {data.price} ₸
            </div>
            <div style={router.locale === "ru" ? { fontSize: 15 } : { fontSize: 13 }} className={classNames(classes.kilo__text)}>
              {t("reliableCustomers.za1kg")}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProductCard
