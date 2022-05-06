import React, { useContext, useEffect } from "react";
import arrow from "../../assets/icons/left-arrow 1.svg";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import { localeContext } from "../../providers/LocaleProvider";
import classes from "./Suppliers.module.scss";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { $api } from "../../services/api";
import notImage from "../../assets/icons/notImage.svg";
import LinearProgress from "@mui/material/LinearProgress";
import { CircularProgressWithLabel } from "../Goods/AddGoods";
import { useMediaQuery } from "@mui/material";
import { goodsContext } from "../../providers/GoodsProvider";

const initialValues = {
  titleRu: "",
  descriptionRu: "",
  addressRu: "",
  website: "",
  titleKk: "",
  descriptionKk: "",
  addressKk: "",
  phoneNumber: "",
  email: "",
  bin: "",
  bik: "",
  checkingAccount: "",
  cities: "",
  railwayStation: "",
  logo: null
};

const Schema = yup.object({
  titleRu: yup.string().required("Пожалуйста, заполните указанные поля!"),
  descriptionRu: yup.string().required("Пожалуйста, заполните указанные поля!"),
  addressRu: yup.string().required("Пожалуйста, заполните указанные поля!"),
  titleKk: yup.string().required("Пожалуйста, заполните указанные поля!"),
  descriptionKk: yup.string().required("Пожалуйста, заполните указанные поля!"),
  addressKk: yup.string().required("Пожалуйста, заполните указанные поля!"),
  phoneNumber: yup.string().required("Пожалуйста, заполните указанные поля!"),
  website: yup.string().url().required("Пожалуйста, заполните указанные поля!"),
  bin: yup.string().required("Пожалуйста, заполните указанные поля!"),
  bik: yup
    .string()
    .nullable()
    .required("Пожалуйста, заполните указанные поля!"),
  checkingAccount: yup
    .string()
    .required("Пожалуйста, заполните указанные поля!"),
  cities: yup.string().required("Пожалуйста, заполните указанные поля!"),
  // railwayStation: yup.string().required("Пожалуйста, заполните указанные поля!"),
});

function SuppliersEdit() {
  const { locale } = useContext(localeContext);
  const navigate = useNavigate();
  const [currency] = React.useState("Выберите город *");
  const [currenciesSec] = React.useState("Выберите город *");
  const [drag, setDrag] = React.useState(false);
  const { id } = useParams();
  const formRef = React.useRef(null);
  const isMobile = useMediaQuery("(max-width: 578px)")
  const { cities, getCities, addresses, getAddresses } = useContext(goodsContext)

  const handleSubmitValues = async (values, resetForm) => {
    const formData = new FormData();

    const newValue = {};
    for (let item in formRef.current.values) {
      if (initialValues.hasOwnProperty(item)) {
        newValue[item] = formRef.current.values[item];
      }
    }

    const data = {
      address_kk: newValue?.addressKk,
      address_ru: newValue?.addressRu,
      bik: newValue?.bik,
      bin: newValue?.bin,
      logo: newValue?.logo,
      title_ru: newValue?.titleRu,
      title_kk: newValue?.titleKk,
      checking_account: newValue?.checkingAccount,
      description_kk: newValue?.descriptionKk,
      description_ru: newValue?.descriptionRu,
      email: newValue?.email,
      phone_number: newValue?.phoneNumber,
      website: newValue?.website,
      cities: [newValue?.cities],
      railway_station: newValue?.railwayStation
    }

    for (let key in data) {
      if (!data[key] || typeof data[key] === "undefined") delete data[key]

    }

    for (let key in data) {
      const value = data[key];
      if (key === 'logo') {
        !!value?.name && formData.append(key, value, value.name);
      } else {
        formData.append(key, value);
      }
    }


    // await Object.keys(data).forEach((key) => {
    //   const value = data[key];

    // });

    try {
      await $api.patch(`/elevators/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      resetForm();
      navigate(-1);
      toast.success("Вы успешно изменили поставщики");
    } catch ({ response }) {
      await toast.error("Произошла непредвиденная ошибка!");
    }
  };

  const dragStartHandler = (e) => {
    e.preventDefault();
    setDrag(true);
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    setDrag(false);
  };

  useEffect(async () => {
    const { data } = await $api.get(`/elevators/${id}/`);
    formRef.current.setValues({
      titleRu: data?.titleRu ? data?.titleRu : "",
      descriptionRu: data?.descriptionRu ? data?.descriptionRu : "",
      addressRu: data?.addressRu ? data?.addressRu : "",
      website: data?.website ? data?.website : "",
      titleKk: data?.titleKk ? data?.titleKk : "",
      descriptionKk: data?.descriptionKk ? data?.descriptionKk : "",
      addressKk: data?.addressKk ? data?.addressKk : "",
      phoneNumber: data?.phoneNumber ? data?.phoneNumber : "",
      email: data?.email ? data?.email : "",
      bin: data?.bin ? data?.bin : "",
      bik: data?.bik ? data?.bik : "",
      checkingAccount: data?.checkingAccount ? data?.checkingAccount : "",
      cities: data?.cities ? data?.cities[0]?.id : "",
      railwayStation: !!data?.railwayStation.id ? data?.railwayStation.id : "",
      logo: !!data?.logo ? data?.logo : ""
    });
    getAddresses()
    getCities()
  }, []);


  return (
    <div>
      <div className={classes.navigation_section}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <ul
            className={"d-flex align-items-center m-0 p-0 ps-2"}
            style={{ listStyle: "none" }}
          >
            <li style={{ color: "#BDBDBD" }} onClick={() => navigate(-1)}>
              <img
                src={arrow}
                alt="arrow"
                width={20}
                height={20}
                style={{ marginRight: 10 }}
              />
              {locale === "ru" ? "Назад" : "Артқа"}
            </li>
            <li style={{ margin: "0 0 0 10px", fontWeight: 600 }}>
              /{" "}
              {locale === "ru"
                ? "Редактировать поставщика"
                : "Жабдықтаушыны өңдеу"}
            </li>
          </ul>
        </Box>
      </div>
      <div className={classes.edit_section}>
        <Formik
          initialValues={initialValues}
          validationSchema={Schema}
          onSubmit={(values, { resetForm }) =>
            handleSubmitValues(values, resetForm)
          }
          innerRef={formRef}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <h1 style={{ margin: "30px 0 10px 0", fontSize: "25px" }}>
                Основная информация на русском языке
              </h1>
              <div className={classes.main_info}>
                <input
                  style={
                    errors.titleRu &&
                    touched.titleRu && {
                      border: "1px solid red",
                    }
                  }
                  className={classes.name}
                  type="text"
                  placeholder={"Введите наименование (рус.) *"}
                  name="titleRu"
                  value={values.titleRu}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <textarea
                  style={
                    errors.descriptionRu &&
                    touched.descriptionRu && {
                      border: "1px solid red",
                    }
                  }
                  className={classes.description}
                  placeholder={"Введите описание (рус.)"}
                  name="descriptionRu"
                  onBlur={handleBlur}
                  value={values.descriptionRu}
                  onChange={handleChange}
                  rows="4"
                  cols="50"
                />
              </div>
              <h1 style={{ margin: "30px 0 10px 0", fontSize: "25px" }}>
                Контактные данные на русском языке
              </h1>
              <div className={classes.contacts_section}>
                <div className={classes.contacts}>
                  <input
                    style={
                      errors.addressRu &&
                      touched.addressRu && {
                        border: "1px solid red",
                      }
                    }
                    name="addressRu"
                    value={values.addressRu}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={classes.address}
                    type="text"
                    placeholder={"Введите адрес (рус.) *"}
                  />
                  <input
                    style={
                      errors.phoneNumber &&
                      touched.phoneNumber && {
                        border: "1px solid red",
                      }
                    }
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={classes.phone}
                    type="text"
                    placeholder={"Введите номер телефона *"}
                  />
                  <input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={classes.email}
                    type="text"
                    placeholder={"Введите email"}
                  />
                  <input
                    style={
                      errors.website &&
                      touched.website && {
                        border: "1px solid red",
                      }
                    }
                    name="website"
                    value={values.website}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={classes.website_address}
                    type="text"
                    placeholder={"Введите адрес сайта"}
                  />
                </div>
              </div>
              <h1 style={{ margin: "30px 0 10px 0", fontSize: "25px" }}>
                Основная информация на казахском языке
              </h1>
              <div className={classes.main_info__kz}>
                <input
                  style={
                    errors.titleKk &&
                    touched.titleKk && {
                      border: "1px solid red",
                    }
                  }
                  name="titleKk"
                  value={values.titleKk}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={classes.name}
                  type="text"
                  placeholder={"Введите наименование (каз.) *"}
                />
                <textarea
                  style={
                    errors.descriptionKk &&
                    touched.descriptionKk && {
                      border: "1px solid red",
                    }
                  }
                  name="descriptionKk"
                  value={values.descriptionKk}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={"Введите описание (каз.)"}
                  className={classes.description}
                  rows="4"
                  cols="50"
                />
              </div>
              <h1 style={{ margin: "30px 0 10px 0", fontSize: "25px" }}>
                Контактные данные на казахском языке
              </h1>
              <div className={classes.contacts_section__kz}>
                <div className={classes.contacts}>
                  <input
                    style={
                      errors.addressKk &&
                      touched.addressKk && {
                        border: "1px solid red",
                      }
                    }
                    name="addressKk"
                    value={values.addressKk}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={classes.address}
                    type="text"
                    placeholder={"Введите адрес (каз.) *"}
                  />
                  <input
                    style={
                      errors.phoneNumber &&
                      touched.phoneNumber && {
                        border: "1px solid red",
                      }
                    }
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={classes.phone}
                    type="text"
                    placeholder={"Введите номер телефона *"}
                  />
                  <input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={classes.email}
                    type="text"
                    placeholder={"Введите email"}
                  />
                  <input
                    style={
                      errors.website &&
                      touched.website && {
                        border: "1px solid red",
                      }
                    }
                    name="website"
                    value={values.website}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={classes.website_address}
                    type="text"
                    placeholder={"Введите адрес сайта"}
                  />
                </div>
              </div>
              <h1 style={{ margin: "30px 0 10px 0", fontSize: "25px" }}>
                Логотип
              </h1>
              <label className={classes.logo_download}>
                <input
                  type={"file"}
                  onChange={(e) => setFieldValue("logo", e.target.files[0])}
                />
                <button style={isMobile ? { width: "100%" } : null} type="button" className={classes.logo_button}>
                  {locale === "ru" ? "Загрузите изображение..." : "Суретті жүктеп салу..."}
                </button>
                <div className={"d-sm-block d-none"}>
                  {drag ? (
                    <span
                      onDragStart={(e) => dragStartHandler(e)}
                      onDragLeave={(e) => dragLeaveHandler(e)}
                      onDragOver={(e) => dragStartHandler(e)}
                    >
                      {locale === "ru" ? "Отпустите файлы, чтобы загрузить их" : "Жүктеп алу үшін файлдарды босатыңыз"}
                    </span>
                  ) : (
                    <span
                      onDragStart={(e) => dragStartHandler(e)}
                      onDragLeave={(e) => dragLeaveHandler(e)}
                      onDragOver={(e) => dragStartHandler(e)}
                    >
                      {locale === "ru" ? "или перетащите изображение в эту область" : "немесе суретті осы аймаққа сүйреңіз"}
                    </span>
                  )}
                </div>
              </label>

              {values.logo && <Item data={values.logo} />}

              {/* {drag ? (
                <div className={classes.logo_download}>
                  <button type='button' className={classes.logo_button}>
                    Загрузите изображение...
                  </button>
                  {!drag && (
                    <span
                      onDragStart={(e) => dragStartHandler(e)}
                      onDragLeave={(e) => dragLeaveHandler(e)}
                      onDragOver={(e) => dragStartHandler(e)}
                    >
                      lol
                    </span>
                  )}
                </div>
              ) : (
                <div className={classes.logo_download}>
                  <button type='button' className={classes.logo_button}>
                    Загрузите изображение...
                  </button>
                  {drag && (
                    <span
                      onDragStart={(e) => dragStartHandler(e)}
                      onDragLeave={(e) => dragLeaveHandler(e)}
                      onDragOver={(e) => dragStartHandler(e)}
                    >
                      или перетащите изображение в эту область
                    </span>
                  )}
                </div>
              )} */}
              <h1 style={{ margin: "30px 0 10px 0", fontSize: "25px" }}>
                {locale === "ru" ? "Реквизиты" : "Деректемелер"}
              </h1>
              <div className={classes.req_section}>
                <input
                  style={
                    errors.bin &&
                    touched.bin && {
                      border: "1px solid red",
                    }
                  }
                  name="bin"
                  value={values.bin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={classes.bin}
                  type="text"
                  placeholder={"Введите БИН"}
                />
                <input
                  style={
                    errors.bik &&
                    touched.bik && {
                      border: "1px solid red",
                    }
                  }
                  name="bik"
                  value={values.bik}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={classes.bik}
                  type="text"
                  placeholder={"Введите БИК"}
                />
                <input
                  style={
                    errors.checkingAccount &&
                    touched.checkingAccount && {
                      border: "1px solid red",
                    }
                  }
                  name="checkingAccount"
                  value={values.checkingAccount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={classes.pc}
                  type="text"
                  placeholder={"Введите РС"}
                />
              </div>
              <h1 style={{ margin: "30px 0 10px 0", fontSize: "25px" }}>
                {locale === "ru" ? "Город" : "Қала"}
              </h1>
              <div className={classes.city_section}>
                <TextField
                  id="outlined-select-currency"
                  select
                  name="cities"
                  value={values.cities}
                  onChange={handleChange}
                  error={touched.cities && errors.cities}
                >
                  {!!cities && cities.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {locale === "ru" ? item.titleRu : item.titleKk}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  id="outlined-select-currency"
                  select
                  name="railwayStation"
                  value={values.railwayStation}
                  onChange={handleChange}
                >
                  {!!addresses && addresses.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {locale === "ru" ? item.descriptionRu : item.descriptionKk}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              {((errors.addressKk && touched.addressKk) ||
                (touched.addressRu && errors.addressRu) ||
                (errors.titleRu && touched.titleRu) ||
                (errors.descriptionRu && touched.descriptionRu) ||
                (errors.phoneNumber && touched.phoneNumber) ||
                (errors.website && touched.website) ||
                (errors.titleKk && touched.titleKk) ||
                (errors.descriptionKk && touched.descriptionKk) ||
                (errors.phoneNumber && touched.phoneNumber) ||
                (errors.bin && touched.bin) ||
                (errors.bik && touched.bik) ||
                (errors.checkingAccount && touched.checkingAccount) ||
                (errors.cities && touched.cities)) && (
                  <div style={{ position: "relative" }}>
                    <p
                      style={{ position: "absolute", top: -25 }}
                      className={"text-danger"}
                    >
                      {errors.addressKk ||
                        errors.addressRu ||
                        errors.titleRu ||
                        errors.titleKk ||
                        errors.descriptionRu ||
                        errors.phoneNumber ||
                        errors.website ||
                        errors.descriptionKk ||
                        errors.phoneNumber ||
                        errors.checkingAccount ||
                        errors.bik ||
                        errors.bin ||
                        errors.cities}
                    </p>
                  </div>
                )}
              <button type="submit" className={classes.save_all}>
                {locale === "ru" ? "Сохранить изменения" : "Өзгерістерді сақтау"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SuppliersEdit;

function Item({ data }) {
  const [progress, setProgress] = React.useState(0);
  const mbInfo = data.size / 1024 / 1024;
  const [seconds, setSeconds] = React.useState(
    Math.floor(Math.random() * 7) + 3
  );
  const typeDataIsString = typeof data === "string";

  // React.useEffect(() => {
  //     const timer = setInterval(() => {
  //         setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
  //     }, 800);
  //     return () => {
  //         clearInterval(timer);
  //     };
  // }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100
          ? 100
          : prevProgress +
          Math.floor(
            Math.round(mbInfo) > 3 ? Math.random() * 7 : Math.random() * 15
          ) +
          1
      );
    }, Math.floor(Math.random() * 150) + 50);
    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    if (!typeDataIsString) {
      const timer = setTimeout(() => {
        setSeconds((seconds) =>
          seconds > 0 && progress !== 100 ? seconds - 1 : 0
        );
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [seconds]);

  return (
    <Box sx={{ maxWidth: "70%", width: "100%" }}>
      <div className={"d-flex align-items-center mb-3"}>
        <img
          style={{ width: 94, height: 94, objectFit: "cover", marginTop: 10 }}
          src={
            typeDataIsString
              ? data
              : progress === 100
                ? window.URL.createObjectURL(data)
                : notImage
          }
        />
        <div className={"w-100 d-flex flex-column ms-3"}>
          <div
            style={{ position: "relative" }}
            className={"d-flex align-items-start pt-1"}
          >
            {!typeDataIsString && (
              <div style={{ position: "absolute" }} className={"mt-3"}>
                <CircularProgressWithLabel value={progress} />
              </div>
            )}
            <p className={"mt-3"} style={{ marginLeft: 30 }}>
              {typeDataIsString
                ? data.split("/")[data.split("/").length - 1]
                : data.name}
            </p>
          </div>
          {!typeDataIsString && (
            <>
              <p>
                {mbInfo.toFixed(2)} MB: {Math.round(progress)}%{" "}
                {seconds !== 0 && `оставшееся время: 00:0${seconds}`}
              </p>
              <LinearProgress
                color="success"
                variant="determinate"
                value={progress}
              />
            </>
          )}
        </div>
      </div>
    </Box>
  );
}
