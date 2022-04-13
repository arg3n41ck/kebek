import classNames from "classnames";
import React, { useContext, useEffect, useRef, useState } from "react";
import cl from "../Notification/Notification.module.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import ApplicationItem from "./ApplicationItem";
import Pagination from "../../components/Pagination/Pagination";
import PaginationApplication from "../../components/Pagination/Pagination";
import {
  Box,
  Button,
  createTheme,
  Typography,
  useMediaQuery,
  ThemeProvider,
  TextField,
  Paper,
} from "@mui/material";
import Footer from "../../components/Footer/Footer";
import classes from "./Application.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { statusList } from "../../components/Status/constants";
import { ordersContext } from "../../providers/OrdersProvider";
import styled from "styled-components";
import * as ReactDOM from "react-dom";
import copy from "copy-to-clipboard";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import pr from "../Profile/Profile.module.scss";
import Modal from "@mui/material/Modal";
import { style } from "../../components/MainDrawerAdmin/MainDrawerAdmin";
import { $api } from "../../services/api";
import TrustedPersonIcon from "../../static/icons/trustedPerson.svg";
import { format, parseISO } from "date-fns";
import { DatePicker, LocalizationProvider, MobileDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { ReactComponent as CalendarIcon } from "../../static/icons/calendar.svg";
import { localeContext } from "../../providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../providers/UserProvider"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  classes: {
    paper: pr.dropdownStyle,
  },
};

function Appliaction() {
  const { orders, getOrders, getAllOrders, allOrders, deleteProxy } =
    useContext(ordersContext);
  const { getUser } =
    useContext(userContext);
  const [application, setApplication] = useState([]),
    [statusFilterCurrent, setStatusFilterCurrent] = useState(""),
    [search, setSearch] = useState(""),
    [currentPage, setCurrentPage] = useState(1),
    [pageSize, setPageSize] = useState(3),
    pageListRef = useRef([3, 5, 10, 20]),
    [openModal, setOpenModal] = useState(false),
    [currentOrder, setCurrentOrder] = useState(null),
    [statusModal, setStatusModal] = useState("new"), // new || change
    [selectStatus, setSelectStatus] = useState("Все"),
    [deleteProxyModal, setDeleteProxyModal] = useState(false),
    [deleteProxyId, setDeleteProxyId] = useState();


  useEffect(() => {
    getUser()
  }, [])

  const isMedium = useMediaQuery("(max-width: 992px)");
  const { t, locale } = useContext(localeContext);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/info-about-application/${id}`);
  };

  const handleOpenModal = (setAnchorEl) => {
    setDeleteProxyModal(true)
    setAnchorEl(null)
  }
  const handleCloseModal = () => setDeleteProxyModal(false)

  const statusModalHandler = (type) => {
    setStatusModal(type);
  };

  const currentOrderHandler = (order) => {
    setCurrentOrder(order);
  };
  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  const changePageHandler = (page) => {
    setCurrentPage(page);
  };

  const modalHandler = (setAnchorEl) => {
    setOpenModal((prev) => !prev);
    setAnchorEl(null)
  };

  const shareLink = (url) => {
    copy(url);
  };

  const changeApplication = (newObj) => {
    const indexObj = application.findIndex((item) => item.id === newObj.id),
      newArrStart = application.slice(0, indexObj),
      newArrEnd = application.slice(indexObj + 1);
    setApplication([...newArrStart, newObj, ...newArrEnd]);
  };

  useEffect(() => {
    setApplication(orders?.results);
  }, [orders]);

  useEffect(() => {
    getAllOrders(search);
    getOrders(search, statusFilterCurrent, currentPage, pageSize);
  }, [search, statusFilterCurrent, currentPage, pageSize]);

  const handleDeleteProxyModal = (data) => {
    setDeleteProxyId(data)
  }

  if (!application && application?.length !== 0) return null;

  return (
    <>

      {openModal && (
        <ModalCm
          onModal={modalHandler}
          clearCurrentOrder={clearCurrentOrder}
          openModal={openModal}
          currentOrder={currentOrder}
          onChangeApplication={changeApplication}
          statusModal={statusModal}
        />
      )}

      {deleteProxyModal && (
        <DeleteProxyModal
          setDeleteProxyModal={setDeleteProxyModal}
          deleteProxyModal={deleteProxyModal}
          t={t}
          deleteProxy={deleteProxy}
          getOrders={getOrders}
          deleteProxyId={deleteProxyId}
        />
      )}

      <div className={classes.application_home_container}>
        <div
          className={classNames(cl.container, "m-0")}
          style={{ minHeight: "72.5vh" }}
        >
          <h1 className={cl.h1}>{t.applications.nav}</h1>
          <div className={classNames(cl.select)}>
            <div className={classNames(cl.searchInp)}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder={t.applications.inputPlaceholder}
              />
              <Paper
                className={classNames(!search && "d-none", classes.liveSearch)}
              >
                {search.length && !!allOrders
                  ? allOrders.map((item) => {
                    return <div
                      onClick={() => handleClick(item.id)}
                      className={classes.searchResult}
                      key={item.id}
                    >
                      <Typography sx={{ fontSize: 16 }}>
                        {!!item?.products?.length && item.products.map((item) => (
                          `${locale === "ru" ? item.product.type.titleRu : item.product.type.titleKk}, `
                        ))}
                      </Typography>
                      <Typography sx={{ fontSize: 16, marginLeft: 1 }}>
                        {item.number}
                      </Typography>
                    </div>

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
                {t.applications.selectPlaceholder}
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
                    {/* <Checkbox
                      checked={statusFilterCurrent === item.encryptedName}
                    /> */}
                    <ListItemText
                      sx={{ margin: 0 }}
                      primary={item.pluralName}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {!!application &&
            application.map((item) => {
              return (
                <>
                  <ApplicationItem
                    key={item.id}
                    onShare={shareLink}
                    data={item}
                    onModal={modalHandler}
                    onCurrentOrder={currentOrderHandler}
                    onStatusModal={statusModalHandler}
                    handleCloseModal={handleCloseModal}
                    handleOpenModal={handleOpenModal}
                    handleDeleteProxyModal={handleDeleteProxyModal}
                  />
                </>
              );
            })}

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
              <Typography sx={{ fontSize: 18 }}>{pageSize} из {orders?.count}</Typography>
            </div>

            <PaginationApplication
              count={orders?.pageCount}
              page={currentPage}
              changePageHandler={changePageHandler}
            />
          </div>
        </div>
      </div >
    </>
  );
}

export default Appliaction;

const DeleteProxyModal = ({ setDeleteProxyModal, deleteProxyModal, t, deleteProxyId, deleteProxy, getOrders }) => {

  const handleProxyDelete = ({ id }) => {
    deleteProxy(id).then(() => {
      getOrders()
      setDeleteProxyModal(false)
    })
  }

  return (
    <Modal
      open={deleteProxyModal}
      onClose={() => setDeleteProxyModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <CloseIcon
          onClick={() => setDeleteProxyModal(false)}
          fontSize="large"
          style={{
            position: "absolute",
            top: "33",
            right: "40",
            cursor: "pointer",
          }}
        />
        <Typography
          id="modal-modal-title"
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
          {t.profile.requisites.modal2.deleteModal.title11}
        </Typography>
        <div className={classNames(pr.modal, pr.modal_inner)}>
          <p>{t.profile.requisites.modal2.deleteModal.title22} </p>
          <p>{t.profile.requisites.modal2.deleteModal.title3}</p>
          <button
            onClick={() => handleProxyDelete(deleteProxyId)}>
            {t.profile.requisites.modal2.deleteModal.button}
          </button>
        </div>
      </Box>
    </Modal>
  )
}

const ModalCm = ({
  onModal,
  openModal,
  clearCurrentOrder,
  currentOrder,
  onChangeApplication,
  statusModal,
}) => {
  const [modalValues, setModalValues] = useState(currentOrder);
  const [page, setPage] = useState(1);
  const { t } = useContext(localeContext);

  const inputHandler = (e) => {
    setModalValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const postOrUpdate = () => {
    if (
      modalValues?.proxyFullname &&
      modalValues?.proxyNumber &&
      modalValues?.proxyStartDate &&
      modalValues?.proxyEndDate
    ) {
      $api.patch(`/orders/${modalValues.id}/proxy/`, {
        proxy_fullname: modalValues.proxyFullname,
        proxy_number: +modalValues.proxyNumber,
        proxy_start_date: modalValues.proxyStartDate,
        proxy_end_date: modalValues.proxyEndDate,
      });
      onChangeApplication(modalValues);
      // setPage((prev) => ++prev);
      onModal();
    }
  };

  useEffect(() => {
    setModalValues(currentOrder);
    return () => {
      clearCurrentOrder();
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (page === 2) {
      interval = setInterval(() => {
        if (page === 2) {
          onModal();
        }
      }, 2000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [page]);

  return (
    <Modal
      open={openModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className={`${classes.modal}`}
    >
      <Box sx={style}>
        {/*{page === 1 ? (*/}
        {/*  <>*/}
        <CloseIcon
          onClick={onModal}
          fontSize="large"
          style={{
            position: "absolute",
            top: "33",
            right: "40",
            cursor: "pointer",
          }}
        />
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{
            fontSize: "31px",
            lineHeight: "140%",
            marginBottom: "20px",
          }}
          className={pr.modal_box}
        >
          {statusModal === "new" ? "Добавить" : "Изменить"} доверенное лицо
        </Typography>
        <div style={{ width: "100%" }}>
          <ModalInput
            type="text"
            defaultValue={modalValues?.proxyFullname}
            placeholder="Введите ФИО доверенного лица"
            name={"proxyFullname"}
            onChange={inputHandler}
          />
          <ModalInput
            type="text"
            defaultValue={modalValues?.proxyNumber}
            placeholder="Ввведите номер доверенности"
            name="proxyNumber"
            value={modalValues?.proxyNumber}
            onChange={(e) =>
              setModalValues((prev) => ({
                ...prev,
                proxyNumber: e.target.value.replace(/\D/g, ""),
              }))
            }
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div
              className={"customDatePickerWidth"}
              style={{ marginBottom: 15 }}
            >
              <MobileDatePicker
                className={"customDatePickerWidth"}
                label="Действительно с:"
                value={modalValues?.proxyStartDate}
                name={"proxyStartDate"}
                onChange={(newValue) => {
                  setModalValues((prev) => ({
                    ...prev,
                    proxyStartDate: `${format(newValue, "yyyy-MM-dd")}`,
                  }));
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <CalendarIconS />
            </div>
            <div className={"customDatePickerWidth"}>
              <MobileDatePicker
                className={"customDatePickerWidth"}
                label="Действительно с:"
                value={modalValues?.proxyEndDate}
                name={"proxyStartDate"}
                onChange={(newValue) => {
                  setModalValues((prev) => ({
                    ...prev,
                    proxyEndDate: `${format(newValue, "yyyy-MM-dd")}`,
                  }));
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <CalendarIconS />
            </div>
          </LocalizationProvider>
          <ModalBtn onClick={postOrUpdate}>
            {statusModal === "new" ? "Добавить" : "Изменить"}
          </ModalBtn>
        </div>
        {/*</>*/}
        {/*) : (*/}
        {/*  <ModalInfo>*/}
        {/*    <ModalCloseWrapper onClick={onModal}>*/}
        {/*      <CloseIcon*/}
        {/*        fontSize="large"*/}
        {/*        style={{*/}
        {/*          position: "absolute",*/}
        {/*          top: "33",*/}
        {/*          right: "40",*/}
        {/*          cursor: "pointer",*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    </ModalCloseWrapper>*/}
        {/*    <img src={TrustedPersonIcon} alt="" />*/}
        {/*    <ModalITitle>*/}
        {/*      {statusModal === "new"*/}
        {/*        ? "Добавлено доверенно лицо"*/}
        {/*        : "Доверенное лицо изменено"}*/}
        {/*      !*/}
        {/*    </ModalITitle>*/}
        {/*    <ModalIDescription>*/}
        {/*      Вы успешно {statusModal === "new" ? "добавили" : "изменили"}{" "}*/}
        {/*      доверенное лицо <span>{modalValues.proxyFullname}</span>*/}
        {/*    </ModalIDescription>*/}
        {/*    <ModalIBackBtn onClick={() => setPage((prev) => --prev)}>*/}
        {/*      Назад*/}
        {/*    </ModalIBackBtn>*/}
        {/*  </ModalInfo>*/}
        {/*)}*/}
      </Box>
    </Modal>
  );
};

const ModalText = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  color: #4f4f4f;
  a {
    color: #219653;
    text-decoration: underline;
  }
`;
const ModalInput = styled.input`
  width: 100%;
  height: 55px;
  border: 1px solid #e7e7e7;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 10px 20px;
  margin-bottom: 10px;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  color: black;
`;
const ModalInfo = styled.div`
  background: #fff;
  padding: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    max-width: 84px;
  }
`;
const ModalBtn = styled.button`
  background-color: #219653;
  border: none;
  border-radius: 3px;
  height: 53px;
  width: 100%;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  color: white;
  margin-top: 10px;
`;
const ModalCloseWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  cursor: pointer;
`;
const ModalITitle = styled.h4`
  font-family: Rubik, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 31px;
  line-height: 140%;
  color: #092f33;
  margin: 10px 0 20px 0;
`;
const ModalIDescription = styled.p`
  font-family: Rubik, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 140%;
  color: #092f33;
  span {
    font-weight: 700;
  }
  margin-bottom: 33px;
`;
const ModalIBackBtn = styled.button`
  font-family: Rubik, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 150%;
  color: #219653;
  background: none;
  outline: none;
  border: none;
`;

const CalendarIconS = styled(CalendarIcon)`
  position: absolute;
  top: 14px;
  right: 20px;
  max-width: 30px;
  pointer-events: none;
`;
