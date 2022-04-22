import React, { useEffect, useState } from "react";
import cla from "./Notification.module.scss";
import { Typography, Badge, Checkbox, Button } from "@mui/material";
import Status from "../../components/Status/Status";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import { localeContext } from "../../providers/LocaleProvider";
import { $api } from "../../services/api";
import pr from "../Profile/Profile.module.scss"
import classNames from "classnames"
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { style } from "../../components/MainDrawerAdmin/MainDrawerAdmin";

const NotificationList = ({ notificationList, getNotReadNotifications }) => {
  const [notifications, setNotifications] = useState(null);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const { t, locale } = React.useContext(localeContext);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)


  useEffect(() => {
    if (notifications) {
      const check = notifications.includes((item) => !item.checked);
      if (!checkedAll && !check) {
        setNotifications((prev) =>
          prev.map((item) => ({ ...item, checked: false }))
        );
        setCheckedIds([]);
      } else {
        setNotifications((prev) =>
          prev.map((item) => ({ ...item, checked: true }))
        );
        setCheckedIds(notifications.map((item) => item.id));
      }
    }
  }, [checkedAll]);

  useEffect(() => {
    const newArr = !!notificationList?.length && notificationList.map((item) => ({
      ...item,
      checked: false,
    }));
    setNotifications(newArr);
  }, [notificationList]);

  const handleChangeCheckedAll = () => {
    const check = notifications.includes((item) => !item.checked);
    if (!check) {
      setCheckedAll((prev) => !prev);
    }
  };

  const handleChangeChecked = (id) => {
    const indexObj = notifications.findIndex((item) => item.id === id),
      newArrStart = notifications.slice(0, indexObj),
      newArrEnd = notifications.slice(indexObj + 1),
      newObj = notifications[indexObj];
    newObj.checked = !newObj.checked;
    if (newObj.checked) {
      setCheckedIds((prev) => [...prev, id]);
    } else {
      const index = checkedIds.findIndex((item) => item === id);
      const start = checkedIds.slice(0, index),
        end = checkedIds.slice(index + 1);
      setCheckedIds([...start, ...end]);
    }
    setNotifications([...newArrStart, newObj, ...newArrEnd]);
  };

  const deleteNotification = () => {
    checkedIds.forEach((id) => {
      $api.delete(`/notifications/${id}/`);
    });
    const newArr = notifications.filter(
      (item) => !checkedIds.includes(item.id)
    );
    setNotifications(newArr);
    handleClose()
  };

  const unreadHandler = async () => {
    const newArr = notifications.map((item) => {
      const check = !checkedIds.includes(item.id);
      if (!check) {
        return { ...item, read: true };
      }
      return item;
    });
    setNotifications(newArr);
    await $api.post("/notifications/read/", { ids: checkedIds })
    getNotReadNotifications()
    setNotifications(null)
  };

  if (!notifications) {
    return null;
  }

  return (
    <div className={cla.list} style={{ marginTop: "20px" }}>
      <div className={cla.beginer}>
        <div className={cla.beginer_left}>
          <Checkbox
            checked={checkedAll}
            onChange={handleChangeCheckedAll}
            sx={{
              padding: 0,
              marginRight: 2,
              "& .PrivateSwitchBase-input": {
                height: "22px !important",
              },
            }}
          />
          <Typography sx={{ margin: 0, padding: 0 }}>
            {t.notifications.cardInfo.selectAll}
          </Typography>
        </div>
        <div className={classNames(cla.beginer_right, "d-flex align-items-center")}>
          <Button disabled={!notifications?.length || !checkedIds.length} color="success" onClick={() => handleOpen()}>
            {t.notifications.cardInfo.button1}
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title2"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <CloseIcon
                onClick={handleClose}
                fontSize="large"
                style={{
                  position: "absolute",
                  top: "33",
                  right: "40",
                  cursor: "pointer",
                }}
              />
              <Typography
                id="modal-modal-title2"
                variant="h6"
                component="h2"
                style={{
                  fontSize: "31px",
                  lineHeight: "140%",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
                className={pr.modal_box}
              >
                {/* {t.profile.requisites.modal2.deleteModal.title1} */}
                {locale === "ru" ? "Удаление уведомления" : "Хабарландыруды жою"}
              </Typography>
              <div className={classNames(pr.modal, pr.modal_inner)}>
                <p>{locale === "ru" ? "Вы действительно хотите удалить выбранные уведомления?" : "Таңдалған хабарландыруларды шынымен жойғыңыз келе ме?"} </p>
                <p>{t.profile.requisites.modal2.deleteModal.title3}</p>
                <button
                  onClick={() => {
                    // handleClose9();
                    // handleClose5();
                    deleteNotification();
                  }}
                >
                  {t.profile.requisites.modal2.deleteModal.button}
                </button>
              </div>
            </Box>
          </Modal>
          <Button disabled={!notifications?.length || !checkedIds.length} color="success">
            <p onClick={unreadHandler}>{t.notifications.cardInfo.button2}</p>
          </Button>
        </div>
      </div>
      {notifications.map((item) => (
        <div key={item.id} className={cla.inner}>
          <Checkbox
            checked={item.checked}
            onChange={() => handleChangeChecked(item.id)}
            sx={{
              padding: 0,
              marginRight: 2,
              "& .PrivateSwitchBase-input": {
                height: "22px !important",
              },
            }}
          />
          <div>
            <div className={cla.inner_div}>
              {!item.read && (
                <Badge variant="dot" className={cla.dot} color="error" />
              )}
              <h3>
                {console.log(item)}
                {item.title}
              </h3>
            </div>
            <p>{item.content}</p>
            <div>
              <StatusWrapper
                className={"d-flex align-items-center justify-content-center"}
              >
                <Status statusName={item.orderStatus} />
              </StatusWrapper>
              <div className={cla.date}>
                {format(parseISO(`${item.createdAt}`), "dd.MM.yyyy", {
                  locale: ruLocale,
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StatusWrapper = styled.div`
  div {
    flex-grow: 1;
    min-width: 120px;
    height: 30px;
    font-size: 20px;
    font-weight: 400;
    margin-top: 0;
  }
`;

export default NotificationList;
