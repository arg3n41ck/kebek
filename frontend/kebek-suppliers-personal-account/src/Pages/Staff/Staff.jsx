import React from "react";
import classes from "./Staff.module.scss";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import SuppliersSelect from "./SupplierSelect/SuppliersSelect";
import PositionSelect from "./PositionSelect/PositionSelect";
import Button from "@mui/material/Button";
import StaffTable from "./StaffTable";
import { Link } from "react-router-dom";
import { staffContext } from "../../providers/StaffProvider";
import { goodsContext } from "../../providers/GoodsProvider";
import { localeContext } from "../../providers/LocaleProvider";
import Loader from "../../components/Loader/Loader";
import {
  MenuItem,
  useMediaQuery,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import PaginationDelivery from "../../components/Pagination/Pagination";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useDebounce from "../../components/CustomHook/useDebounce";

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
    paper: classes.dropdownStyle,
  },
};

function Staff() {
  function createData(id, supplier, position, name, phone) {
    return {
      id,
      supplier,
      position,
      name,
      phone,
    };
  }

  const [suplier, setSuplier] = React.useState("");
  const [status, setStatus] = React.useState("");
  const { getStaff, staff, count, deleteStaff } =
    React.useContext(staffContext);
  const { elevators, getElevators } = React.useContext(goodsContext);
  const { t, locale } = React.useContext(localeContext);
  const isMedium = useMediaQuery("(max-width: 992px)");
  const [pageSize, setPageSize] = React.useState(5);
  const pageListRef = React.useRef([3, 5, 7]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const value = useDebounce(search, 500);

  const headCells = [
    {
      id: "supplier_name",
      numeric: false,
      disablePadding: true,
      label: t.staff.nav.supplier,
    },
    {
      id: "address",
      numeric: false,
      disablePadding: true,
      label: t.staff.nav.position,
    },
    {
      id: "position",
      numeric: false,
      disablePadding: true,
      label: t.staff.nav.name,
    },
    {
      id: "phone",
      numeric: false,
      disablePadding: true,
      label: t.staff.nav.phoneNumber,
    },
  ];

  const changePageHandler = (page) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    getStaff(suplier, status, pageSize, currentPage, value);
  }, [suplier, status, pageSize, currentPage, value]);

  React.useEffect(() => {
    getElevators();
  }, []);

  if (!staff && !elevators) {
    return <Loader />;
  }

  return (
    <div className={classes.staff_container}>
      <h1 style={{ marginBottom: 25 }}>{t.staff.title}</h1>
      <div className={classes.staff_header}>
        <div className={classes.staff_search__section}>
          <TextField
            placeholder={t.staff.selectors.search}
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
        <div>
          <SuppliersSelect
            t={t}
            locale={locale}
            data={elevators}
            currency={suplier}
            setCurrency={setSuplier}
          />
        </div>
        <div>
          <PositionSelect t={t} currency={status} setCurrency={setStatus} />
        </div>
        <div>
          <Link to="/staff/add-staff">
            <Button
              sx={{ height: 54, borderRadius: 1, fontSize: "12.5px" }}
              fontWeight="fontWeightBold"
              fullWidth
              variant="contained"
              color="success"
            >
              {t.staff.selectors.button}
            </Button>
          </Link>
        </div>
      </div>
      <div className={classes.staff_table__section}>
        <StaffTable t={t} headCells={headCells} rows={staff} elevators={elevators} locale={locale} deleteStaff={deleteStaff} getStaff={getStaff} currentPage={currentPage} pageSize={pageSize} />
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
              className={classes.selectInp}
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
          <Typography sx={{ fontSize: 18 }}>
            {pageSize <= count ? pageSize : count} из {count}
          </Typography>
        </div>

        <PaginationDelivery
          count={Math.ceil(!!count && count / pageSize)}
          page={currentPage}
          changePageHandler={changePageHandler}
        />
      </div>
    </div>
  );
}

export default Staff;
