import React, { useContext, useState } from "react";
import classNames from "classnames";
import classes from "./Locale.module.scss";
// import locationIcon from "../../static/icons/IconLocation.svg";
// import ChangedCities from "../ChangedCitiesModal/ChangedCities";
import { Avatar, Typography, Button } from "@mui/material";
import { StyledBadge } from "../Badge/Badge";
import { notificationsContext } from "../../providers/NotificationsProvider";
import { Link } from "react-router-dom"
import CloseIcon from '@mui/icons-material/Close';


const AvatarUser = ({ className = "", data, handleClose }) => {
  const [selectCity, setSelectCity] = useState(
    window.localStorage.getItem("selectCity")
  );
  const { getNotReadNotifications, notificationsUnRead } = useContext(notificationsContext);

  React.useEffect(() => {
    getNotReadNotifications()
  }, [])


  React.useEffect(() => {
    !selectCity && localStorage.setItem("selectCity", "Нур-Султан");
    setSelectCity(localStorage.getItem("selectCity"));
  }, [selectCity]);
  const [open, setOpen] = React.useState(false);
  const [yourCityConfirm, setYourCityConfirm] = React.useState(false);

  return (
    <div className={classNames(classes.header__items__location, className)}>
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
                    <Typography color="#092F33" sx={{ fontSize: 18, cursor: "pointer" }}>Профиль</Typography>
                  </div>
                </Link>
                <Link onClick={() => setYourCityConfirm(false)} to={`/notifications`}>
                  <div className={"d-flex align-items-center mt-3"} style={{ fontSize: 18, color: '#092F33' }}>
                    <Typography color="#092F33" sx={{ fontSize: 18, cursor: "pointer" }}>Уведомления</Typography>
                    {!!notificationsUnRead &&
                      <StyledBadge style={{ marginLeft: 18, marginTop: 15 }} badgeContent={notificationsUnRead} />
                    }
                  </div>
                </Link>
              </div>
              <hr style={{ opacity: 0.25 }} className={"w-100"} />
              <Button style={{}} className={"d-flex justify-content-start m-0 p-0"}
                sx={{ width: '100%', fontSize: 18, textAlign: "center", textTransform: "none" }} color="success">
                Выйти
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
