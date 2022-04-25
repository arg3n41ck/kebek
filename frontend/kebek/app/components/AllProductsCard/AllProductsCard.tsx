import React, { useMemo, useState, FC } from "react";
import { Card } from "react-bootstrap";
import infoIcon from "../../assets/images/info__products.svg";
import classes from "./AllProductsCard.module.scss";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Image from "next/image";
import classNames from "classnames";
import { IProductV2, IProductProviderV2 } from "../../types/products";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addProductToCart,
  cartSelectors,
  changeCartItemCount,
} from "../../redux/products/cart.slice";
import siteIcon from "../../assets/icons/siteIcon.svg";
import geoLocation from "../../assets/icons/geoLocation.svg";
import { useRouter } from "next/router";
import { changeProviderModalCtx } from "../ChangeProviderModal/ChangeProviderModal";
import { useTranslation } from "react-i18next";

type PropsInfo = {
  className: string;
  data: IProductProviderV2;
};

type Props = {
  data: IProductV2;
};

export const MoreInfo: FC<PropsInfo> = ({ className = "", data }: any) => {
  const router = useRouter()
  return (
    <div className={classNames(classes.header__items__location, className)}>
      <div className={classNames(classes.header__items__location__image)} />
      <div className={classNames("flex", classes.tooltip)}>
        <Image src={infoIcon} width={30} height={30} alt="location icon" />
        <div className={classes.bottom}>
          <div className={classes.inner__bottom}>
            <div className={classes.headerTooltip}>
              <p className={classes.companyName__text}>«{router.locale === "ru" ? data.title_ru : data.title_kk}»</p>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "140%",
                  color: "#000000",
                }}
                className="mt-3"
              >
                Контакты
              </p>
              {data?.address_kk && <div className={"d-flex align-items-center mt-2"}>
                <div style={{ marginRight: 5, width: 16, height: 16 }}>
                  <Image src={geoLocation} alt="geo" width={16} height={16} />
                </div>
                <p className={classes.address__text}>{router.locale === "ru" ? data.address_ru : data.address_kk}</p>
              </div>}
              {data?.email && <div className={"d-flex align-items-center mt-2"}>
                <div style={{ marginRight: 5, width: 16, height: 16 }}>
                  <Image src={siteIcon} alt="geo" width={16} height={16} />
                </div>
                <p className={classes.email__text}>{data.email}</p>
              </div>}
              <Link href={{
                pathname: `/about/[id]`,
                query: { id: data.id }
              }} passHref>
                <p
                  style={{
                    color: "#219653",
                    fontWeight: 500,
                    fontSize: "16px",
                  }}
                  className="my-3"
                >
                  Узнать больше
                </p>
              </Link>
            </div>
            <i />
          </div>
        </div>
      </div>
    </div >
  );
};

const AllProductsCard: React.FC<Props> = ({ data }: any) => {
  const [quantity, setQuantity] = useState(data?.min_limit / 1000);
  const priceTon = useMemo(() => {
    return (data.price * 1000 * quantity).toLocaleString("ru-RU");
  }, [data.price, quantity]);
  const isInCart = useAppSelector(
    (state: any) => !!cartSelectors.selectById(state, data.id)
  );
  const cart = useAppSelector((state: any) => cartSelectors.selectAll(state));
  const { t } = useTranslation()
  const router = useRouter()

  const countInCart = cart.filter((item: any) => item.id === data.id && item.quantity)
  const dispatch = useAppDispatch();

  const { setOpenChange: setProviderChange } = React.useContext(
    changeProviderModalCtx
  );

  const handleAddToCart = () => {
    if (cart.length) {
      const isCartContainsDifferentElevator = cart.some(({ elevator: { id } }: any) => id !== data?.elevator?.id);

      isCartContainsDifferentElevator ?
        setProviderChange({ status: true, product: { ...data, quantity } })
        :
        dispatch(addProductToCart({ ...data, quantity }));
    } else {
      dispatch(addProductToCart({ ...data, quantity }));
    }
  };

  const handleChangeQuantity = (e: any, value: number | number[]): void => {
    const val: number = Array.isArray(value) ? value[0] : value;
    setQuantity(val);

    dispatch(
      changeCartItemCount({
        id: data.id,
        count: val,
      })
    );
  };

  return (
    <Card className={`${classes.card__main}`}>
      <div className="row mx-1" style={{ marginTop: "20px" }}>
        <div className="col-4">
          {data.image && (
            <div className={classes.cart__image} style={{ backgroundImage: `url(${data.image})` }} />
          )}
        </div>
        <div className={classNames("col-8", classes.product_title)}>
          <h5 className="text-start" style={{ color: "#061f22" }}>
            {router.locale === "ru" ? data.type.title_ru : data.type.title_kk}
          </h5>
          <div className="row">
            <div
              className={classNames(
                "col-md-2 col-4 col-sm-2 d-flex",
                classes.ton__text
              )}
              style={{ fontSize: "16px", color: "#219653" }}
            >
              {data.price}₸
            </div>
            <div
              className={classNames(
                "col-md-4 col-6 col-sm-4 d-flex",
                classes.kilo__text
              )}
              style={{ marginLeft: 10 }}
            >
              {t("reliableCustomers.za1kg")}
            </div>
            <div className="col-md-7 col-7 col-sm-7" />
          </div>
        </div>
      </div>
      <div className="col-md-7 col-7 col-sm-7" />
      <Card.Body>
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
                onChange={handleChangeQuantity}
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
                onChange={handleChangeQuantity}
              />
            )
          }
        </div>
        <div className="row">
          <div className={`col-md-6 col-6 mb-0 ${classes.p}`}>
            <p style={{ color: "#4F4F4F", fontSize: "12px" }}>
              Мин. {Math.round(data.min_limit / 1000)} тонн
            </p>
          </div>
          <div className="col-md-6 col-6 d-flex justify-content-end">
            <p style={{ color: "#4F4F4F", fontSize: "12px" }}>
              Макс. {Math.round(data.max_limit / 1000)} тонн
            </p>
          </div>
        </div>
        <div
          className="row d-flex flex-row"
          style={{ maxHeight: "90px", backgroundColor: "#FAFCFA" }}
        >
          <div className="col-10 text-start d-flex flex-row align-items-center justify-content-start pt-3">
            <p style={{ fontSize: "14px" }}>{router.locale === "ru" ? data.elevator.title_ru : data.elevator.title_kk}</p>
          </div>
          <div className="col-2 d-flex flex-end align-items-center justify-content-center">
            <MoreInfo className="d-sm-flex" data={data.elevator} />
          </div>
        </div>
        <h4 className="text-start mt-2">{priceTon}₸</h4>
        <p
          className="py-0 my-1 text-left mb-3"
          style={{ color: "#4f4f4f", fontSize: "18px", fontWeight: 300 }}
        >
          {t("allProducts.residueOnElevator.title")}:
          <span className="ps-2" style={quantity > data.residue / 1000 ? { color: "red", fontSize: "16px", fontWeight: 400 } : { color: "#219653", fontSize: "16px", fontWeight: 400 }}>
            {Math.round(data.residue / 1000)} тонн
          </span>
        </p>
        <div className="row align-items-center">
          <div style={isInCart || quantity > data.residue / 1000 ? { margin: 0 } : undefined} className="col-md-12 col-12 col-sm-12">
            {isInCart || quantity > data.residue / 1000 ? (
              <Button
                disabled
                className={classes.card__button}
                variant="outlined"
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
                onClick={handleAddToCart}
                className={classes.card__button}
                variant="contained"
              >
                {t("allProducts.addButton")}
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AllProductsCard;
