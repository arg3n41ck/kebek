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
import { signInUser, SignInUserDto } from "../redux/products/auth.slice";
import { useRouter } from "next/router";
import AuthCarousel from "../components/AuthCarousel/AuthCarousel";
import { useTranslation } from "react-i18next";
import loginImg from "../assets/images/loginImg.png";
import { Button } from "@mui/material";
import Loader from "../components/Loader/Loader";

const Schema = yup.object({
  username: yup.string().required("Пожалуйста, заполните указанные поля"),
  password: yup.string().required("Пожалуйста, заполните указанные поля"),
});

const initialValues: SignInUserDto = {
  username: "",
  password: "",
};

function Login() {
  const { t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);
  const [checkbox, setCheckbox] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();


  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const checkInput = () => {
    setCheckbox(!checkbox);
  };

  const handleSubmit = async (values: SignInUserDto, helpers: any) => {
    await dispatch(signInUser(values))
    helpers.reset();
  };

  React.useEffect(() => {
    if (window.localStorage.getItem("token")) {
      router.push("/")
    }
  }, [router])




  // rememberUser && dispatch(signInUser(rememberUser))

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
              "flex-column align-items-center"
            )}
          >
            <div className={classes.imageX}>
              <Link href="/" passHref>
                <a>
                  <Image src={imageX} alt="X" />
                </a>
              </Link>
            </div>

            <p className={classes.wadeIn}>{t("login.loginAcc")}</p>

            <p className={classes.wadeIn2}>{t("login.instruction")} </p>

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
                // handleSubmit,
                isSubmitting,
              }) => {
                return (
                  <Form className={classes.auth_items__form__form}>
                    <div style={{ position: "relative", marginBottom: 40 }}>
                      <ReactInputMask
                        style={errors.username && touched.username ? { border: "1px solid red" } : undefined}
                        mask="+7(999)9999999"
                        // mask="+999999999999"
                        type="text"
                        placeholder={router.locale === "ru" ? "Введите номер телефона" : "Телефон нөмірін енгізіңіз"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.username}
                        name="username"
                      />
                      <div
                        // style={errors.password ? { borderColor: "red" } : undefined}
                        className={classNames("mt-3", classes.password)}>
                        <input
                          style={errors.password && touched.password ? { borderColor: "red" } : undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="password"
                          value={values.password}
                          type={passwordShown ? "text" : "password"}
                          placeholder={router.locale === "ru" ? "Введите пароль" : "Құпия сөзді еңгізіңіз"}
                        />
                        <i onClick={togglePasswordVisiblity} className={passwordShown ? classes.passwordControl2 : classes.passwordControl} />
                      </div>
                      {((errors.password && touched.password) || (errors.username && touched.username)) && (
                        <div style={{ position: "absolute" }}>
                          <p className={"text-danger"}>
                            {errors.username ||
                              errors.password}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={"d-flex justify-content-between"}>
                      <div
                        onClick={checkInput}
                        className={classNames(
                          "d-flex align-items-center",
                          classes.checkbox
                        )}
                      >
                        <Checkbox
                          onChange={checkInput}
                          checked={checkbox}
                          color="primary"
                        />
                        <p style={{ fontSize: 18 }} className="d-flex align-items-center">{t("login.remember")}</p>
                      </div>

                      <Link href="/forgot_password" passHref>
                        <p className={classNames("mt-3", classes.forgotPass)}>
                          <b>{t("register.forgotPassword")}</b>
                        </p>
                      </Link>
                    </div>
                    {!errors.username && !errors.password ? (
                      <button className={classes.btnForm}>{t("login.enter")}</button>
                    ) :
                      (
                        <button className={classes.btnDisabled} disabled>{t("login.enter")}</button>
                      )
                    }
                  </Form>
                );
              }}
            </Formik>

            <div className={classNames("mt-4", classes.createAccount)}>
              <div className={classes.vector} />
              <div
                className={classNames(
                  "d-flex align-items-center mt-3",
                  classes.createAccount__links
                )}
              >
                <p>{t("login.notRegistered")}</p>

                <div>
                  <Link href="/register" passHref>
                    <p>{t("login.createAcc")}</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <AuthCarousel image={loginImg} />
        </div>
      </Container>
    </Suspense>

  );
}

export default Login;
