import type { NextPage } from "next";
import Faq from "../components/FAQ/Faq";
import HowToOrder from "../components/howToOrder/HowToOrder";
import OurProducts from "../components/OurProducts/OurProducts";
import Footer from "../components/Footer/Footer";
import ReliableCustomers from "../components/ReliableCustomers/ReliableCustomers";
import Header from "../components/Header/Header";
import KebekKz from "../components/KebekKz/KebekKz";
import OldMan from "../components/OldMan/OldMan";
import Hero from "../components/Hero/Hero";
import Cookie from "../components/Cookie/Cookie";
import { Suspense, useEffect } from "react";
import { clearFilters } from "../redux/products/filter.slice";
import { fetchLandingProducts, fetchProducts } from "../redux/products/products.slice";
import { useAppDispatch } from "../redux/hooks";
import Loader from "../components/Loader/Loader";

const Home: NextPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchLandingProducts());
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <div style={{ position: "relative", paddingBottom: "40px" }}>
        <Hero />
        <KebekKz />
        <ReliableCustomers />
        <OurProducts />
        <HowToOrder />
        <OldMan />
        <Faq />
        <Cookie />
      </div>
    </Suspense>
  );
};

export default Home;
