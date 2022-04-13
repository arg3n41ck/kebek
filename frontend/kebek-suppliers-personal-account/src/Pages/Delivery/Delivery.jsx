import React from 'react';
import classes from './Delivery.module.scss';
import SelectStatus from './SelectStatus/SelectStatus';
import SelectSuppliers from './SelectSuppliers/SelectSuppliers';
import Button from '@mui/material/Button';
import SelectOrderType from './SelectOrderType/SelectOrderType';
import { MenuItem, useMediaQuery, FormControl, Select, Typography } from '@mui/material';
import DeliveryTable from './DeliveryTable';
import { Link } from 'react-router-dom';
import { goodsContext } from "../../providers/GoodsProvider"
import { deliveryContext } from '../../providers/DeliveriesProvider';
import { localeContext } from '../../providers/LocaleProvider';
import Loader from "../../components/Loader/Loader"
import PaginationDelivery from "../../components/Pagination/Pagination"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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


function Delivery() {
  function createData(id, suppliers, delivery_type, price_kg, status) {
    return {
      id,
      suppliers,
      delivery_type,
      price_kg,
      status,
    };
  }

  const [suplier, setSuplier] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [deliveryTypes, setDeliveryTypes] = React.useState('');
  const { elevators, getElevators } = React.useContext(goodsContext)
  const { locale, t } = React.useContext(localeContext)
  const { delivery, getDelivery, deliveryType, getDeliveryTypes, deleteDelivery, activateDelivery, count, activateManyDelivery } = React.useContext(deliveryContext)
  const isMedium = useMediaQuery("(max-width: 992px)");
  const [pageSize, setPageSize] = React.useState(5);
  const pageListRef = React.useRef([3, 5, 7]);
  const [currentPage, setCurrentPage] = React.useState(1);


  const headCells = [
    {
      id: 'suppliers',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Поставщик' : "Жеткізуші",
    },
    {
      id: 'delivery_type',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Тип доставки' : "Жеткізу түрі",
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Наименование' : "Аты",
    },
    {
      id: 'price_kg',
      numeric: true,
      disablePadding: true,
      label: locale === "ru" ? 'Стоимость за кг.,₸' : "Бір кг құны.,₸",
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Статус' : "Күй",
    },
  ];

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSuplierChange = (e) => {
    setSuplier(e.target.value);
  };

  const changePageHandler = (page) => {
    setCurrentPage(page);
  };


  // React.useEffect(() => {
  //   getApplications(elevatorFilter, productTypeFilter, statusFilter, deliveryTypeFilter, paymentTypeFilter, client, value, currentPage, pageSize)
  // }, [elevatorFilter, productTypeFilter, statusFilter, deliveryTypeFilter, paymentTypeFilter, client, value, currentPage, pageSize])

  // uplier, setSuplier] = React.useState('');
  // const [status, setStatus] = React.useState('');
  // const [deliveryTypes

  React.useEffect(() => {
    getDelivery(suplier, status, deliveryTypes, currentPage, pageSize)
  }, [suplier, status, deliveryTypes, pageSize, currentPage])

  React.useEffect(() => {
    getElevators()
    getDeliveryTypes()
  }, [])

  if (!delivery) {
    return <Loader />
  }

  return (
    <div className={classes.delivery_container}>
      <h1 style={{ marginBottom: 25 }}>{locale === "ru" ? "Доставка" : "Жеткізу"}</h1>
      <div className={classes.delivery_header}>
        <div>
          <SelectSuppliers locale={locale} data={elevators} currency={suplier} setCurrency={setSuplier} />
        </div>
        <div>
          <SelectStatus locale={locale} currency={status} setCurrency={setStatus} />
        </div>
        <div>
          <SelectOrderType locale={locale} data={deliveryType} currency={deliveryTypes} setCurrency={setDeliveryTypes} />
        </div>
        <div>
          <Link to='add_delivery'>
            <Button
              sx={{ height: 54, borderRadius: 1 }}
              fontWeight='fontWeightBold'
              fullWidth
              variant='contained'
              color='success'
            >
              {locale === "ru" ? "Добавить доставку" : "Жеткізу қосу"}
            </Button>
          </Link>
        </div>
      </div>
      <div className={classes.delivery_table__section}>
        <DeliveryTable headCells={headCells} rows={delivery} locale={locale} deleteDelivery={deleteDelivery} getDelivery={getDelivery} activateDelivery={activateDelivery} activateManyDelivery={activateManyDelivery} />
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

        <PaginationDelivery
          count={Math.ceil(!!count && count / pageSize)}
          page={currentPage}
          changePageHandler={changePageHandler}
        />
      </div>
    </div >
  );
}

export default Delivery;
