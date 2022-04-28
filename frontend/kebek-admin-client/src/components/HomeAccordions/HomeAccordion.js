import React from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "../../static/icons/down.svg";
import classNames from "classnames";
import classes from "../../Pages/Home/Home.module.scss";
import QrCode from "../QrCode/QrCode";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import Status from "../Status/Status";
import { localeContext } from "../../providers/LocaleProvider";
import { Link } from "react-router-dom";

function HomeAccordion({ data }) {
  const [qrValue] = React.useState("arg3n41ck");
  const isMobile = useMediaQuery("(max-width: 578px)");
  const isMd = useMediaQuery("(max-width: 690px)");
  const { locale } = React.useContext(localeContext);

  const [qrCode, setQrCode] = React.useState(null);

  React.useEffect(() => {
    const qrCodeObj = data?.documents.find((item) => item.type === "PS");
    setQrCode(qrCodeObj?.document);
  }, [data]);

  return (
    <div className={"mt-4"}>
      <Accordion
        style={{
          padding: 10,
          border: "1px solid #E0E0E0",
          boxShadow: "0px 3.5px 5.5px rgba(0, 0, 0, 0.02)",
          borderRadius: 4,
        }}
      >
        <AccordionSummary
          expandIcon={<img src={ExpandMoreIcon} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{
            alignItems: "baseline",
          }}
        >
          <div
            className={classNames(
              "w-100 d-flex justify-content-between",
              classes.applicationInfo
            )}
          >
            <div>
              <Typography
                sx={{ fontWeight: 600, fontSize: 20, marginTop: 0.5 }}
              >
                Заказ от
                {format(parseISO(`${data.createdAt}`), " d ", {
                  locale: ruLocale,
                })}
                {format(parseISO(`${data.createdAt}`), "MMMM", {
                  locale: ruLocale,
                })
                  .charAt(0)
                  .toUpperCase()}
                {format(parseISO(`${data.createdAt}`), "MMMM ", {
                  locale: ruLocale,
                }).slice(1)}
                <Link
                  to={`/info-about-application/${data.id}`}
                  style={{
                    color: "#219653",
                    cursor: "pointer",
                  }}
                >
                  {data.number}
                </Link>
              </Typography>
              <Typography
                className={" mt-2"}
                sx={{ fontSize: 18 }}
              ></Typography>
            </div>
            <StatusAccordionWrapper
              style={{
                marginRight: "10%",
                borderRadius: "3px",
                height: !isMd ? "4.5vh" : "3vh",
                width: !isMd ? "19%" : "100%",
                color: "#F2994A",
              }}
            >
              <Status statusName={data.status} />
            </StatusAccordionWrapper>
          </div>
        </AccordionSummary>
        <hr style={{ margin: 0 }} />
        <AccordionDetails style={{ padding: 0 }}>
          <div
            className={"w-100"}
            style={{ background: "#FAFCFA", padding: "20px 19px" }}
          >
            <Typography
              className={classes.elevatorTitle}
              sx={{ fontSize: 21, color: "#303030" }}
            >
              «
              {locale === "ru"
                ? data?.elevator.titleRu
                : data?.elevator.titleKk}
              »
            </Typography>
          </div>
          <div style={{ marginLeft: 10 }} className={"row mt-4 mb-2"}>
            <div className={"col-lg-6"}>
              <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
                {locale === "ru"
                  ? data.delivery.type.titleRu
                  : data.delivery.type.titleKk}{" "}
                {locale === "ru" && "из"}{" "}
                {locale === "ru"
                  ? data.elevator?.titleRu
                  : data.elevator?.titleKk}
              </Typography>
              {data.status === "DD" && (
                <Typography
                  className={"mt-2"}
                  sx={{ color: "#828282", fontSize: 18 }}
                >
                  {locale === "ru"
                    ? `${data.delivery.type.titleRu} ожидается`
                    : `${data.delivery.type.titleKk} күтілуде`}
                </Typography>
              )}
            </div>
            <div
              style={{ maxWidth: 338 }}
              className={classNames("d-flex align-items-center col-lg-6")}
            >
              <div
                className={
                  data.delivery.type.titleRu === "Доставка"
                    ? classes.progressLine
                    : classes.progressLineSm
                }
              >
                {data.delivery.type.titleRu === "Доставка" && (
                  <ProgressLineCircleTop
                    active={data.status === "PD" || data.status === "DD"}
                  />
                )}
                <ProgressLineCircleBottom active={data.status === "DD"} />
              </div>
              <div>
                {data.delivery.type.titleRu === "Доставка" && (
                  <div className={classNames(classes.bullit)}>
                    <Typography sx={{ color: "#092F33", fontSize: 18 }}>
                      {locale === "ru"
                        ? "Передано в доставку"
                        : "Жеткізу үшін тапсырылды"}
                    </Typography>
                    <Typography sx={{ color: "#4F4F4F", fontSize: 14 }}>
                      {locale === "ru"
                        ? "Происходит транспортировка товаров до указаного адреса"
                        : "Тауарлар көрсетілген мекенжайға тасымалданады"}
                    </Typography>
                  </div>
                )}
                <div className={classNames(classes.bullit, "mt-3")}>
                  <Typography sx={{ color: "#092F33", fontSize: 18 }}>
                    {locale === "ru"
                      ? `Ожидает${
                          data.delivery.type.titleRu === "Доставка" ? "ся" : ""
                        } ${data.delivery.type.titleRu} в `
                      : `${data.delivery.type.titleKk} ${
                          data.delivery.type.titleKk === "Жеткізу"
                            ? "жеткізу күтілуде"
                            : "күтуде"
                        } `}{" "}
                    {data.delivery.type.titleRu === "Доставка"
                      ? !!data?.address
                      : locale === "ru"
                      ? data.elevator?.titleRu
                      : data.elevator?.titleKk}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {qrCode && (
            <>
              <hr />
              <div
                style={
                  isMobile
                    ? { display: "flex", flexDirection: "column" }
                    : undefined
                }
                className={
                  "w-100 d-flex justify-content-between align-items-start"
                }
              >
                <div className={"d-flex align-items-center"}>
                  <img
                    style={{ maxWidth: 56, width: "100%", objectFit: "cover" }}
                    src={qrCode}
                    alt="qr code"
                  />
                  <div className={"ms-2"}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#092F33",
                      }}
                    >
                      {locale === "ru"
                        ? "Ваш QR-код пропуск"
                        : "Сіздің QR кодыңыз өту"}
                    </Typography>
                    <Typography>
                      {locale === "ru"
                        ? "Для получение товара предъявите QR-код сотруднику"
                        : "Тауарды алу үшін қызметкерге QR кодын көрсетіңіз"}
                    </Typography>
                  </div>
                </div>
                <QrCode
                  data={qrCode}
                  qrcodeTitle="Поделиться QR-кодом"
                  title="qrCode"
                />
              </div>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

const ProgressLineCircleTop = styled.div`
  position: absolute;
  top: 0;
  left: -7px;
  background: #ffffff;
  border: 3px solid #${(p) => (p.active ? "219653" : "e0e0e0")};
  border-radius: 50%;
  width: 16px;
  height: 16px;
`;
const ProgressLineCircleBottom = styled(ProgressLineCircleTop)`
  top: auto;
  bottom: 0;
`;

const StatusAccordionWrapper = styled.div`
  div {
    font-size: 16px;
    font-weight: 400;
    padding-top: -5px;
  }
`;

export default HomeAccordion;
