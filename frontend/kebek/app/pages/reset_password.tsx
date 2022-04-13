import React, { Suspense, useState } from "react";
import { Container } from "react-bootstrap";
import classNames from "classnames";
import classes from "../styles/Auth.module.scss";
import Link from "next/link";
import Image from "next/image";
import leftArrow from "../assets/icons/leftArrow.svg";
import ReactInputMask from "react-input-mask";
import Checkbox from "@mui/material/Checkbox";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  ForgotPasswordCheckCodeDto,
  forgotPasswordUserCheckCode,
  forgotPasswordUserSendCode,
} from "../redux/products/auth.slice";
import { useRouter } from "next/router";
import AuthCarousel from "../components/AuthCarousel/AuthCarousel";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/material";
import loginImg from "../assets/images/loginImg.png";
import Loader from "../components/Loader/Loader";

const Schema = yup.object({
  code: yup.string().required("Введите пароль!"),
});

function Reset_password() {
  const { t } = useTranslation();
  const [checkbox, setCheckbox] = useState(false);
  const dispatch = useAppDispatch();
  const { username } = useAppSelector((state) => state.auth);

  const router = useRouter();

  const initialValues: ForgotPasswordCheckCodeDto = {
    username: username,
    code: "",
  };

  const [seconds, setSeconds] = useState(59);

  React.useEffect(() => {
    setTimeout(() => {
      setSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);
  }, [seconds]);

  const handleSubmit = (values: ForgotPasswordCheckCodeDto, helpers: any) => {
    dispatch(forgotPasswordUserCheckCode({ username, code: values.code }))
    helpers.reset();
  };

  const checkInput = async () => {
    await dispatch(forgotPasswordUserSendCode({ username, type: "NA" }))
    setSeconds(59)
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
              <Link href="/forgot_password" passHref>
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
                    <b>{t("resetPassword.back")}</b>
                  </p>
                </div>
              </Link>
            </div>

            <p className={classes.wadeIn}>{t("resetPassword.title")}</p>

            <p className={classes.wadeIn2}>
              {t("resetPassword.sixSymbols")} {username}
            </p>

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
                handleBlur
              }) => {
                return (
                  <Form className={classes.auth_items__form__form}>
                    <ReactInputMask
                      mask="999999"
                      type="text"
                      onChange={handleChange}
                      value={values.code}
                      style={errors.code && touched.code ? { borderColor: "red" } : { marginBottom: 40 }}
                      name="code"
                      onBlur={handleBlur}
                      className={"mb-4"}
                    />

                    {errors.code && touched.code && (
                      <p className={"text-danger"}>{errors.code}</p>
                    )}

                    {/* <div className={"d-flex justify-content-between"}>
                      <div
                        className={classNames(
                          "d-flex align-items-center",
                          classes.checkbox
                        )}
                      >
                        <Checkbox
                          checked={checkbox}
                          color="primary"
                          className={"d-block"}
                          onClick={() => seconds === 0 && checkInput(values)}
                        />
                        <p style={{ fontSize: 14, padding: 0 }} className={"mt-3"}>
                          {t("resetPassword.getNewCode")}
                        </p>
                        <Typography style={{ padding: 0 }} sx={{ marginLeft: 1 }}>
                          00:{seconds}
                        </Typography>
                      </div>
                    </div> */}

                    {!errors.code ?
                      <button className={classes.btnForm}>
                        {t("resetPassword.reseting")}
                      </button>
                      :
                      <button className={classes.btnForm} disabled>
                        {t("resetPassword.reseting")}
                      </button>
                    }

                    <hr className={"m-0 mt-4"} />

                    <div className={"d-flex justify-content-between mt-3"}>
                      <div
                        className={classNames(
                          "d-flex align-items-center flex-column w-100",
                          classes.checkbox
                        )}
                      >
                        {seconds !== 0 ? (

                          //  <Checkbox
                          //   onChange={() => seconds === 0 && checkInput(values)}
                          //   checked={checkbox}
                          //   color="primary"
                          // /> 
                          <div className={"w-100 d-flex align-items-center justify-content-center"}>
                            <Typography sx={{ fontSize: 14, padding: 0 }}>
                              {t("resetPassword.getNewCode")}:
                            </Typography>
                            <Typography sx={{ padding: 0, marginLeft: 1 }}>
                              00:{seconds < 10 && "0"}{seconds}
                            </Typography>
                          </div>
                        ) : (
                          <div className={"d-flex align-items-center mt-1"}>
                            <Typography style={{ fontSize: 18 }} className={"p-0"}>Не пришел код?</Typography>
                            <Button onClick={checkInput} sx={{ fontSize: 18, fontWeight: 600 }} className={"p-1"}>Отправить код повторнно</Button>
                          </div>
                        )}
                      </div>
                    </div>


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

export default Reset_password;
