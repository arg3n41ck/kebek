import { useMediaQuery } from "@mui/material";
import React, { Suspense } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import ProductProvider from "../../components/ProductProvider/ProductProvider";

const Provider = () => {
  const isMedium = useMediaQuery("(max-width:768px)")
  return (
    <Suspense fallback={<Loader />} >
      <div style={{ minHeight: "90vh", position: "relative", paddingBottom: 150 }}>
        <ProductProvider />
      </div>
    </Suspense>
  );
};

export default Provider;
