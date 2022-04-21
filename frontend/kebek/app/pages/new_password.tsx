import React, { Suspense, useState } from "react";
import { Container } from "react-bootstrap";
import classNames from "classnames";
import classes from "../styles/Auth.module.scss";
import Link from "next/link";
import Image from "next/image";
import leftArrow from "../assets/icons/leftArrow.svg";
import loginImg from "../assets/images/loginImg.png";
import * as yup from "yup";
import { Form, Formik } from "formik";
import {
  NewPasswordDto,
  changeNewPassword,
} from "../redux/products/auth.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useRouter } from "next/router";
import AuthCarousel from "../components/AuthCarousel/AuthCarousel";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader/Loader";

function New_password() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [passwordShown, setPasswordShown] = useState(false);
  const key = useAppSelector((state) => state.auth.key);

  const Schema = yup.object({
    new_password: yup.string().required(t("newPassword.red")),
  });

  const initialValues: NewPasswordDto = {
    new_password: "",
    key: key,
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (values: NewPasswordDto, helpers: any) => {
    await dispatch(changeNewPassword({ new_password: values.new_password, key }))
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
              <Link href="/reset_password" passHref>
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

            <p className={classes.wadeIn}>{t("newPassword.newPass")}</p>

            <p className={classes.wadeIn2}>{t("newPassword.enterNew")}</p>

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
                    <div className={classNames("mb-3", classes.password)}>
                      <input
                        onChange={handleChange}
                        value={values.new_password}
                        type={passwordShown ? "text" : "password"}
                        onBlur={handleBlur}
                        name="new_password"
                        className={"mb-3"}
                      />
                      <i onClick={togglePasswordVisiblity} className={passwordShown ? classes.passwordControl2 : classes.passwordControl} />
                    </div>

                    {errors.new_password && touched.new_password && (
                      <p className={"text-danger"}>{errors.new_password}</p>
                    )}

                    {!errors.new_password ?
                      <button className={classes.btnForm}>
                        {t("newPassword.accept")}
                      </button>
                      :
                      <button className={classes.btnForm} disabled>
                        {t("newPassword.accept")}
                      </button>
                    }

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

export default New_password;
