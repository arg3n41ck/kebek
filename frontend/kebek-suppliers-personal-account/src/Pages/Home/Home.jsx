import classNames from "classnames";
import React, { useContext, useState } from "react";
import classes from "../Home/Home.module.scss";
import {
  Button,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { userContext } from "../../providers/UserProvider";
import { applicationContext } from "../../providers/ApplicationProvider"
import { Link } from "react-router-dom";
import { localeContext } from "../../providers/LocaleProvider";
import HomeGraph from "./HomeGraph";
import HomeStackedAreaPlot from "./HomeStackedAreaPlot";
import { Radio, Select } from 'antd';
import 'antd/dist/antd.min.css';
import { statusList } from "../../components/Status/constants";
import Loader from "../../components/Loader/Loader"
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Stack from '@mui/material/Stack';

const formatToHuman = (number) => {
  if (number < 1000) {
    return number
  }

  if (number < 1000000) {
    number = (number / 1000);
    return `${number.toFixed(1)} тыс`
  }

  if (number >= 1000000 && number < 1000000000) {
    number = (number / 1000000).toFixed(2);
    return `${number} млн`
  }

  if (number >= 1000000000 && number < 1000000000000) {
    number = (number / 1000000000);
    return `${number} млрд`
  }

  return `${(number / 1000000000000).toFixed(1)} T+`;
}

console.log(formatToHuman(4300015))


export const month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];



function Home() {
  const isMobile = useMediaQuery("(max-width: 578px)");
  const { t, locale } = useContext(localeContext);
  const { Option } = Select;
  const { user } = useContext(userContext);
  const date = new Date();
  const isSmall = useMediaQuery("(max-width: 578px)")
  const { getDashboardOrders, dashboardOrders, dashboardProfit, getDashboardProfit, dashboardInfo, getDashboardInfo } = useContext(applicationContext)
  const [selectYearOrMonth, setSelectYearOrMonth] = useState("MM")
  const [selectYears, setSelectYears] = useState(date.getFullYear())
  const [selectMonth, setSelectMonth] = useState(month[0])
  const day = date.getDate();
  // const [value, setValue] = React.useState(new Date());


  function onChange(value) {
    selectYearOrMonth === "MM" ? setSelectYears(value) : setSelectMonth(value)
  }

  function onSearch(val) {
    console.log('search:', val);
  }

  const handleChangeYearOrMonth = (e) => {
    setSelectYearOrMonth(e.target.value)
  }


  function getYears(limit) {
    const yearsArr = []
    const currentYear = new Date().getFullYear()

    for (let i = currentYear; i >= limit; --i) {
      yearsArr.push(i)
    }

    return yearsArr
  }

  const infoToday = React.useMemo(() => {
    return [
      {
        id: 1,
        count: !!dashboardInfo?.orders ? dashboardInfo.orders : 0,
        title: locale === "ru" ? "Всего заявок" : "Жалпы қолданбалар"
      },
      {
        id: 2,
        count: `${!!dashboardInfo?.ordersFD ? dashboardInfo.ordersFD : 0}`,
        title: locale === "ru" ? "Завершено" : "Аяқталды"
      },
      {
        id: 3,
        count: !!dashboardInfo?.profit ? dashboardInfo.profit : 0,
        title: locale === "ru" ? "Продажи, ₸" : "Сатылым, ₸"
      }
    ]
  }, [dashboardInfo, locale])


  React.useEffect(() => {
    getDashboardOrders()
    getDashboardInfo()
  }, [])

  React.useEffect(() => {
    getDashboardProfit(selectYears, selectMonth, day)
  }, [selectYears, selectMonth, day])


  console.log(selectYears, selectMonth)


  if (!dashboardOrders && !dashboardProfit && !dashboardInfo) {
    return <Loader />
  }

  return (
    <div className={classes.Home_container}>
      <h1 className={classes.headingTitle}>{t.home.navText}</h1>
      <div className={classes.Home_container__items}>
        <div className={classNames(classes.userInfo, "row")}>
          <div className={classNames(classes.userInfo__items, "col-xl-8 mt-2 col-lg-12")}>
            <div>
              <Typography
                className={classes.personalInformationText}
                style={{ marginTop: 10 }}
                sx={{ fontSize: 25, color: "black" }}
              >
                {t.home.navText_info.title}
              </Typography>
              {/* <div className={"d-sm-none d-block"}>
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
              </div> */}
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
          </div>

          {/*//? Notification */}

          <div
            className={classNames(
              classes.notifications,
              "col-xl-4 col-lg-12"
            )}
          >
            <div
              className={
                "d-flex justify-content-between align-items-center mt-4 mb-4"
              }
            >
              <Typography
                sx={{ fontSize: 21, color: "#092F33" }}
              >
                {t.home.notifications.headingText}{" "}
              </Typography>
            </div>

            <div className={"mt-2"}>
              <Card style={{ border: "1px solid #e0e0e0" }} className={classes.card} sx={{ minWidth: 275 }}>
                <div className={"d-flex align-items-center justify-content-between"} style={{ padding: "20px 23px" }}>
                  {infoToday.map((item) => (
                    <div className={"d-flex flex-column justify-content-between"} style={{ height: 104 }} key={item.id}>
                      <Typography sx={{ fontSize: "20px" }} >{item.count}</Typography>
                      <Typography sx={{ color: "#828282", fontSize: "14px" }}>{item.title}</Typography>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className={"mt-4"}>
          <div
            className={classNames(
              classes.applicationButton,
              "w-100 d-flex flex-column justify-content-center align-items-start"
            )}
          >
            <Typography sx={{ fontSize: "25px", color: "#092F33" }} >{t.home.applications.title}</Typography>
            {!!dashboardOrders?.length &&
              <HomeGraph dashboardOrders={dashboardOrders} locale={locale} />
            }
          </div>
        </div>

        <div className={"mt-4"}>
          <div
            className={classNames(
              classes.applicationButton,
              "w-100 d-flex flex-column justify-content-center align-items-start"
            )}
          >
            <div className={isSmall ? "d-flex flex-column" : "w-100 d-flex align-items-center"}>
              <Typography sx={{ fontSize: "25px", color: "#092F33" }} >{t.home.applications.title2}</Typography>
              <div style={{ maxWidth: 350 }} className={isSmall ? "d-flex align-items-start" : "d-flex align-items-center justify-content-between ms-4"} >
                <div>
                  <Radio.Group
                    value={selectYearOrMonth}
                    className={"w-100 d-flex align-items-center"}
                    onChange={handleChangeYearOrMonth}
                  >
                    <Radio.Button style={{ padding: "0 20px" }} value="MM">{t.home.applications.buttons.title}</Radio.Button>
                    <Radio.Button style={{ padding: "0 20px" }} value="dd">{t.home.applications.buttons.title2}</Radio.Button>
                    {/* <Radio.Button style={{ padding: "0 20px" }} value="d">{t.home.applications.buttons.title3}</Radio.Button> */}
                  </Radio.Group>
                </div>
                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year']}
                    label="Year only"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} helperText={null} />}
                  />
                </LocalizationProvider> */}

                <Select
                  showSearch
                  // placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={onChange}
                  value={selectYearOrMonth === "MM" ? selectYears : selectMonth}
                  style={{ minWidth: "100px" }}
                  className={"ms-4"}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {selectYearOrMonth === "dd" ?
                    month.map((item, index) => {
                      return <Option key={index} value={item}>{item}</Option>
                    })
                    :
                    getYears(2000).map((item) => {
                      return <Option key={item} value={item}>{item} {locale === "ru" ? "год" : "жыл"}</Option>
                    })
                  }
                  {/* <Option value="2023">2023 год</Option>
                  <Option value="2022">2022 год</Option> */}
                </Select>
              </div>
            </div>
            {!!dashboardProfit?.length &&
              <HomeStackedAreaPlot selectYearOrMonth={selectYearOrMonth} dashboardProfit={dashboardProfit} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
