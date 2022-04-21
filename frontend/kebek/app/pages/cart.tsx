import React, { Suspense } from "react";
import { Container } from "react-bootstrap";
import classNames from "classnames";
import classes from "../styles/Cart.module.scss";
import Link from "next/link";
import BasketInfoCard from "../components/BasketCard/BasketInfoCard";
import OrderCard from "../components/BasketCard/OrderCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { cartSelectors, changeCheckedItemAll } from "../redux/products/cart.slice";
import { Card, Checkbox, Typography } from "@mui/material";
import DeleteProductsModal from "../components/DeleteProductModal/DeleteProductsModal";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader/Loader";
import { useRouter } from "next/router";

function Cart() {
    const cart = useAppSelector((state) => cartSelectors.selectAll(state));
    const [checkboxAll, setCheckboxAll] = React.useState(true);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [checkedState, setCheckedState] = React.useState(
        !!cart.length ? cart.map((item) => ({ ...item })) : []
    );
    const { t } = useTranslation();

    const handleOnChange = () => {
        const isCheckedAllCheckbox = !checkboxAll;
        setCheckboxAll(!checkboxAll);

        const rewrittenCheckboxState: any = checkedState.map((item) => ({
            ...item,
            checked: isCheckedAllCheckbox,
        }));
        setCheckedState(rewrittenCheckboxState);
        dispatch(changeCheckedItemAll(rewrittenCheckboxState.map(({ id, checked }: any) => ({ id, changes: { checked } }))));
    };


    return (
        <Suspense fallback={<Loader />}>
            <div style={{ position: 'relative', paddingBottom: 150, minHeight: 'calc(100vh - 95.5px)' }}>
                <Container>
                    <div className={classes.cart_items}>
                        <div className={classNames(classes.cart_text)}>
                            <div className={classNames(classes.leftArrow)}>
                                <ul className={"d-flex"}>
                                    <Link href="/" passHref>
                                        <li>{t("allProducts.nav.title1")}&nbsp;</li>
                                    </Link>
                                    <Link href="/#products" passHref>
                                        <li>{t("allProducts.nav.title2")}&nbsp;</li>
                                    </Link>
                                    <Link href="/all_products" passHref>
                                        <li>{t("allProducts.nav.title3")}&nbsp;</li>
                                    </Link>
                                    <Link href="/ordering" passHref>
                                        <li style={{ fontWeight: "500" }}>
                                            {t("allProducts.cart.heading")}&nbsp;
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                            <p className={classes.wadeIn}>{t("cart.nav.title")}<sup style={{ fontSize: 18, marginLeft: 7, color: "#219653" }}>{cart.length}</sup></p>
                        </div>

                        <div className="row">
                            <div className={classNames("col-md-8", classes.group134)}>
                                <Card sx={{ width: "100%", padding: 0.5 }}>
                                    {!!cart?.length ? (
                                        <>
                                            <div
                                                className={classNames(
                                                    "d-flex justify-content-between align-items-center pt-2",
                                                    classes.frame87
                                                )}
                                            >
                                                <div className={"d-flex align-items-center"}>
                                                    <Checkbox
                                                        onChange={handleOnChange}
                                                        checked={checkboxAll}
                                                        className={classes.cartProductInfo_checkbox}
                                                        defaultChecked
                                                        color="success"
                                                    />
                                                    <Typography
                                                        className={classes.selectAll}
                                                        sx={{ fontSize: 18 }}
                                                    >
                                                        {t("cart.buttons.selectAll")}
                                                    </Typography>
                                                </div>
                                                <DeleteProductsModal data={checkedState} />
                                            </div>
                                            {cart.map((item) => (
                                                <div key={item.id}>
                                                    <BasketInfoCard
                                                        setCheckboxAll={setCheckboxAll}
                                                        setCheckedState={setCheckedState}
                                                        checkedState={checkedState}
                                                        data={item}
                                                    />
                                                </div>
                                            ))}
                                        </>
                                    )
                                        :
                                        <div style={{ textAlign: "center", padding: 20 }}>
                                            <Typography>{router.locale === "ru" ? "Ваша корзина пуста" : "Себетіңіз бос"}</Typography>
                                        </div>
                                    }
                                </Card>
                            </div>

                            <div
                                className={classNames(
                                    classes.ordering_items__paymentCard,
                                    "col-md-4"
                                )}
                            >
                                <Card
                                    className={classes.ordering_items__paymentCard_card}
                                    variant="outlined"
                                    sx={{ padding: 0.5 }}
                                >
                                    <OrderCard checkedProducts={checkedState} />
                                </Card>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </Suspense>
    );
}

export default Cart;
