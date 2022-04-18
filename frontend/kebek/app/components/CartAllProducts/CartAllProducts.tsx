import React, { Suspense, useMemo } from "react";
import { Card } from "react-bootstrap";
import classes from "../../styles/AllProductsCart.module.scss";
import classNames from "classnames";
import Link from "next/link";
import { useAppSelector } from "../../redux/hooks";
import { cartSelectors } from "../../redux/products/cart.slice";
import CartItemProduct from "./CartItemProduct";
import Button from "@mui/material/Button";
import { CartItem } from "../../types/products";
import { useTranslation } from "react-i18next";
import Loader from "../Loader/Loader";


function CartAllProducts() {
    const cart = useAppSelector((state) => cartSelectors.selectAll(state));
    const totalSum = useMemo(
        () => cart.reduce((acc, curr) => acc + curr.price * curr.count, 0),
        [cart]
    );
    const { t } = useTranslation()


    return (
        <Card className={classNames("", classes.cart__main)}>
            <Card.Body>
                <b>
                    <h4
                        className="text-start"
                        style={{ color: "#092F33", fontSize: "25px", fontWeight: "normal" }}
                    >
                        {t("allProducts.cart.heading")}
                    </h4>
                </b>
                <div>
                    <Suspense fallback={<Loader />} >
                        {cart.map((item) => (
                            <CartItemProduct data={item} key={item.id} />
                        ))}
                    </Suspense>
                </div>

                <hr className="mt-0" />
                <div className="row">
                    <div className={`col-md-6 col-6 d-flex flex-row ${classes.p}`}>
                        <p
                            style={{ color: "#092F33", fontSize: "16px", fontWeight: "300" }}
                        >
                            {t("allProducts.cart.title2")}:
                        </p>
                    </div>
                    <div className="col-md-6 col-6 d-flex justify-content-end">
                        <p
                            style={{ color: "#092F33", fontSize: "16px", fontWeight: "300" }}
                        >
                            0 ₸
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className={`col-md-6 col-6 d-flex flex-row ${classes.p}`}>
                        <p
                            style={{ color: "#092F33", fontSize: "21px", fontWeight: "500" }}
                        >
                            {t("allProducts.cart.title3")}:
                        </p>
                    </div>
                    <div
                        className={classNames(
                            "col-md-6 col-6 d-flex justify-content-end",
                            classes.totalsum
                        )}
                    >
                        <p
                            style={{ color: "#092F33", fontSize: "21px", fontWeight: "500" }}
                        >
                            {(totalSum * 1000).toLocaleString("ru")} ₸
                        </p>
                    </div>
                </div>
                <p
                    className="py-0 my-1 justify-content mb-3"
                    style={{
                        color: "#4F4F4F",
                        fontSize: "16px",
                        fontWeight: "300",
                    }}
                >
                    *{t("ourProducts.title3")}
                </p>
                <div className="row align-items-center">
                    <div className="col-md-12 col-12 col-sm-12">
                        {!cart.length ?
                            <Button
                                className={classes.card__button}
                                variant="outlined"
                                color="primary"
                                disabled
                            >
                                <span>{t("allProducts.cart.orderButton")}</span>
                            </Button>
                            :
                            <Link href="/cart" passHref>
                                <a
                                    className="d-flex align-items-center"
                                    style={{ textDecoration: "none" }}
                                >
                                    <Button
                                        className={classes.card__button}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        <span>{t("allProducts.cart.orderButton")}</span>
                                    </Button>
                                </a>
                            </Link>
                        }
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default CartAllProducts;
