import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import classes from "../../styles/Ordering.module.scss";
import classNames from "classnames";
import { useAppSelector } from "../../redux/hooks";
import { cartSelectors } from "../../redux/products/cart.slice";
import { useTranslation } from "react-i18next";
import Treatment from "../Modals/Treatment";

function PaymentCard({ checkedProducts, open, handleClose, orders }: any) {
  const cart = useAppSelector((state) => cartSelectors.selectAll(state));
  const { t } = useTranslation()

  const checkedProduct = cart.filter((item: any) => item.checked)

  const totalSum = React.useMemo(
    () => {
      return checkedProduct.reduce((acc: any, curr: any) => acc + curr.price * curr.count, 0)
    },
    [cart]
  );

  const totalAmountTon = React.useMemo(
    () => checkedProduct.reduce((acc: any, curr: any) => acc + curr.count, 0),
    [cart]
  );

  function stylesMyText(text: any) {
    return {
      __html: text
    }
  }

  return (
    <div>
      <Card
        className={classes.ordering_items__paymentCard_card}
        variant="outlined"
        sx={{ padding: 0.5 }}
      >
        <div className={classes.mobile}>
          <div>
            <hr className={classNames(classes.hr_mobile2, "d-none")} />
            <CardActions className={"mt-1 pb-3 d-flex flex-column"}>
              <Button type="submit" disabled={!checkedProduct.length} variant="contained" color="success">
                {t("ordering.orderCard.button")}
              </Button>
              <Typography
                className={classNames(
                  classes.ordering_items__paymentCard__text,
                  "mt-2 mb-3"
                )}
                sx={{ fontSize: 14 }}
                color="text.secondary"
                dangerouslySetInnerHTML={stylesMyText(t("ordering.orderCard.title1"))}
              >
              </Typography>
            </CardActions>
            <Treatment data={orders} open={open} handleClose={handleClose} />
          </div>

          <div>
            <CardContent
              className={classes.ordering_items__paymentCard_cardContent}
            >
              <hr className={classes.hr_mobile} />
              <div
                className={classNames("d-flex justify-content-between align-items-center mt-1", classes.zakazCard)}
              >
                <Typography
                  sx={{ fontSize: 18, fontWeight: 600, lineHeight: "140%" }}
                  component="div"
                >
                  {t("cart.orderCard.title2")}:
                </Typography>
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                  {(totalAmountTon).toFixed(1)} тонн
                </Typography>
              </div>
              <div
                className={
                  "d-flex justify-content-between align-items-center mt-3"
                }
              >
                <Typography
                  sx={{ fontSize: 16, lineHeight: "140%" }}
                  component="div"
                >
                  {t("cart.orderCard.title3")} ({!!checkedProduct?.length ? checkedProduct.length : 0})
                </Typography>
                <Typography sx={{ fontSize: 16 }} color="#000000">
                  {(totalSum * 1000).toLocaleString("ru")} ₸
                </Typography>
              </div>
              <div
                className={
                  "d-flex justify-content-between align-items-center mt-3"
                }
              >
                <Typography
                  sx={{ fontSize: 16, lineHeight: "140%" }}
                  component="div"
                >
                  {t("ordering.orderCard.title2")}
                </Typography>
                <Typography sx={{ fontSize: 16 }} color="green">
                  {t("ordering.orderCard.title3")}
                </Typography>
              </div>
              <hr />
              <div
                className={
                  "d-flex justify-content-between align-items-center mt-3"
                }
              >
                <Typography
                  className={classes.totalCost_text}
                  sx={{ fontSize: 16, lineHeight: "140%", fontWeight: 600 }}
                  component="div"
                >
                  {t("cart.orderCard.title4")}:
                </Typography>
                <Typography
                  className={classes.totalCost_text2}
                  sx={{ fontSize: 16, fontWeight: 600 }}
                  color="#000000"
                >
                  {(totalSum * 1000).toLocaleString("ru")} ₸
                </Typography>
              </div>
              <Typography
                className={"mt-2"}
                sx={{ fontSize: 14 }}
                color="#4F4F4F"
              >
                *{t("ourProducts.title3")}
              </Typography>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PaymentCard;
