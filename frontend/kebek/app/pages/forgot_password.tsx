import React, { Suspense } from "react";
import { Container } from "react-bootstrap";
import classNames from "classnames";
import classes from "../styles/Auth.module.scss";
import Link from "next/link";
import Image from "next/image";
import leftArrow from "../assets/icons/leftArrow.svg";
import ReactInputMask from "react-input-mask";
import * as yup from "yup";
import { Form, Formik } from "formik";
import {
  ForgotPasswordSendCodeDto,
  forgotPasswordUserSendCode,
} from "../redux/products/auth.slice";
import loginImg from "../assets/images/loginImg.png";
import { useAppDispatch } from "../redux/hooks";
import { useRouter } from "next/router";
import AuthCarousel from "../components/AuthCarousel/AuthCarousel";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader/Loader";

const initialValues: ForgotPasswordSendCodeDto = {
  username: "",
  type: "RP",
};

const Schema = yup.object({
  username: yup.string().required("Введите номер!"),
});

function Forgot_password() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (values: ForgotPasswordSendCodeDto, helpers: any) => {
    await dispatch(forgotPasswordUserSendCode(values))
    helpers.reset();
  };

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
            <div style={{ cursor: "pointer" }} className={"d-flex"}>
              <Link href="/login" passHref>
                <div className={"d-flex align-items-center"}>
                  <Image src={leftArrow} alt="leftArrow" />
                  <p
                    style={{
                      marginTop: 15,
                      marginLeft: 10,
                      fontWeight: 500,
                      fontSize: 18,
                      color: "black",
                    }}
                  >
                    {t("newPassword.back")}
                  </p>
                </div>
              </Link>
            </div>

            <p className={classes.wadeIn}>{t("register.forgotPassword")}</p>

            <p className={classes.wadeIn2}>{t("forgotPassword.instruction")}</p>

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
                    <ReactInputMask
                      className={"mb-3"}
                      // mask="+999999999999"
                      mask="+7(999)9999999"
                      style={errors.username && touched.username ? { borderColor: "red" } : { marginBottom: 40 }}
                      type="text"
                      onChange={handleChange}
                      value={values.username}
                      onBlur={handleBlur}
                      name="username"
                    />

                    {errors.username && touched.username && (
                      <p className={"text-danger"}>{errors.username}</p>
                    )}

                    <button className={values.username.length ? classes.btnForm : classes.btnDisabled} disabled={!values.username.length}>
                      {t("forgotPassword.send")}
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <AuthCarousel image={loginImg} />
        </div>
      </Container>
    </Suspense>

  );
}

export default Forgot_password;
