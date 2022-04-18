import React, { useContext, useState } from "react";
import classNames from "classnames";
import classes from "./Locale.module.scss";
import { Avatar, Typography, Button, Modal, Box } from "@mui/material";
import { StyledBadge } from "../Badge/Badge";
import { notificationsContext } from "../../providers/NotificationsProvider";
import { Link } from "react-router-dom"
import CloseIcon from '@mui/icons-material/Close';
import { navigate } from "../MainWrapperAdmin/MainWrapper"
import { localeContext } from "../../providers/LocaleProvider";
import { style } from "../MainDrawerAdmin/MainDrawerAdmin";
import cl from "../MainDrawerAdmin/MainDrawerAdmin.module.scss"

const AvatarUser = ({ className = "", data, handleClose }) => {
  const [selectCity, setSelectCity] = useState(
    localStorage.getItem("selectCity")
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose2 = (e) => {
    setOpen(false)
    setYourCityConfirm(false)
  }

  const { getNotReadNotifications, notificationsUnRead } = useContext(notificationsContext);
  const { locale } = React.useContext(localeContext)


  React.useEffect(() => {
    getNotReadNotifications()
  }, [])

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("https://kebek.kz/")
  }


  React.useEffect(() => {
    !selectCity && localStorage.setItem("selectCity", "Нур-Султан");
    setSelectCity(localStorage.getItem("selectCity"));
  }, [selectCity]);
  const [yourCityConfirm, setYourCityConfirm] = React.useState(false);

  return (
    <div className={classNames(classes.header__items__location, className)}>
      {/* <Modal
        open={open}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseIcon
            onClick={handleClose2}
            fontSize="large"
            style={{
              position: "absolute",
              top: "33",
              right: "40",
              cursor: "pointer",
            }}
          />
          <div className={"text-center"}>
            {locale === "ru" ? <h2>Вы действительно <br /> хотите выйти?</h2> : <h2>Сіз шынымен <br /> шыққыңыз келе ме?</h2>}
          </div>
          <div className={cl.modal}>
            <a
              onClick={() => logOut()}
              className={cl.exit}
            >
              {locale === "ru" ? "Выйти" : "Шығу"}
            </a>
            <button onClick={handleClose2} className={cl.cancel}>
              {locale === "ru" ? "Отмена" : "Болдырмау"}
            </button>
          </div>
        </Box>
      </Modal> */}
      <div className={classes.tooltip}>
        <div style={{ cursor: "pointer" }} onClick={() => setYourCityConfirm(!yourCityConfirm)}>
          <Avatar src={!!data?.image ? data.image : ""} alt="Remy Sharp" />
          {!!notificationsUnRead &&
            <StyledBadge badgeContent={notificationsUnRead} />
          }
        </div>
        {yourCityConfirm && (
          <div onClick={(e) => handleClose(e)} className={classes.bottom}>
            <div onClick={() => setYourCityConfirm(false)} style={{ position: "absolute", right: 5, top: 8, cursor: "pointer" }}>
              <CloseIcon />
            </div>
            <div className={classNames("d-flex flex-column mt-2 align-items-start", classes.inner_bottom)}>
              <div className={classNames("d-flex")}>
                <Avatar style={{ width: 28, height: 28 }} src={!!data?.image ? data.image : ""} alt="Remy Sharp" />
                <div className={classNames(classes.tooltipBottom, "d-flex flex-column align-items-start")}>
                  <p style={{ fontSize: 15.5, marginLeft: 8, marginBottom: 0 }}>{!!data?.firstName ? data.firstName : ""}</p>
                  <p style={{ color: 'gray', fontSize: 14, marginLeft: 8 }}>{!!data?.username ? data.username : ""}</p>
                </div>
              </div>
              <div className={"d-flex flex-column mt-2 align-items-start"}>
                <Link onClick={() => setYourCityConfirm(false)} to={`/profile`}>
                  <div className={"mt-2"} style={{ fontSize: 18, color: '#092F33' }}>
                    <Typography color="#092F33" sx={{ fontSize: 18, cursor: "pointer" }}>{locale === "ru" ? "Профиль" : "Профиль"}</Typography>
                  </div>
                </Link>
                <Link onClick={() => setYourCityConfirm(false)} to={`/notifications`}>
                  <div className={"d-flex align-items-center mt-3"} style={{ fontSize: 18, color: '#092F33' }}>
                    <Typography color="#092F33" sx={{ fontSize: 18, cursor: "pointer" }}>{locale === "ru" ? "Уведомления" : "Хабарландырулар"}</Typography>
                    {!!notificationsUnRead &&
                      <StyledBadge style={{ marginLeft: 18, marginTop: 15 }} badgeContent={notificationsUnRead} />
                    }
                  </div>
                </Link>
              </div>
              <hr style={{ opacity: 0.25 }} className={"w-100"} />
              <Button
                onClick={logOut}
                className={"d-flex justify-content-start m-0 p-0"}
                sx={{ width: '100%', fontSize: 18, textAlign: "center", textTransform: "none" }} color="success">
                {locale === "ru" ? "Выйти" : "Шығу"}
              </Button>
            </div>
            <i />
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUser;
