import React, { useState } from "react";
import classes from "../../styles/Ordering.module.scss";
import classNames from "classnames";
import { CardContent, Typography, Checkbox } from "@mui/material";
import { CartItem } from "../../types/products";
import DeleteProductModalIconButton from "../DeleteProductModal/DeleteProductModalIconButton";
import { changeCartItemCount, changeCheckedItem } from "../../redux/products/cart.slice";
import { useAppDispatch } from "../../redux/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface Props {
  data: CartItem;
  setCheckedState: any;
  checkedState: any;
  setCheckboxAll: any;
}

function CartInfoCard({ data, checkedState, setCheckboxAll, setCheckedState }: Props) {
  const [count, setCount] = React.useState(data.count);
  const dispatch = useAppDispatch()
  const [price, setPrice] = useState(
    (data.price * 1000 * data.count).toLocaleString("ru-RU")
  );
  const { t } = useTranslation()
  const router = useRouter()

  const countIncrement = () => {
    if (count * 1000 <= data.max_limit) {
      const newCount = count + 1;
      setCount(newCount);
      setPrice((data.price * 1000 * newCount).toLocaleString("ru-RU"));
      dispatch(changeCartItemCount({ id: data.id, count: data.count + 1 }));
    }
  };

  const handleOnChange = ({ data }: any) => {
    setCheckboxAll(false)
    const updatedCheckedState = checkedState.map(({ id, checked, price, count }: { id: number, checked: boolean, price: number, count: number }) =>
      id === data.id ?
        { id, checked: !checked, price, count } :
        { id, checked, price, count }
    );

    setCheckedState(updatedCheckedState);
    dispatch(changeCheckedItem({ id: data.id, checked: data.checked }));
  }

  const countDecrement = () => {
    if (count >= data.min_limit / 1000) {
      const newCount = count - 1;
      setCount(newCount);
      setPrice((data.price * 1000 * newCount).toLocaleString("ru-RU"));
      dispatch(changeCartItemCount({ id: data.id, count: data.count - 1 }));
    }
    return 1;
  };

  const isCheckedCard = checkedState.find(({ id }: any) => data.id === id);

  return (
    <>
      <hr className={"mb-0"} />
      <CardContent className={classes.melkom}>
        <div
          className={classNames(
            "d-flex align-items-center",
            classes.melkombinat
          )}
        >
          <Typography
            className={classNames("mt-1", classes.melkombinat__text)}
            sx={{ fontSize: 16 }}
            color="green"
            gutterBottom
          >
            «{router.locale === "ru" ? data.elevator.title_ru : data.elevator.title_kk}»
          </Typography>
        </div>
      </CardContent>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between mb-4",
          classes.cartProductInfo
        )}
      >
        <Checkbox
          checked={isCheckedCard?.checked && isCheckedCard.checked}
          onChange={(e) => handleOnChange({ data, checked: e.currentTarget.value })}
          className={classes.cartProductInfo_checkbox}
          defaultChecked
          color="success"
        />
        <div
          className={classNames("d-flex align-items-center", classes.imgInfo)}
        >
          {data.image && (
            <img src={data.image} alt="sad" width={80} height={80} style={{ objectFit: 'contain' }} />
          )}
          <Typography
            className={classes.imgInfo__text}
            sx={{ fontSize: 16, width: 72 }}
          >
            {router.locale === "ru" ? data.type.title_ru : data.type.title_kk}
          </Typography>
        </div>
        <div className={classes.priceInfo}>
          <Typography
            className={classes.priceInfo__text}
            sx={{ fontSize: 18, fontWeight: 600 }}
          >
            {price} ₸
          </Typography>
          <Typography sx={{ fontSize: 12 }}>{data.price} ₸/кг</Typography>
        </div>
        <div className={classes.amountProduct}>
          <div className={"d-flex justify-content-between"}>
            <button type="button" onClick={countDecrement}>-</button>
            <Typography sx={{ fontSize: 16 }}>{Math.round(count)}</Typography>
            <button type="button" onClick={countIncrement}>+</button>
          </div>
          <Typography
            className={classes.amountProduct__text}
            sx={{ fontSize: 12 }}
          >
            {t("allProducts.cart.title1")}
          </Typography>
        </div>
        <div
          className={classNames(
            "d-flex align-items-center",
            classes.iconDelete
          )}
        >
          <DeleteProductModalIconButton data={data} />
        </div>
      </div>
      <div
        className={classNames(
          "d-none",
          classes.cartProductInfo,
          classes.cardProductInfo_mobile
        )}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between mt-3 mb-3",
            classes.imgInfo,
            classes.imgInfo_mobile
          )}
        >
          <Checkbox
            checked={isCheckedCard?.checked && isCheckedCard.checked}
            onChange={(e) => handleOnChange({ data, checked: e.currentTarget.value })}
            className={classes.cartProductInfo_checkbox}
            defaultChecked
            color="success"
          />
          <div>
            {data.image && (
              <img src={data.image} alt="sad" width={89} height={89} style={{ objectFit: 'contain' }} />
            )}
          </div>
          <div
            className={classNames("d-flex flex-column", classes.mobileVersion)}
          >
            <Typography
              className={classNames(
                classes.imgInfo__text,
                classes.imgInfo__text_mobile
              )}
              sx={{ fontSize: 16, width: 80 }}
            >
              {router.locale === "ru" ? data.type.title_ru : data.type.title_kk}
            </Typography>
            <div
              className={classNames(
                "d-flex align-items-center",
                classes.priceInfo
              )}
            >
              <Typography
                className={classNames(
                  classes.priceInfo__text,
                  classes.priceInfo__text_mobile
                )}
                sx={{ fontSize: 18, fontWeight: 600 }}
              >
                {price} ₸
              </Typography>
              <Typography sx={{ fontSize: 11 }}>{data.price} ₸/кг</Typography>
            </div>
          </div>
        </div>
        <hr className={classes.hr_mobile} />
        <div className={"d-flex justify-content-between"}>
          <div
            style={{ marginLeft: 17 }}
            className={classNames(
              classes.amountProduct,
              "d-flex flex-column-reverse pb-3"
            )}
          >
            <div
              className={classNames(
                "d-flex justify-content-between mt-2",
                classes.amountProduct_mobile
              )}
            >
              <button onClick={countDecrement}>-</button>
              <Typography sx={{ fontSize: 16 }}>{count}</Typography>
              <button onClick={countIncrement}>+</button>
            </div>
            <Typography
              className={classNames(
                classes.amountProduct__text,
                classes.amountProduct__text_mobile
              )}
              sx={{ fontSize: 12 }}
            >
              {t("allProducts.cart.title1")}
            </Typography>
          </div>
          <div
            className={classNames(
              "d-flex align-items-center",
              classes.iconDelete
            )}
          >
            <DeleteProductModalIconButton data={data} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CartInfoCard;
