import React, { useEffect, useMemo } from "react";
import classes from "./OurProducts.module.scss";
import Image from "next/image";
import firstWheat from "../../assets/images/wheat.svg";
import secondWheat from "../../assets/images/secondWheat.svg";
import classNames from "classnames";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    fetchProducts,
} from "../../redux/products/products.slice";
import { clearFilters } from "../../redux/products/filter.slice";
import { useTranslation } from "react-i18next";
import { ChangeProviderModalProvider } from "../ChangeProviderModal/ChangeProviderModal";

const OurProducts = () => {
    const dispatch = useAppDispatch()
    const productDetail = useAppSelector((state) => state.product.landingProducts)
    const { t } = useTranslation()

    useEffect(() => {
        clearFilters()
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div style={{ position: "relative" }} id="our_droducts">
            <div id="products" style={{ position: "absolute", top: "-20px" }} />
            <div className={classes.main__background} />
            <div className={`row ${classes.inner__row}`}>
                <div
                    className={classNames("col-2 align-items-start", classes.wheatMan)}
                >
                    <Image src={firstWheat} alt="seeds" />
                </div>

                <div
                    className={classNames(
                        "col-12 col-sm-12 col-md-8 col-lg-8 colxl-8",
                        classes.center__container
                    )}
                >
                    <div className="container px-2" style={{ paddingTop: "95px" }}>
                        <div className={classes.main__text__holder}>
                            <h1 className={classes.our_products}>
                                <p>{t("ourProducts.title")}</p>
                            </h1>
                        </div>
                        <div
                            className={`${classes.card__holder} d-flex flex-wrap flex-row align-items-center justify-content-space-evenly`}
                            style={{ justifyContent: "space-evenly" }}
                        >
                            {!!productDetail?.length && productDetail.map((item: any) => (
                                <div key={item.id} className={"d-flex justify-content-evenly"}>
                                    <ChangeProviderModalProvider>
                                        <ProductCard data={item} />
                                    </ChangeProviderModalProvider>
                                </div>
                            ))}
                        </div>
                        <div className={`${classes.button__container}`}>
                            <Link href="/all_products" passHref>
                                <button className={classes.products__button}>
                                    <p>{t("ourProducts.title2")}</p>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div
                    className={classNames(
                        "col-2 d-flex align-items-end",
                        classes.wheatMan
                    )}
                >
                    <Image src={secondWheat} alt="seeds" />
                </div>
            </div>
        </div>
    );
};

export default OurProducts;
