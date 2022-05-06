import React from 'react';
import classes from './Payment.module.scss';
import SelectProduct from './SelectProduct/SelectProduct';
import SelectSuppliers from './SelectSuppliers/SelectSuppliers';
import Button from '@mui/material/Button';
import SelectStatus from './SelectStatus/SelectStatus';
import PaymentTable from './PaymentTable';
import { Link } from 'react-router-dom';
import { paymentContext } from '../../providers/PaymentProvider';
import Loader from "../../components/Loader/Loader"
import { localeContext } from '../../providers/LocaleProvider';
import { MenuItem, useMediaQuery, FormControl, Select, Typography } from '@mui/material';

import PaginationPayment from "../../components/Pagination/Pagination"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { goodsContext } from '../../providers/GoodsProvider';

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


function Payment() {
  function createData(id, suppliers, name, order_type, cancel_order, status) {
    return {
      id,
      suppliers,
      name,
      order_type,
      cancel_order,
      status,
    };
  }

  const [suplier, setSuplier] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [paymentTypes, setPaymentTypes] = React.useState('');
  const { payment, getPayment, getPaymentTypes, paymentType, count, activatePayment, deletePayment, paymentById, activateManyPayment } = React.useContext(paymentContext)
  const isMedium = useMediaQuery("(max-width: 992px)");
  const [pageSize, setPageSize] = React.useState(5);
  const pageListRef = React.useRef([3, 5, 7]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const { elevators, getElevators } = React.useContext(goodsContext)
  const { locale, t } = React.useContext(localeContext)


  const headCells = [
    {
      id: 'suppliers',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Поставщик' : "Жеткізуші",
    },
    {
      id: 'order_type',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Тип оплаты' : "Төлем түрі",
    },
    {
      id: 'cancel_order',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'До отмены заказа' : "Тапсырысты тоқтату алдында",
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Статус' : "Күй",
    },
  ];


  // const handleDeliveryTypeChange = (e) => {
  //   setPaymentTypes(e.target.value);
  // };
  // const handleStatusChange = (e) => {
  //   setStatus(e.target.value);
  // };
  // const handleSuplierChange = (e) => {
  //   setSuplier(e.target.value);
  // };

  React.useEffect(() => {
    getPayment(suplier, status, paymentTypes, currentPage, pageSize)
  }, [suplier, status, paymentTypes, currentPage, pageSize])

  const changePageHandler = (page) => {
    setCurrentPage(page);
  };


  React.useEffect(() => {
    getElevators()
    getPaymentTypes()
  }, [])

  if (!payment) {
    return <Loader />
  }

  return (
    <div className={classes.payment_container}>
      <h1 style={{ marginBottom: 25 }}>{locale === "ru" ? "Оплата" : "Төлем"}</h1>
      <div className={classes.payment_header}>
        <div>
          <SelectSuppliers locale={locale} data={elevators} currency={suplier} setCurrency={setSuplier} />
        </div>
        <div>
          <SelectProduct locale={locale} data={paymentType} currency={paymentTypes} setCurrency={setPaymentTypes} />
        </div>
        <div>
          <SelectStatus locale={locale} currency={status} setCurrency={setStatus} />
        </div>
        <div>
          <Link to='add_payment'>
            <Button
              sx={{ height: 54, borderRadius: 1 }}
              fontWeight='fontWeightBold'
              fullWidth
              variant='contained'
              color='success'
            >
              {locale === "ru" ? "Добавить оплату" : "Төлем қосыңыз"}
            </Button>
          </Link>
        </div>
      </div>
      <div className={classes.payment_table__section}>
        <PaymentTable headCells={headCells} rows={payment} activatePayment={activatePayment} deletePayment={deletePayment} getPayment={getPayment} activateManyPayment={activateManyPayment} />
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

        <PaginationPayment
          count={Math.ceil(!!count && count / pageSize)}
          page={currentPage}
          changePageHandler={changePageHandler}
        />
      </div>
    </div>
  );
}

export default Payment;
