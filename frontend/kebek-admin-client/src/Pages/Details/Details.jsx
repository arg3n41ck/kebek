import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import det from "./Details.module.scss";
import arrow from "../../static/icons/left-arrow 1.svg";
import QRCode from "qrcode.react";
import copyIcon from "../../static/icons/copy.svg";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import { applications } from "../Application/Appliaction";
import { $api } from "../../services/api";
import { format, parseISO } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import {
  download,
  NameFile,
  SaveClipboardInfo,
} from "../Application/ApplicationItem";
import { Menu, MenuItem, Typography, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import { Box } from "@mui/system";
import copy from "copy-to-clipboard";
import QrCode from "../../components/QrCode/QrCode";
import classNames from "classnames"

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showInfo, setShowInfo] = React.useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [anchorEl, setAnchorEl] = useState({});
  const isMedium = useMediaQuery('(max-width: 992px)');
  const isSmall = useMediaQuery('(max-width: 578px)');

  const handleClose = (index) => {
    setAnchorEl((prev) => ({ ...prev, [index]: null }));
  };

  const handleClickListItem = (event, index) => {
    setAnchorEl((prev) => ({ ...prev, [index]: event.target }));
  };

  const toggleShowInfo = (arg) => {
    setShowInfo(arg);
  };

  const downloadAllDocuments = () => {
    data.documents
      .filter((item) => item.type !== "PS")
      .forEach((item) => {
        window.open(item.document);
      });
  };


  const downloadHandler = (value) => {
    download(value);
  };

  useEffect(() => {
    const newOpenAdditional = {};
    data?.documents
      .filter((item) => item.type !== "PS")
      .forEach((_, i) => {
        newOpenAdditional[i] = false;
      });
    // setOpenAdditional(newOpenAdditional);
  }, []);

  React.useEffect(async () => {
    const res = await $api.get(`orders/${id}/`);
    setData(res.data);
  }, []);

  useEffect(() => {
    const qrCodeObj = data?.documents.find((item) => item.type === "PS");
    setQrCode(qrCodeObj?.document);
  }, [data]);

  if (!data) return null;
  return (
    <>
      {showInfo && <SaveClipboardInfo toggleShow={toggleShowInfo} />}
      <div className={det.container}>
        <div onClick={() => navigate(-1)} className={det.back}>
          <img src={arrow} alt="" />
          <h5>Назад</h5>
        </div>
        <h1>
          Информация о{" "}
          {data?.delivery.type.titleRu === "Самовывоз" ? "заявке" : "доставке"}
        </h1>
        <div style={!!data?.documents.length ? !isMedium && { display: "grid", gridTemplateColumns: "1fr 1fr" } : !isMedium && { display: "grid", gridTemplateColumns: "1fr" }} className={det.container_inner}>
          <div style={!!data?.documents.length ? !isMedium && { width: "95%" } : { width: "100%" }} className={det.container_inner_left}>
            <div style={isSmall ? { display: "flex", flexDirection: "column", alignItems: "start" } : null} className={det.container_inner_left_top}>
              <h5>
                {" "}
                Заявка от
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
              </h5>
              <p>{data.number}</p>
            </div>
            <div
              style={{ marginBottom: 36 }}
              className={det.container_inner_left_center}
            >
              <p onClick={() => download(qrCode)}>Поставщик</p>
              <h6>«{data?.elevator.titleRu}»</h6>
            </div>
            <div className={det.container_inner_left_bottom}>
              {data?.history.length === 0 ? (
                <Typography
                  variant="h5"
                  sx={{ textAlign: "center", marginTop: 7 }}
                >
                  История чиста!
                </Typography>
              ) : (
                <Box>
                  {data?.history.map((item, index) => (
                    <Box
                      sx={{
                        display: "flex",
                        position: "relative",
                        margin: "0 !important",
                        padding: "15px 0",
                      }}
                      className={det.container_inner_left_bottom_content}
                    >
                      <Circle index={index + 1 === data?.history.length} />
                      <div>
                        <h5>{item.title}</h5>
                        <p>{item.content}</p>
                      </div>
                    </Box>
                  ))}
                </Box>
              )}
            </div>
          </div>

          <div className={det.container_inner_right}>
            {!!qrCode && (
              <div style={isMedium ? { marginTop: 30, display: "flex", flexDirection: "column" } : null} className={det.container_inner_right_first}>
                <div
                  style={{ display: "flex", alignItems: "center", maxWidth: 150 }}
                >
                  <img src={qrCode} style={{ maxWidth: 150 }} alt={"qr code"} />
                </div>
                <div style={isMedium ? { marginLeft: 15 } : null} className={det.container_inner_right_first_right}>
                  <h1>Ваш QR-код пропуск</h1>
                  <p>Для получение товара предъявите QR-код сотруднику</p>
                  <div className={det.copy}>
                    <p>{!isSmall ? !!qrCode && qrCode.slice(0, 35) : !!qrCode && qrCode.slice(0, 20)}...</p>
                    <Box>
                      <img
                        src={copyIcon}
                        onClick={() => {
                          setShowInfo(true);
                          copy(qrCode);
                        }}
                        alt="copy"
                      />
                    </Box>
                  </div>
                  <div className={classNames(det.buttons, "d-flex align-items-center")}>
                    <a
                      className={det.download}
                      download
                      target="_blank"
                      style={{ textAlign: "center" }}
                      href={qrCode}
                    >
                      Скачать
                    </a>
                    <QrCode data={!!data && data} title="info" qrcodeTitle="Для получение товара, предъявите QR-код сотруднику" />
                  </div>
                </div>
              </div>
            )}
            {!!data?.documents.length && (
              <div style={!qrCode ? { marginTop: 0 } : null} className={det.container_inner_right_second}>
                <div
                  className={det.second_inner}
                  style={{ borderBottom: "none" }}
                >
                  <h3>Документы</h3>
                  <p onClick={downloadAllDocuments}>Скачать все документы</p>
                </div>
                {data?.documents
                  .filter((item) => item.type !== "PS")
                  .map((item, i) => (
                    <div className={det.second_inner}>

                      {isSmall ? (
                        <div className={"d-flex flex-column align-items-start"}>
                          <h4>
                            {item.document === "WB" ? "Накладная" : "Счет на оплату"}
                          </h4>
                          <p>
                            <NameFile u={item.document} />{" "}
                          </p>
                        </div>
                      )
                        :
                        (
                          <>
                            <h4>
                              {item.document === "WB" ? "Накладная" : "Счет на оплату"}
                            </h4>
                            <p>
                              <NameFile u={item.document} />{" "}
                            </p>
                          </>
                        )}

                      <MoreVertSharpIcon
                        id={`lock-button-${i}`}
                        onClick={(e) => handleClickListItem(e, i)}
                        style={{ color: "#219653", cursor: "pointer" }}
                        sx={{ width: "30px !important", display: "inline-block" }}
                      />
                      <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl[i]}
                        open={!!anchorEl[i]}
                        onClose={() => handleClose(i)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        onClick={() => handleClose(i)}
                      >
                        <MenuItem>
                          <a
                            style={{ color: "#092F33" }}
                            target="_target"
                            href={item.document}
                          // download
                          >
                            Скачать
                          </a>
                        </MenuItem>
                        {/* <MenuItem
                        onClick={() => {
                          setShowInfo(true);
                          copy(item.document);
                        }}
                      >
                        Поделиться
                      </MenuItem> */}
                        <MenuItem>
                          <QrCode data={!!data && data} title="applicationItem" qrcodeTitle="Поделиться документом" />
                        </MenuItem>

                      </Menu>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Circle = styled.div`
  margin-right: 21px;
  margin-top: 7px;
  min-width: 16px;
  height: 16px;
  background: #ffffff;
  border: 3px solid #219653;
  border-radius: 50%;
  z-index: 3;
  &::before {
    content: "";
    position: absolute;
    bottom: -30px;
    left: 6.7px;
    height: 92%;
    width: ${(p) => (p.index ? "0" : "2px")};
    background: #e0e0e0;
    z-index: -1;
  }
`;

export default Details;
