import React, { Suspense, useState } from "react";
import { Container } from "react-bootstrap";
import classNames from "classnames";
import classes from "../styles/Auth.module.scss";
import Link from "next/link";
import Image from "next/image";
import leftArrow from "../assets/icons/leftArrow.svg";
import { Formik, Form } from "formik";
import * as yup from "yup";
import loginImg from "../assets/images/loginImg.png";
import {
  changePassword,
  ChangePasswordDto,
} from "../redux/products/auth.slice";
import { useAppDispatch } from "../redux/hooks";
import AuthCarousel from "../components/AuthCarousel/AuthCarousel";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader/Loader";

const initialValues: ChangePasswordDto = {
  old_password: "",
  new_password: "",
};

function Change_new_password() {
  const { t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);
  const passwordShown2 = false;
  const dispatch = useAppDispatch();

  const Schema = yup.object({
    old_password: yup.string().required(t("changeNewPassword.old")),
    new_password: yup.string().required(t("Пожалуйста, заполните указанные поля")),
    // new_password: yup.string().required(t("changeNewPassword.new")),
  });

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (values: ChangePasswordDto) => {
    await dispatch(changePassword(values));
  };

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

            <p className={classes.wadeIn2}>
              {t("changeNewPassword.instruction")}
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
                handleBlur,
                // handleSubmit,
              }) => {
                return (
                  <Form className={classes.auth_items__form__form}>
                    <div className={classNames("mb-3", classes.password)}>
                      <input
                        onChange={handleChange}
                        value={values.old_password}
                        type={passwordShown ? "text" : "password"}
                        onBlur={handleBlur}
                        name="old_password"
                        style={errors.old_password && touched.old_password ? { borderColor: "red" } : undefined}
                      />
                      <i onClick={togglePasswordVisiblity} className={passwordShown ? classes.passwordControl2 : classes.passwordControl} />
                    </div>

                    {errors.old_password && touched.old_password && (
                      <p className={"text-danger"}>{errors.old_password}</p>
                    )}

                    <div className={classNames("mb-3", classes.password2)}>
                      <input
                        onChange={handleChange}
                        value={values.new_password}
                        type={passwordShown2 ? "text" : "password"}
                        onBlur={handleBlur}
                        name="new_password"
                        style={errors.new_password && touched.new_password ? { borderColor: "red" } : { marginBottom: 40 }}
                      />
                      <i onClick={togglePasswordVisiblity} className={passwordShown ? classes.passwordControl2 : classes.passwordControl} />
                    </div>

                    {(errors.new_password && touched.new_password || errors.old_password && touched.old_password) && (
                      <p className={"text-danger"}>{errors.new_password}</p>
                    )}

                    <button className={classes.btnForm}>
                      {t("changeNewPassword.save")}
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

export default Change_new_password;
