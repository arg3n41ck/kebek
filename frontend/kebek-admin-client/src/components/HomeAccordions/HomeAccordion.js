import React from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
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
                height: !isMobile ? "4.5vh" : "3vh",
                width: !isMobile ? "19%" : "100%",
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
              «{locale ? data?.elevator.titleRu : data?.elevator.titleKk}»
            </Typography>
          </div>
          <div style={{ marginLeft: 10 }} className={"row mt-4 mb-2"}>
            <div className={"col-lg-6"}>
              <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
                {data.delivery.type.titleRu} в{" "}
                {!!data.railwayStation && data.railwayStation.descriptionKk}
              </Typography>
              <Typography
                className={"mt-2"}
                sx={{ color: "#828282", fontSize: 18 }}
              >
                {locale
                  ? `${data.delivery.type.titleRu} ожидается`
                  : `${data.delivery.type.titleKk} күтілуде`}
              </Typography>
            </div>
            <div
              style={{ maxWidth: 338 }}
              className={classNames("d-flex align-items-center col-lg-6")}
            >
              <div className={classes.progressLine}>
                <ProgressLineCircleTop active={data.status === "PD"} />
                <ProgressLineCircleBottom active={data.status === "Оплачен"} />
              </div>
              <div>
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
                <div className={classNames(classes.bullit, "mt-3")}>
                  <Typography sx={{ color: "#092F33", fontSize: 18 }}>
                    {locale === "ru"
                      ? "Ожидает самовывоз в"
                      : "Алып кетуді күтуде"}{" "}
                    {data.elevator?.titleRu}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {data.pickup && (
            <>
              <hr />
              <img
                style={{ maxWidth: 78, width: "100%", objectFit: "cover" }}
                src={qrCode}
                alt="qr code"
              />
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
