import React, { Suspense, useState } from "react";
import { Container } from "react-bootstrap";
import classNames from "classnames";
import classes from "../styles/Auth.module.scss";
import Link from "next/link";
import Image from "next/image";
import imageX from "../assets/icons/x.svg";
import ReactInputMask from "react-input-mask";
import Checkbox from "@mui/material/Checkbox";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useAppDispatch } from "../redux/hooks";
import { signUpUser, SignUpUserDto } from "../redux/products/auth.slice";
import { useRouter } from "next/router";
import AuthCarousel from "../components/AuthCarousel/AuthCarousel";
import { useTranslation } from "react-i18next";
import loginImg from "../assets/images/loginImg.png";
import Loader from "../components/Loader/Loader";

export const initialValues: SignUpUserDto = {
  username: "",
  password: "",
  first_name: "",
};

const Schema = yup.object({
  username: yup.string().required("Пожалуйста, заполните указанные поля"),
  password: yup.string().matches(
    /(?=.*[0-9])(?=.*[A-Z]){8,}/gi,
    "Пароль должен состоять из [A-z] [0-9] и не быть слишком простым..."
  ).required("Пожалуйста, заполните указанные поля"),
  first_name: yup.string().test(
    "first_name",
    "Заполните поле",
    (value) => !!(value || " ").replace(/\s/g, "")
  ).required("Пожалуйста, заполните указанные поля"),
});

function SignUp() {
  const { t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (values: SignUpUserDto, helpers: any) => {
    await dispatch(signUpUser(values));
    helpers.reset();
  };

  const checkInput = () => {
    setCheckbox(!checkbox);
  };

  function stylesMyText(text: any) {
    return {
      __html: text
    }
  }

  React.useEffect(() => {
    if (window.localStorage.getItem("token")) {
      router.push("/")
    }
  }, [router])

  return (
    <Suspense fallback={<Loader />} >

      <Container>
        <div
          className={classNames(
            classes.auth_items,
            "d-flex justify-content-between"
          )}
        >
          <div
            className={classNames(
              classes.auth_items__form,
              "flex-column align-items-center "
            )}
          >
            <div className={classes.imageX}>
              <Link href="/" passHref>
                <a>
                  <Image src={imageX} alt="X" />
                </a>
              </Link>
            </div>

            <p className={classes.wadeIn}>{t("register.createAcc")}</p>

            <p className={classes.wadeIn2}>{t("register.instruction")}</p>

            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={Schema}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
              }) => {
                return (
                  <Form className={classes.auth_items__form__form}>
                    <div
                      style={{ position: "relative", marginBottom: 40 }}
                    >
                      <input style={errors.first_name ? { borderColor: "red" } : undefined}
                        placeholder={router.locale === "ru" ? "Введите ваше имя" : "Атыңызды енгізіңіз"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.first_name}
                        name="first_name"
                      />

                      <ReactInputMask
                        style={errors.username ? { border: "1px solid red" } : undefined}
                        mask="+7(999)9999999"
                        placeholder={router.locale === "ru" ? "Введите номер телефона" : "Телефон нөмірін енгізіңіз"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.username}
                        name="username"
                        className="mt-3"
                      />


                      <div
                        style={errors.password ? { borderColor: "red" } : undefined}
                        className={classNames("mt-3", classes.password)}>
                        <input
                          style={errors.password ? { borderColor: "red" } : undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="password"
                          value={values.password}
                          type={passwordShown ? "text" : "password"}
                          placeholder={router.locale === "ru" ? "Введите пароль" : "Құпия сөзді еңгізіңіз"}
                        />
                        <i onClick={togglePasswordVisiblity} className={passwordShown ? classes.passwordControl2 : classes.passwordControl} />
                      </div>
                      {((errors.password && touched.password) || (errors.first_name && touched.first_name) || (errors.username && touched.username)) && (
                        <div style={{ position: "absolute" }}>
                          <p className={"text-danger"}>
                            {errors.first_name || errors.username ||
                              errors.password}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={"d-flex justify-content-between"}>
                      <div
                        className={classNames(
                          "d-flex align-items-center",
                          classes.checkbox
                        )}
                      >
                        <Checkbox
                          onClick={checkInput}
                          checked={checkbox}
                          color="primary"
                        />
                        <p dangerouslySetInnerHTML={stylesMyText(t("register.remember"))} className={"mt-3"} />
                      </div>
                    </div>

                    {!errors.username && !errors.password && !errors.first_name && checkbox ? (
                      <button className={classes.btnForm}>{t("register.next")}</button>
                    ) :
                      (
                        <button className={classes.btnDisabled} disabled>{t("register.next")}</button>
                      )
                    }
                  </Form>
                );
              }}
            </Formik>
          </div>
          <div>
            <AuthCarousel image={loginImg} />
          </div>
        </div>
      </Container>
    </Suspense>
  );
}

export default SignUp;
