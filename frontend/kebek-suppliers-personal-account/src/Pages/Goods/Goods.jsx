import React from 'react';
import classes from './Goods.module.scss';
import SelectStatus from './SelectStatus/SelectStatus';
import SuppliersSelect from './SelectSuppliers/SuppliersSelect';
import Button from '@mui/material/Button';
import GoodsTable from './GoodsTable';
import SelectProduct from './SelectProduct/SelectProduct';
import { Link } from 'react-router-dom';
import { goodsContext } from '../../providers/GoodsProvider';
import Status from '../../components/Status/Status';
import { localeContext } from '../../providers/LocaleProvider';
import Loader from "../../components/Loader/Loader"

import { MenuItem, useMediaQuery, FormControl, Select, Typography } from '@mui/material';
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


function Goods() {
  const [suplier, setSuplier] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [goodsType, setGoodsType] = React.useState('');
  const { getElevators, elevators, getProducts, products, deleteProducts, getProductTypes, productTypes, count, activateProduct, activateManyGoods } = React.useContext(goodsContext)
  const { t, locale } = React.useContext(localeContext)
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
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Наименование' : "Аты",
    },
    {
      id: 'product_code',
      numeric: true,
      disablePadding: true,
      label: locale === "ru" ? 'Код товара' : "Өнім коды",
    },
    {
      id: 'price_kg',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Цена за кг.' : "Бір кг бағасы.",
    },
    {
      id: 'remainder',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Остаток' : "Қалдық",
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: locale === "ru" ? 'Статус' : "Күй",
    },
  ];

  const changePageHandler = (page) => {
    setCurrentPage(page);
  };

  // const handleDeliveryTypeChange = (e) => {
  //   setDeliveryType(e.target.value);
  // };
  // const handleStatusChange = (e) => {
  //   setStatus(e.target.value);
  // };
  // const handleSuplierChange = (e) => {
  //   setSuplier(e.target.value);
  // };

  React.useEffect(() => {
    getProducts(suplier, status, goodsType, currentPage, pageSize)
  }, [suplier, status, goodsType, currentPage, pageSize])


  React.useEffect(() => {
    getElevators()
    getProductTypes()
  }, [])

  if (!products) {
    return <Loader />
  }


  return (
    <div className={classes.goods_container}>
      <h1 style={{ marginBottom: 25 }}>{locale === "ru" ? "Товары" : "Тауарлар"}</h1>
      <div className={classes.goods_header}>
        <div>
          <SuppliersSelect locale={locale} data={elevators} currency={suplier} setCurrency={setSuplier} />
        </div>
        <div>
          {/* <Status /> */}

          <SelectStatus locale={locale} currency={status} setCurrency={setStatus} />
        </div>
        <div>
          <SelectProduct locale={locale} data={productTypes} currency={goodsType} setCurrency={setGoodsType} />
        </div>
        <div>
          <Link to="/goods/add-goods">
            <Button
              sx={{ height: 54, borderRadius: 1 }}
              fontWeight='fontWeightBold'
              fullWidth
              variant='contained'
              color='success'
            >
              {locale === "ru" ? "Добавить товары" : "Өнімдерді қосу"}
            </Button>
          </Link>
        </div>
      </div>
      <div className={classes.goods_table__section}>
        <GoodsTable headCells={headCells} data={products} locale={locale} deleteProducts={deleteProducts} getProducts={getProducts} activateProduct={activateProduct} activateManyGoods={activateManyGoods} />
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
    </div>
  );
}

export default Goods;
