import classNames from "classnames";
import React, { useState, useRef, useContext, useEffect } from "react";
import cl from "./Notification.module.scss";
import Select from "@mui/material/Select";
import NotificationList from "./NotificationList";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import { useParams } from "react-router-dom";
import { $api } from "../../services/api";
import { statusList } from "../../components/Status/constants";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { localeContext } from "../../providers/LocaleProvider";
import { Paper, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import pr from "../Profile/Profile.module.scss";
import { userContext } from "../../providers/UserProvider"
import PaginationNotification from "../../components/Pagination/Pagination"
import { notificationsContext } from "../../providers/NotificationsProvider";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 350,
      marginLeft: 0,
    },
  },
  classes: {
    paper: pr.dropdownStyle,
  },
};

function Notification() {
  const [notification, setNotification] = useState([]),
    [statusFilterCurrent, setStatusFilterCurrent] = useState(""),
    [search, setSearch] = useState(""),
    [selectStatus, setSelectStatus] = useState("Все"),
    [pageSize, setPageSize] = useState(5),
    [isRead, setIsRead] = useState(false),
    pageListRef = useRef([3, 5, 10, 20]),
    [currentPage, setCurrentPage] = useState(1);

  const isMedium = useMediaQuery("(max-width: 992px)");

  const { getNotReadNotifications, getAllNotifications, allNotifications } = useContext(notificationsContext);


  const { t } = useContext(localeContext);
  const { getUser } = useContext(userContext);
  const navigate = useNavigate();

  const [personName, setPersonName] = useState([]);
  const { user_role, token } = useParams();

  const handleClick = (id) => {
    navigate(`info-about-application/${id}`);
  };

  const changePageHandler = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getUser()
  }, [])

  useEffect(async () => {
    getAllNotifications(search)
    const res = await $api.get("/notifications/", {
      params: {
        search,
        order__status: statusFilterCurrent,
        page: currentPage,
        page_size: pageSize
      },
    });
    setNotification(res.data);
  }, [statusFilterCurrent, search, currentPage, pageSize]);

  const handleChange = (event) => { };

  if (notification.length === 0) {
    return null;
  }
  return (
    <div className={classNames(cl.container)}>
      <h1 className={cl.h1}>{t.notifications.nav}</h1>
      <div className={classNames(cl.select)}>
        <div className={cl.searchInp}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder={t.applications.inputPlaceholder}
          />
          <Paper className={classNames(!search && "d-none", cl.liveSearch)}>
            {search.length && !!allNotifications?.length
              ? allNotifications.map((item) => {
                return (
                  <div
                    onClick={() => handleClick(item.id)}
                    className={cl.searchResult}
                    key={item.id}
                  >
                    <Typography sx={{ fontSize: 16 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: 16, marginLeft: 1 }}>
                      {item.id}
                    </Typography>
                  </div>
                );
              })
              : null}
          </Paper>
        </div>
        <FormControl
          className={cl.sel}
          sx={{ width: "50%" }}
          style={{ backgroundColor: "white" }}
        >
          <InputLabel
            id="demo-multiple-checkbox-label"
            style={{ color: "grey" }}
          >
            {t.notifications.selectPlaceholder}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectStatus}
            onChange={(e) => setSelectStatus(e.target.value)}
            input={<OutlinedInput label="Выберитеs" />}
            MenuProps={MenuProps}
            className={`${cl.selectInp}, ${cl.selectOtherArrow}`}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              height: 54,
            }}
          >
            <MenuItem
              onClick={() => setStatusFilterCurrent("")}
              className={cl.all}
              value={"Все"}
              style={{ padding: "0 15px" }}
            >
              {/* <Checkbox checked={statusFilterCurrent === ""} /> */}
              <label>Все</label>
            </MenuItem>
            {statusList.map((item) => (
              <MenuItem
                key={item.pluralName}
                value={item.pluralName}
                className={classNames(cl.select1)}
                onClick={() => setStatusFilterCurrent(item.encryptedName)}
                sx={{
                  padding: "10px 0",
                  "& .MuiListItemText-root": { padding: "0 15px" },
                }}
              >
                <ListItemText sx={{ margin: 0 }} primary={item.pluralName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <NotificationList notificationList={notification.results} getNotReadNotifications={getNotReadNotifications} />
      <div
        className={
          isMedium
            ? "d-flex flex-column align-items-center mt-5"
            : "d-flex justify-content-between mt-5 align-items-center"
        }
      >
        <div
          style={
            isMedium
              ? { width: "100%", marginBottom: 40 }
              : { maxWidth: 281, width: "100%" }
          }
          className={""}
        >
          <FormControl
            sx={{ width: "100%" }}
            style={{ backgroundColor: "white" }}
          >
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(+e.target.value)}
              className={cl.selectInp}
              IconComponent={KeyboardArrowDownIcon}
              MenuProps={MenuProps}
            // MenuProps={{ classes: { paper: pr.dropdownStyle } }}
            >
              {pageListRef.current.map((pageS) => (
                <MenuItem value={pageS}>
                  {t.applications.selectPlaceholder2}: {pageS}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div>
          <Typography sx={{ fontSize: 18 }}>{pageSize <= notification?.count ? pageSize : notification?.count} из {notification?.count}</Typography>
        </div>

        <PaginationNotification
          count={Math.ceil(notification?.count / pageSize)}
          page={currentPage}
          changePageHandler={changePageHandler}
        />
      </div>
    </div >
  );
}

export default Notification;
