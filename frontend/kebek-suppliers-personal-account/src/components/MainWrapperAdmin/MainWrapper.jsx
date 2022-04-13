import React from "react";
import MainDrawerAdmin from "../MainDrawerAdmin/MainDrawerAdmin";
import Header from "../Header/Header";
import cl from "./MainWrapper.module.scss";
import Toasty from "../Toastify/Toasty";
import { localeContext } from "../../providers/LocaleProvider";
import Footer from "../Footer/Footer";
import Box from "@mui/material/Box";
import styled from "styled-components";
import { userContext } from "../../providers/UserProvider";

const MainWrapperAdmin = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  const { getUser } = React.useContext(userContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <div
      style={open ? { display: "grid" } : { display: "block" }}
      className={`${cl.mainWrapper} mWrapper`}
    >
      <MainDrawerAdmin open={open} setOpen={setOpen} />
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <Box
        className={cl.mainWrapper__children}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ minHeight: "90vh", margin: "0 0" }}>
          <ChildrenWrapper id={"childrenWrapper"}>{children}</ChildrenWrapper>
        </div>
        <div className={cl.mainWrapper__footer}>
          <Footer />
        </div>
      </Box>
      <Toasty />
    </div>
  );
};

const ChildrenWrapper = styled.div`
  margin: 50px;
  @media screen and (max-width: 992px) {
    margin: 20px;
  }
`;

export default MainWrapperAdmin;
