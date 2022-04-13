import React, { useState } from "react";
import pr from "../../Pages/Profile/Profile.module.scss";
import classNames from "classnames";
import Typography from "@mui/material/Typography";
import Settings from "../../components/ProfileItems/Settings";
import { profileContext } from "../../Context/ProfileContext";
import { Formik, Form } from "formik";
import * as yup from "yup";
// import ExpandMoreIcon from '@mui/icons-material/ArrowForwardIosSharpIcon ';
import ExpandMoreIcon from "@mui/icons-material/ArrowForwardIosSharp";
import chevron from "../../static/icons/chevron.svg";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { localeContext } from "../../providers/LocaleProvider";

const initialValues = {
  content: "",
};

const Schema = yup.object({
  content: yup.string().required("Введите текст обращения!"),
});

function Support({ profileInfo }) {
  const { postSupport } = React.useContext(profileContext);
  const [expanded, setExpanded] = useState(false);
  const { t } = React.useContext(localeContext);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = async (values) => {
    await postSupport(values);
  };

  return (
    <div className={classNames(pr.container_inner_right, pr.main)}>
      <div className={pr.main_top}>
        <h2>{t.profile.support.nav}</h2>
        <p>{t.profile.support.title}</p>
      </div>
      <div className={classNames(pr.main_bottom)}>
        <div className={pr.right_first}>
          <Box
            sx={{
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            {profileInfo.map((item) => (
              <a href={"#"}>
                <div
                  className={
                    classNames(pr.supportLink, "d-flex align-items-center justify-content-between mb-4")
                  }
                >
                  <div>
                    <Typography
                      sx={{
                        width: "100%",
                        flexShrink: 0,
                        lineHeight: "140%",
                        fontSize: 18,
                        color: "#092F33",
                        fontWeight: 600,
                      }}
                    >
                      {item.title}
                    </Typography>
                  </div>
                  <img src={chevron} />
                </div>
              </a>
            ))}
          </Box>

          <SendAppeal />
        </div>

        {/*//? Settings Profile */}
        <Settings />
      </div>
    </div>
  );
}

export default Support;

export const SendAppeal = ({ onCl }) => {
  const { postSupport } = React.useContext(profileContext);
  const { t } = React.useContext(localeContext);

  const handleSubmit = async (values) => {
    await postSupport(values);
    onCl();
  };

  return (
    <div className={pr.comment}>
      <h2>{t.profile.support.supportInfo.title1}</h2>
      <p>{t.profile.support.supportInfo.title2}</p>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values).then(() => {
              resetForm({
                content: "",
              });
            });
          }}
          validationSchema={Schema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => {
            return (
              <Form className={pr.comment}>
                <div style={{ position: "relative", marginBottom: 40 }} >
                  <textarea
                    name="content"
                    id=""
                    cols="30"
                    rows="20"
                    placeholder={t.profile.support.supportInfo.inputPlaceholder}
                    value={values.content}
                    onChange={handleChange}
                    style={errors.content && touched.content ? { border: "1px solid red", marginBottom: 0 } : { marginBottom: 38 }}
                    onBlur={handleBlur}
                    className={'textarea'}
                  />
                  <div style={{ position: "absolute", bottom: 0 }}>
                    {errors.content && touched.content && (
                      <p className={"text-danger"}>{errors.content}</p>
                    )}
                  </div>
                </div>
                <Button type="submit" sx={{ width: "100%" }}>
                  {t.profile.support.supportInfo.button}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
