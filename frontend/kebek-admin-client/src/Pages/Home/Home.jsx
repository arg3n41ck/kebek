import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import classes from "./Home.module.scss";
import {
  Button,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  useMediaQuery,
  Modal,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import success from "../../static/icons/success.svg";
import HomeAccordion from "../../components/HomeAccordions/HomeAccordion";
import HomeNotification from "../../components/HomeNotifications/HomeNotification";
import { applications } from "../Application/Appliaction";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { toast } from "react-toastify";
import { userContext } from "../../providers/UserProvider";
import { ordersContext } from "../../providers/OrdersProvider";
import { Paper } from "@mui/material";
import useQuery from "../../hooks/useQuery";
import { $api } from "../../services/api";
import { notificationsContext } from "../../providers/NotificationsProvider";
import { Link } from "react-router-dom";
import SuccessModal from "../../components/Modals/Success";
import AddTrustee from "../../components/Modals/AddTrustee";
import Canceled from "../../components/Modals/Canceled";
import Completed from "../../components/Modals/Completed";
import Invoiced from "../../components/Modals/Invoiced";
import NotPaid from "../../components/Modals/NotPaid";
import Paid from "../../components/Modals/Paid";
import Success from "../../components/Modals/Success";
import Treatment from "../../components/Modals/Treatment";
import { format, parseISO } from "date-fns";
import { localeContext } from "../../providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import QrCode from "../../components/QrCode/QrCode";

function Home() {
  const isMobile = useMediaQuery("(max-width: 578px)");
  const [searchValue, setSearchValue] = useState("");
  const query = useQuery();
  const { t, locale } = React.useContext(localeContext);
  const navigate = useNavigate();
  // const confidant = applications.map(({ confidant }) => confidant);
  // React.useEffect(() => {
  //   confidant.map((item) => {
  //     item === false &&
  //       toast.warning(<SuccessModal />, {
  //         autoClose: false,
  //         closeOnClick: false
  //       });
  //   });
  // }, [confidant]);

  const { user, getUser } = useContext(userContext);
  const { orders, getOrders, getAllOrders, allOrders } =
    useContext(ordersContext);
  const { markAsRead } = useContext(notificationsContext);
  const [notifications, setNotifications] = useState(null);

  

  useEffect(() => {
    getUser();
    $api
      .get("/notifications/grouped/")
      .then((res) => setNotifications(res.data));
  }, []);

  useEffect(() => {
    getAllOrders(searchValue);
    getOrders(searchValue);
  }, [searchValue]);

  const handleClick = (id) => {
    navigate(`/info-about-application/${id}`);
  };
  

  const markReadHandler = () => {
    const ids = [];
    if (notifications) {
      const newNotifications = notifications.results.map((item) => {
        const newArr = item.notifications.map((i) => {
          if (!i.read) {
            ids.push(i.id);
            return { ...i, read: true };
          }
          return i;
        });
        return { createdAt: item.createdAt, notifications: newArr };
      });
      setNotifications((prev) => ({ ...prev, results: newNotifications }));
      markAsRead(ids);
    }
  };

  const getDay = (date) => {
    const currentDay = format(new Date(), "yyyy-MM-dd"),
      yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (currentDay === date) {
      return "Сегодня";
    } else if (date === format(yesterday, "yyyy-MM-dd")) {
      return "Вчера";
    }
    return format(parseISO(`${date}`), "dd-MM-yyyy");
  };

  const unreadCount = () => {
    if (notifications?.results) {
      let allNotifications = [];
      notifications.results.forEach((item) =>
        item.notifications.forEach((item) => {
          if (!item.read) {
            allNotifications.push(item);
          }
        })
      );
      return allNotifications.length;
    }
  };

  return (
    <div className={classes.Home_container}>
      <h1 className={classes.headingTitle}>{t.home.navText}</h1>
      <div className={classes.Home_container__items}>
        <Paper
          className={!searchValue && "d-none"}
          style={{
            borderRadius: 3,
            position: "absolute",
            width: "100%",
            zIndex: 1,
            marginTop: 3,
          }}
        >
          {searchValue.length && !!allOrders?.length
            ? allOrders.map((item) => (
              <div
                onClick={() => handleClick(item.id)}
                className={classes.searchResult}
                key={item.id}
              >
                <Typography sx={{ fontSize: 16 }}>
                  {locale
                    ? item.product.type.titleRu
                    : item.product.type.titleKk}
                </Typography>
                <Typography sx={{ fontSize: 16, marginLeft: 1 }}>
                  {item.id}
                </Typography>
              </div>
            ))
            : null}
        </Paper>
        <div className={classNames(classes.userInfo, "row")}>
          <div className={classNames(classes.userInfo__items, "col-xl-8 mt-2")}>
            <div
            >
              <Typography
                className={classes.personalInformationText}
                style={{ marginTop: 10 }}
                sx={{ fontSize: 25, color: "black" }}
              >
                {t.home.navText_info.title}
              </Typography>
              <div className={"d-sm-none d-block"}>
                <Link to={"/profile"}>
                  <Button
                    sx={{
                      fontSize: 18,
                      textTransform: "none",
                      padding: 0,
                      fontWeight: 600,
                      color: "#219653",
                      marginTop: 1,
                    }}
                  >
                    {t.home.navText_info.title}
                  </Button>
                </Link>
              </div>
              <div
                style={{ padding: "20px 10px" }}
                className={classNames(
                  classes.userInfo_info_items,
                  "d-flex mt-4"
                )}
              >
                <div className={"d-flex"}>
                  <div style={{ marginRight: 30 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={!!user?.image ? user.image : ""}
                      sx={
                        !isMobile
                          ? { width: 105, height: 105 }
                          : { width: 55, height: 55 }
                      }
                    />
                  </div>
                  <div
                    className={
                      "d-flex justify-content-between align-items-center d-sm-none d-flex"
                    }
                  >
                    <div className={"d-flex flex-column"}>
                      <Typography sx={{ fontSize: 18.3, fontWeight: 600 }}>
                        {!!user?.firstName ? user.firstName : ""}
                      </Typography>
                      <Typography sx={{ fontSize: 18, color: "#219653" }}>
                        Физ.лицо
                      </Typography>
                    </div>
                    <div className={"d-sm-block d-none"}>
                      <Link to={"/profile"}>
                        <Button
                          sx={{
                            fontSize: 18,
                            textTransform: "none",
                            padding: 0,
                            fontWeight: 600,
                            color: "#219653",
                          }}
                        >
                          {t.home.navText_info.title}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={"d-flex w-100 flex-column"}>
                  <div
                    className={
                      "d-flex justify-content-between align-items-center d-sm-flex d-none"
                    }
                  >
                    <Typography sx={{ fontSize: 25, fontWeight: 600 }}>
                      {!!user?.firstName ? user.firstName : ""}
                    </Typography>
                    <div className={"d-sm-block d-none"}>
                      <Link to={"/profile"}>
                        <Button
                          sx={{
                            fontSize: 18,
                            textTransform: "none",
                            padding: 0,
                            fontWeight: 600,
                            color: "#219653",
                            marginRight: 1,
                          }}
                        >
                          {t.home.navText_info.button}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className={classNames("d-flex", classes.infoUser)}>
                    <div
                      className={"d-sm-block d-none"}
                      style={{ width: "100%", marginTop: 20 }}
                    >
                      <p style={{ padding: 0, margin: 0 }}>Логин</p>
                      <Typography>
                        {!!user?.username ? user.username : ""}
                      </Typography>
                    </div>
                    <div style={{ width: "100%", marginTop: 20 }}>
                      <p style={{ padding: 0, margin: 0 }}>Телефон</p>
                      <Typography>
                        {!!user?.phoneNumber ? user.phoneNumber : ""}
                      </Typography>
                    </div>

                    <div
                      style={{ width: "100%", marginTop: 20, marginRight: 20 }}
                    >
                      <p style={{ padding: 0, margin: 0 }}>
                        {t.home.navText_info.email}
                      </p>
                      <Typography>{!!user?.email ? user.email : ""}</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*//? Accordion */}

            <div className={"mt-4"}>
              <div
                className={classNames(
                  classes.applicationButton,
                  "d-flex justify-content-between align-items-center"
                )}
              >
                <Typography sx={{ fontSize: 25 }}>
                  {t.home.applications.title}
                </Typography>
                <div>
                  <Link to="/application">
                    <Button
                      sx={{
                        fontSize: 18,
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#219653",
                        padding: 0,
                        marginTop: 1,
                      }}
                    >
                      {t.home.applications.title2}
                    </Button>
                  </Link>
                </div>
              </div>
              {!!orders?.results
                ? orders.results.map((item) => {
                  return <HomeAccordion key={item.id} data={item} />;
                })
                : null}
            </div>
          </div>

          {/*//? Notification */}

          <div
            className={classNames(
              classes.notifications,
              "col-xl-4 d-xl-block d-none"
            )}
          >
            <div
              className={
                "d-flex justify-content-between align-items-center mt-4 mb-4"
              }
            >
              <div>
                <Typography
                  sx={{ fontSize: 21, color: "black", fontWeight: 600 }}
                >
                  {t.home.notifications.title1}{" "}
                </Typography>
              </div>
              <Link to={"/notifications"}>
                <Button
                  sx={{ fontSize: 18, fontWeight: 600, textTransform: "none" }}
                  color="success"
                  style={{ margin: 0, padding: 0 }}
                >
                  {t.home.notifications.title2}
                </Button>
              </Link>
            </div>

            <div className={"mt-2"}>
              <Card className={classes.card} sx={{ minWidth: 275 }}>
                <div className={classes.cardItems_info}>
                  {!!notifications?.results.length &&
                    notifications.results.map((item) => {
                      return (
                        <div key={item.id}>
                          <CardContent>
                            <Typography
                              className={"mt-1"}
                              sx={{ color: "#BDBDBD", fontSize: 20 }}
                              color="text.secondary"
                            >
                              {getDay(item?.createdAt)}
                            </Typography>
                          </CardContent>
                          <hr style={{ margin: 0 }} />
                          {item?.notifications.map((itemNot) => (
                            <HomeNotification
                              key={itemNot.id}
                              data={itemNot}
                              date={item?.createdAt}
                            />
                          ))}
                        </div>
                      );
                    })}
                </div>

                <CardActions
                  style={{
                    boxShadow: "0px -34px 31px rgba(250, 250, 250, 0.87)",
                    background: "#FFFFFF",
                  }}
                >
                  <Button
                    style={{ textTransform: "none" }}
                    className={"text-center w-100"}
                    variant="success"
                    sx={{ color: "#219653", fontWeight: 600, fontSize: 16 }}
                    onClick={markReadHandler}
                  >
                    {t.home.notifications.button}
                  </Button>
                </CardActions>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
