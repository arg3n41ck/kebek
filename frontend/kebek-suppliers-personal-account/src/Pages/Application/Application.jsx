import React from "react";
import classes from "./Application.module.scss";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import exportIcon from "../../assets/icons/export_button.svg";
import Menu from "@mui/material/Menu";
import {
  MenuItem,
  useMediaQuery,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import SelectFirst from "./SelectFirst/SelectFirst";
import SelectThird from "./SelectThird/SelectThird";
import SelectSecond from "./SelectSecond/SelectSecond";
import SelectTypeDelivery from "./SelectTypeDelivery/SelectTypeDelivery";
import ApplicationTable from "./ApplicationTable";
import { deliveryContext } from "../../providers/DeliveriesProvider";
import { localeContext } from "../../providers/LocaleProvider";
import { applicationContext } from "../../providers/ApplicationProvider";
import PaymentTypeSelect from "./SelectTypePayment/SelectTypePayment";
import ChooseClientSelect from "./SelectChooseClient/SelectChooseClient";
import { goodsContext } from "../../providers/GoodsProvider";
import { paymentContext } from "../../providers/PaymentProvider";
import { userContext } from "../../providers/UserProvider";
import { statusList } from "../../components/Status/constants";
import PaginationApplication from "../../components/Pagination/Pagination";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import cl from "../Notification/Notification.module.scss";
import pr from "../Profile/Profile.module.scss";
import useDebounce from "../../components/CustomHook/useDebounce";
import Loader from "../../components/Loader/Loader";
import { $api } from '../../services/api';

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


function Application() {
  function createData(id, name, address, phone) {
    return {
      id,
      name,
      address,
      phone,
    };
  }

  const [suplier, setSuplier] = React.useState("");
  const [status, setStatus] = React.useState("");
  const isMedium = useMediaQuery("(max-width: 992px)");

  const [elevatorFilter, setElevatorFilter] = React.useState("");
  const [productTypeFilter, setProductTypeFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [search, setSearch] = React.useState("");
  const value = useDebounce(search, 500);
  const [deliveryTypeFilter, setDeliveryTypeFilter] = React.useState("");
  const [paymentTypeFilter, setPaymentTypeFilter] = React.useState("");
  const [client, setClientFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(5);
  const pageListRef = React.useRef([3, 5, 7]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const { delivery, getDelivery, getDeliveryTypes, deliveryType } =
    React.useContext(deliveryContext);
  const { getElevators, getProductTypes, productTypes, elevators } =
    React.useContext(goodsContext);
  const { paymentType, getPaymentTypes } = React.useContext(paymentContext);
  const { getClients, clients } = React.useContext(userContext);
  const { locale, t } = React.useContext(localeContext);
  const [selectOrders, setSelectOrders] = React.useState(null);
  const { getApplications, applications, count, deleteOrderById } =
    React.useContext(applicationContext);
  const headCells = [
    {
      id: "orderNumber",
      numeric: false,
      disablePadding: false,
      label: t.applications.nav.applications,
    },
    {
      id: "customer",
      numeric: false,
      disablePadding: false,
      label: t.applications.nav.client,
    },
    {
      id: "supplier",
      numeric: false,
      disablePadding: false,
      label: t.applications.nav.supplier,
    },
    {
      id: "goods",
      numeric: false,
      disablePadding: false,
      label: t.applications.nav.products,
    },
    {
      id: "deliveryType",
      numeric: false,
      disablePadding: false,
      label: t.applications.nav.typeDelivery,
    },
    {
      id: "price",
      numeric: false,
      disablePadding: false,
      label: t.applications.nav.price,
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: t.applications.nav.status,
    },
  ];


  React.useEffect(() => {
    getClients();
    getElevators();
    getProductTypes();
    getDeliveryTypes();
    getPaymentTypes();
  }, []);

  React.useEffect(() => {
    getApplications(
      elevatorFilter,
      productTypeFilter,
      statusFilter,
      deliveryTypeFilter,
      paymentTypeFilter,
      client,
      value,
      currentPage,
      pageSize
    );
  }, [
    elevatorFilter,
    productTypeFilter,
    statusFilter,
    deliveryTypeFilter,
    paymentTypeFilter,
    client,
    value,
    currentPage,
    pageSize,
  ]);

  const handleEditRow = (event) => {
    setAnchorEdit(event.currentTarget);
  };

  const changePageHandler = (page) => {
    setCurrentPage(page);
  };

  const handleSelectedOrders = React.useCallback(
    (selectedId) => {
      const res = [];
      !!applications &&
        applications.map((item) => {
          return selectedId.forEach((selectId) => {
            console.log(item)
            return (
              item.id === selectId &&
              res.push({
                client: !!item.client.id && item.client.id,
                delivery: !!item.delivery.id && item.delivery.id,
                elevator: !!item.elevator.id && item.elevator.id,
                payment: !!item.payment.id && item.payment.id,
                status: !!item.status && item.status,
                title: !!item.number && item.number
              })
            );
          });
        });


      return setSelectOrders(res);
    },
    [applications, locale]
  );


  const handleDownloadOrder = async (report_type) => {
    await !!selectOrders?.length && selectOrders.map(async (item) => {
      const { data } = await $api.get(`/orders/report/`, {
        params: {
          client: item.client,
          delivery: item.delivery,
          elevator: item.elevator,
          payment: item.payment,
          status: item.status,
          report_type
        },
        responseType: "blob"
      })

      downloadAsFile(data, report_type, item.title)
    })
    handleCloseRow()
  }

  function downloadAsFile(data, report_type, title) {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(data);
    a.download = `${title}.${report_type}`;
    a.click();
  }

  const elevatorsDeliveyType = React.useMemo(() => {
    const res = [];
    !!elevators &&
      elevators.forEach((item) => {
        return (
          !!item?.deliveries?.length &&
          item.deliveries.forEach((delivery) => {
            return res.push(delivery);
          })
        );
      });
    return res;
  }, [elevators]);

  const elevatorsPaymentType = React.useMemo(() => {

    const res = [];
    !!elevators &&
      elevators.forEach((item) => {
        return (
          !!item?.payments?.length &&
          item.payments.forEach((payment) => {
            return res.push(payment);
          })
        );
      });
    return res;
  }, [elevators]);

  const buttonRef = React.useRef(null);

  const [anchorEdit, setAnchorEdit] = React.useState(false);
  const open = Boolean(anchorEdit);

  const handleCloseRow = (event) => {
    setAnchorEdit(null);
  };

  if (!applications) {
    return <Loader />;
  }

  return (
    <div className={classes.app_container}>
      <h1 style={{ marginBottom: 25 }}>{t.applications.title}</h1>
      <div className={classes.app_header}>
        <div className={classes.app_search__section}>
          <TextField
            placeholder={t.applications.inputPlaceholder}
            fullWidth
            id="fullWidth"
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.app_button__section}>
          <button
            ref={buttonRef}
            className={classes.app_button}
            disabled={!selectOrders?.length}
            style={{
              height: 54,
              borderRadius: 1,
              background: "#D6EFE6",
              opacity: !selectOrders?.length && 0.5,
            }}
            fontWeight="fontWeightBold"
            fullWidth
            variant="contained"
            color="success"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleEditRow}
          >
            <img src={exportIcon} alt="exportIcon" />
            Экспорт
          </button>
          <Menu
            id="edit-menu"
            anchorEl={anchorEdit}
            open={open}
            onClose={handleCloseRow}
            sx={{
              "& .MuiMenu-paper": {
                // background: 'red',
                maxWidth: 200,
                width: "100rem",
              },
            }}
          >
            <MenuItem onClick={() => handleDownloadOrder("pdf")}>Экспортироват в PDF.</MenuItem>
            {/* <button onClick={() => generateDockFile(selectOrders)}>экспорт в док</button>
            <button onClick={() => generatePdfFile()}>экспорт в pdf</button> */}
            <MenuItem onClick={() => handleDownloadOrder("docx")}>
              Экспортироват в DOC.
            </MenuItem>
            <MenuItem onClick={() => handleDownloadOrder("xlsx")}>
              {/* <CSVLink
                data={selectOrders}
                enclosingCharacter={""}
                filename={"my-file.csv"}
                separator={": "}
              > */}
              Экспортироват в XMSL.
              {/* </CSVLink> */}
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className={classes.app_filter__section}>
        <div>
          <SelectFirst
            data={elevators}
            locale={locale}
            t={t}
            setCurrency={setElevatorFilter}
            currency={elevatorFilter}
          />
        </div>
        <div>
          <SelectSecond
            data={productTypes}
            locale={locale}
            t={t}
            currency={productTypeFilter}
            setCurrency={setProductTypeFilter}
          />
        </div>
        <div>
          <SelectThird
            data={statusList}
            t={t}
            locale={locale}
            setCurrency={setStatusFilter}
            currency={statusFilter}
          />
        </div>
        <div>
          <SelectTypeDelivery
            data={elevatorsDeliveyType}
            locale={locale}
            t={t}
            currency={deliveryTypeFilter}
            setCurrency={setDeliveryTypeFilter}
          />
        </div>
        <div>
          <PaymentTypeSelect
            t={t}
            data={elevatorsPaymentType}
            locale={locale}
            currency={paymentTypeFilter}
            setCurrency={setPaymentTypeFilter}
          />
        </div>
        <div className={classes.chooseClientSelect}>
          <ChooseClientSelect
            t={t}
            data={clients}
            locale={locale}
            currency={client}
            setCurrency={setClientFilter}
          />
        </div>
      </div>
      <div className={classes.app_table__section}>
        <ApplicationTable
          deleteOrderById={deleteOrderById}
          currentPage={currentPage}
          pageSize={pageSize}
          headCells={headCells}
          rows={applications}
          t={t}
          locale={locale}
          getApplications={getApplications}
          handleSelectedOrders={handleSelectedOrders}
        />
      </div>

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
              onChange={(e) => [
                setPageSize(+e.target.value),
                setCurrentPage(1),
              ]}
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

        <PaginationApplication
          count={Math.ceil(!!count && count / pageSize)}
          page={currentPage}
          changePageHandler={changePageHandler}
        />
      </div>
    </div>
  );
}

export default Application;
