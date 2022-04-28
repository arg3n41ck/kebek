import React, { Suspense } from "react";
import Loader from "../../components/Loader/Loader";
import ProductProvider from "../../components/ProductProvider/ProductProvider";

const Id = () => {
  return (
    <Suspense fallback={<Loader />} >
      <div style={{ minHeight: "90vh", position: "relative", paddingBottom: 150 }}>
        <ProductProvider />
      </div>
    </Suspense>
  );
};

export default Id;
