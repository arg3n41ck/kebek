import React, { FC, Suspense, useEffect } from "react";
import Link from "next/link";
import classNames from "classnames";
import classes from "../styles/AllProductsCart.module.scss";
import AllProductsCard from "../components/AllProductsCard/AllProductsCard";
import { Container } from "react-bootstrap";
import PaginationAllProducts from "../components/PaginationAllProducts/PaginationAllProducts";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchCities,
  fetchElevators,
  fetchFilterProducts,
  fetchPagination,
  fetchTypesProducts,
  productSelectors,
} from "../redux/products/products.slice";
import CartAllProducts from "../components/CartAllProducts/CartAllProducts";
import SkeletonComponent from "../components/Skeleton/SkeletonComponent";
import { filterSelector } from "../redux/products/filter.slice";
import ProductsFilters from "../components/ProductsFilters/ProductsFilters";
import { ChangeProviderModalProvider } from "../components/ChangeProviderModal/ChangeProviderModal";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader/Loader";

const All_products: FC = () => {
  const products = useAppSelector((state) => productSelectors.selectAll(state));
  const { loading, countPage } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const [page, setPage] = React.useState(1);
  const { type, elevator, elevator__cities } = useAppSelector(filterSelector);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchTypesProducts());
    dispatch(fetchElevators());
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFilterProducts());
  }, [dispatch, type, elevator, elevator__cities]);

  useEffect(() => {
    dispatch(fetchPagination(page));
  }, [dispatch, page]);

  return (
    <Suspense fallback={<Loader />}>
      <div style={{ position: "relative", paddingBottom: "170px", minHeight: 'calc(100vh - 95.5px)' }}>
        {loading && !products.length ? (
          <SkeletonComponent />
        ) : (
          <Container className={classNames(``, classes.parent__container)}>
            <div
              className={classNames(`d-flex flex-row justify-content-start`)}
            >
              <div style={{ marginBottom: "1rem" }}>
                <Link href="/" passHref>
                  <a className={'fw-normal'}
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "#828282",
                      fontWeight: 300,
                      fontSize: "16px",
                    }}
                  >
                    {t("allProducts.nav.title1")}
                  </a>
                </Link>{" "}
                /
                <Link href="/#products" passHref>
                  <a className={'fw-normal'}
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "#828282",
                      fontWeight: 300,
                      fontSize: "16px",
                    }}
                  > {t("allProducts.nav.title2")}
                  </a>
                </Link>{" "}
                /
                <Link href="/all_products" passHref>
                  <span style={{ textDecoration: "none", cursor: "pointer" }}>
                    <b> {t("allProducts.nav.title3")}</b>
                  </span>
                </Link>
              </div>
            </div>
            <div>
              <h2>{t("allProducts.nav.heading")}</h2>
            </div>
            <Suspense fallback={<Loader />}>
              <ProductsFilters />
            </Suspense>
            <div className="row flex-column flex-md-row p-0">
              <div className="col-12 col-md-8">
                <div className="row">
                  {products
                    .filter((item) => {
                      return !!item;
                    })
                    .map((product) => (
                      <div
                        className={classNames(
                          "col-12 col-sm-6  mt-3",
                          classes.cardItself
                        )}
                        key={product?.id}
                      >
                        <ChangeProviderModalProvider>
                          <AllProductsCard data={product} />
                        </ChangeProviderModalProvider>
                      </div>
                    ))}
                </div>
                <div className="d-flex justify-content-center my-3">
                  <PaginationAllProducts
                    setPage={setPage}
                    page={page}
                    count={countPage}
                  />
                </div>
              </div>
              <div className="col-12 col-md-4 mt-3">
                <CartAllProducts />
              </div>
            </div>
          </Container>
        )}
      </div>
    </Suspense>
  );
};
export default All_products;
