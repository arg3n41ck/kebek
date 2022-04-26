import * as React from "react";
import { ReactComponent as DrawerLinkIcon1 } from "../../static/icons/DrowerIcons/drawer_link-1.svg";
import { ReactComponent as DrawerLinkIconApplication } from "../../static/icons/DrowerIcons/application.svg";
import { NavLink } from "react-router-dom";
import cl from "./MainDrawerAdmin.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { Box, Button, Modal, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import classNames from "classnames";
import { useContext, useState } from "react";
import { $api } from "../../services/api";
import { SendAppeal } from "../ProfileItems/Support";
import { localeContext } from "../../providers/LocaleProvider";
import st from "styled-components";
import { notificationsContext } from "../../providers/NotificationsProvider";
import { StyledBadge } from "../Badge/Badge";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 580,
  width: "100%",
  height: "auto",
  borderRadius: "3px",
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  boxShadow: 24,
  padding: "57px 30px 30px 30px",
};

export default function PersistentDrawerLeft({ open, setOpen }) {
  const isMedium = useMediaQuery("(max-width: 1100px)");
  const [count, setCount] = useState(null);
  const [sendAppealModal, setSendAppealModal] = useState(false);
  const { t } = React.useContext(localeContext);
  const { notificationsUnRead, getNotReadNotifications } = useContext(notificationsContext);

  const theme = useTheme();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const appealModalHandler = () => {
    setSendAppealModal((prev) => !prev);
  };

  React.useEffect(async () => {
    getNotReadNotifications()
    const res = await $api.get("/notifications/", {
      params: {
        read: false,
      },
    });
    setCount(res.data.count);
  }, []);

  const navLinks = [
    {
      id: "drawer_link_admin-1",
      title: t.mainDrawer.title1,
      icon: <DrawerLinkIcon1 />,
      to: "/",
    },
    {
      id: "drawer_link_admin-2",
      title: t.mainDrawer.title2,
      icon: <DrawerLinkIcon1 />,
      to: "/profile",
    },
    {
      id: "drawer_link_admin-5",
      title: t.mainDrawer.title3,
      icon: <DrawerLinkIconApplication />,
      to: "/application",
    },
  ];

  return (
    <MainDrawerAdminWrapper
      className={"w-100"}
      style={{ display: "flex", width: "100%", position: "relative" }}
    >
      <Modal
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={sendAppealModal}
        onClose={appealModalHandler}
      >
        <Box
          className={cl.modalAppealWrapper}
          sx={{
            style,
            background: '#fff',
            maxWidth: 500,
            position: 'relative',
          }}
        >
          <div
            onClick={appealModalHandler}
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              cursor: 'pointer',
            }}
          >
            <CloseIcon />
          </div>
          <Box
            sx={{
              padding: 3,
            }}
          >
            <SendAppeal onCl={appealModalHandler} />
          </Box>
        </Box>
      </Modal>

      <Drawer
        sx={
          isMedium
            ? {
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              },
            }
            : {
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: "17.1%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              },
            }
        }
        variant="persistent"
        anchor="left"
        open={open}
      >
        <List className={"p-0"}>
          <div className={cl.MainDrawer}>
            <div className={cl.MainDrawer__main_border}>
              <a
                href="https://kebek.kz/"
                className={cl.MainDrawer__logo}
              >
                KEBEK
              </a>

              <ul className={cl.MainDrawer__navigationList}>
                {navLinks.map(({ id, title, icon, to }) => {
                  return (
                    <div key={id}>
                      <li
                        onClick={() => isMedium && handleDrawerClose()}
                        className={cl.MainDrawer__navigationList__linkWrapper}
                      >
                        <NavLink to={to} className={cl.link}>
                          <div className={cl.link__icon}>{icon}</div>
                          <span className={cl.link__title}>{title}</span>
                        </NavLink>
                      </li>
                    </div>
                  );
                })}

                <li
                  onClick={() => isMedium && handleDrawerClose()}
                  className={cl.MainDrawer__navigationList__linkWrapper}
                >
                  <NavLink to="/notifications" className={cl.link}>
                    <div className={cl.link__icon}>
                      <DrawerLinkIcon1 />
                    </div>
                    <span className={cl.link__title}>
                      {t.mainDrawer.title4}
                    </span>

                    {!!notificationsUnRead &&
                      <StyledBadge variant="badge" style={{ marginTop: 13, marginLeft: 10 }} badgeContent={notificationsUnRead} />
                    }
                  </NavLink>
                </li>
              </ul>

              <div className={cl.MainDrawer__help}>
                <div className={cl.MainDrawer__help__wrapper}>
                  <div className={cl.MainDrawer__help__wrapper__content}>
                    <h3>{t.mainDrawer.help.title1}</h3>
                    <p>{t.mainDrawer.help.title2}</p>
                  </div>
                  <button
                    onClick={appealModalHandler}
                    className={cl.MainDrawer__help__wrapper__submit}
                  >
                    {t.mainDrawer.help.button}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </List>
        <div style={{ width: "100%" }}>
          <hr style={{ margin: 0 }} />
          <DrawerHeader className={classNames("w-100 p-0", cl.closePanel)}>
            <Button
              style={{ color: "black" }}
              className={"w-100 h-100"}
              onClick={handleDrawerClose}
            >
              <Box sx={{ marginRight: 2 }}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </Box>
              {t.mainDrawer.panel.title}
            </Button>
          </DrawerHeader>
        </div>
      </Drawer>
    </MainDrawerAdminWrapper>
  );
}

const MainDrawerAdminWrapper = st.div`
  zoom: .9;
  @media screen and (max-width: 1370px) {
    zoom: .8;
  }
`;
