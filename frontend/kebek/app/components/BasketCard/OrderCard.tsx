import React from "react";
import {
    CardContent,
    CardActions,
    Button,
    Typography,
} from "@mui/material";
import classes from "../../styles/Cart.module.scss";
import Link from "next/link";
import classNames from "classnames";
import { useAppSelector } from "../../redux/hooks";
import { cartSelectors } from "../../redux/products/cart.slice";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

function OrderCard({ checkedProducts }: any) {
    const cart = useAppSelector((state) => cartSelectors.selectAll(state));
    const { user } = useAppSelector((state) => state.auth);
    const { t } = useTranslation()
    const token = window.localStorage.getItem("token")
    const [isUser, setIsUser] = React.useState(false)
    const router = useRouter()
    const isToken = !!window.localStorage.getItem("token")
    const userType = window.localStorage.getItem('user_type');
    const checkedProduct = cart.filter((item: any) => item.checked)

    React.useEffect(() => {
        !!token ? setIsUser(true) : setIsUser(false)
    }, [window.localStorage.getItem("token"), user, isToken])

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

    return (
        <div className={classes.mobile}>
            <div>
                <hr className={classNames(classes.hr_mobile2, "d-none")} />
                <CardActions className={"mt-2 d-flex flex-column"}>
                    <Button onClick={() => router.push("/ordering")} disabled={!checkedProduct.length || !isUser || userType === "AN"} variant="contained" color="success">
                        <Typography style={{ width: "100%", height: "auto" }}>
                            {t("cart.buttons.ordering")}
                        </Typography>
                    </Button>
                    {token ? (
                        <Typography
                            className={classNames(
                                classes.ordering_items__paymentCard__text,
                                "mt-2"
                            )}
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                        >
                            {t("cart.orderCard.title1")}
                        </Typography>
                    ) :
                        router.locale === "ru" ? (
                            <Typography
                                className={classNames(
                                    classes.ordering_items__paymentCard__text,
                                    "mt-1 mb-2"
                                )}
                                sx={{ fontSize: 13 }}
                                color="text.secondary"
                            >
                                Чтобы оформить заказ нужно{" "}
                                <Link href="/register">зарегистрироваться</Link> или{" "}
                                <Link href="/login">войти</Link> в существующий аккаунт
                            </Typography>

                        ) : (
                            <Typography
                                className={classNames(
                                    classes.ordering_items__paymentCard__text,
                                    "mt-1 mb-2"
                                )}
                                sx={{ fontSize: 13 }}
                                color="text.secondary"
                            >
                                Тапсырыс беру үшін сізге
                                <Link href="/register"> тіркелу </Link>
                                немесе бар есептік жазбаға <Link href="/login">кіру</Link> қажет.
                            </Typography>
                        )

                    }
                </CardActions>
            </div>

            <div>
                <CardContent
                    className={classes.ordering_items__paymentCard_cardContent}
                >
                    <hr className={classes.hr_mobile} />

                    <div
                        className={"d-flex justify-content-between align-items-center mt-3"}
                    >
                        <Typography
                            sx={{ fontSize: 18, fontWeight: 600, lineHeight: "140%" }}
                            component="div"
                        >
                            <p>{t("cart.orderCard.title2")}</p>
                        </Typography>
                        <Typography sx={{ fontSize: 12 }} color="text.secondary">
                            <p>{(totalAmountTon).toFixed(1)} тонн</p>
                        </Typography>
                    </div>

                    <div
                        className={"d-flex justify-content-between align-items-center mt-2"}
                    >
                        <Typography
                            sx={{ fontSize: 16, lineHeight: "140%" }}
                            component="div"
                        >
                            <p>{t("cart.orderCard.title3")} ({!!checkedProduct?.length ? checkedProduct.length : 0})</p>
                        </Typography>
                        <Typography sx={{ fontSize: 16 }} color="#000000">
                            {(totalSum * 1000).toLocaleString("ru")} ₸
                        </Typography>
                    </div>

                    <hr />

                    <div
                        className={"d-flex justify-content-between align-items-center mt-3"}
                    >
                        <Typography
                            sx={{ fontSize: 16, lineHeight: "140%", fontWeight: 600 }}
                            component="div"
                        >
                            {t("cart.orderCard.title4")}
                        </Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 600 }} color="#000000">
                            {(totalSum * 1000).toLocaleString("ru")} ₸
                        </Typography>
                    </div>

                    <Typography className={"mt-2"} sx={{ fontSize: 14 }} color="#4F4F4F">
                        *{t("ourProducts.title3")}
                    </Typography>
                </CardContent>
            </div>
        </div>
    );
}

export default OrderCard;
