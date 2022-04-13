import React from "react";
import classes from "./Suppliers.module.scss";
import {
  TextField,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import SuppliersTable from "./SuppliersTable";
import InputAdornment from "@mui/material/InputAdornment";
import { goodsContext } from "../../providers/GoodsProvider";
import SearchIcon from "@mui/icons-material/Search";
import PaginationSuppliers from "../../components/Pagination/Pagination";
import { localeContext } from "../../providers/LocaleProvider";
import cl from "../Notification/Notification.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import pr from "../Profile/Profile.module.scss";
import useDebounce from "../../components/CustomHook/useDebounce";
import Loader from "../../components/Loader/Loader";

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

function Suppliers() {
  function createData(id, name, address, phone) {
    return {
      id,
      name,
      address,
      phone,
    };
  }
  const { elevators, getElevators } = React.useContext(goodsContext);
  const [suplier, setSuplier] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [deliveryType, setDeliveryType] = React.useState("");
  const [search, setSeacrh] = React.useState("");
  const [pageSize, setPageSize] = React.useState(5);
  const [currentPage, setCurrentPage] = React.useState(1);
  const isMedium = useMediaQuery("(max-width: 992px)");
  const pageListRef = React.useRef([3, 5, 10, 20]);
  const { t } = React.useContext(localeContext);
  const value = useDebounce(search, 500);

  const headCells = [
    {
      id: "supplier_name",
      numeric: false,
      disablePadding: true,
      label: t.supplier.nav.name,
    },
    {
      id: "address",
      numeric: false,
      disablePadding: true,
      label: t.supplier.nav.address,
    },
    {
      id: "phone",
      numeric: false,
      disablePadding: true,
      label: t.supplier.nav.phoneNumber,
    },
  ];

  const handleDeliveryTypeChange = (e) => {
    setDeliveryType(e.target.value);
  };
  const changePageHandler = (page) => {
    setCurrentPage(page);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  const handleSuplierChange = (e) => {
    setSuplier(e.target.value);
  };

  React.useEffect(() => {
    getElevators(value);
  }, [value]);

  if (!elevators) {
    return <Loader />;
  }

  return (
    <div className={classes.suppliers_container}>
      <div className={classes.suppliers_header}>
        <h1 style={{ marginBottom: 25 }}>{t.supplier.title}</h1>
        <div className={classes.suppliers_search__section}>
          <TextField
            placeholder={t.supplier.search}
            fullWidth
            id="fullWidth"
            onChange={(e) => setSeacrh(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      <div className={classes.suppliers_table__section}>
        <SuppliersTable headCells={headCells} rows={elevators} />
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
              onChange={(e) => [setPageSize(+e.target.value), setCurrentPage(1)]}
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

        <PaginationSuppliers
          count={Math.ceil(elevators?.length / pageSize)}
          page={currentPage}
          changePageHandler={changePageHandler}
        />
      </div>
    </div>
  );
}

export default Suppliers;
