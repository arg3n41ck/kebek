import React, { useState } from "react";
import { Button, useMediaQuery, Modal, Box } from "@mui/material";
import classes from "../../Pages/Home/Home.module.scss";
import QRCode from "qrcode.react";
import classNames from "classnames";
import CloseIcon from "@mui/icons-material/Close";
import copy from "../../static/icons/copy.svg";
import qr from "./QrCode.module.scss";

import telegram from "../../static/icons/telegram.svg";
import twitter from "../../static/icons/twitter.svg";
import whatsapp from "../../static/icons/whatsapp.svg";
import facebook from "../../static/icons/facebook.svg";
import gmail from "../../static/icons/gmail.svg";

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
} from "react-share";

import { toast } from "react-toastify";
import { SaveClipboardInfo } from "../../Pages/Application/ApplicationItem";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 444,
  width: "100%",
  height: "auto",
  borderRadius: "3px",
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  boxShadow: 24,
  padding: "57px 30px 30px 30px",
};

function QrCode({ data, title, handleClose1, qrcodeTitle }) {
  const isTablet = useMediaQuery("(max-width: 768px)");
  const [showInfo, setShowInfo] = React.useState(false);
  const [link, setLink] = React.useState(!!data && data?.documents[0].document);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleClose1(null);
  };
  const [copyText, setCopyText] = useState(!!link && link.slice(0, 35));

  const toggleShowInfo = (arg) => {
    navigator.clipboard.writeText(link);
    setShowInfo(arg);
  };

  return (
    <div
      className={classNames(
        classes.qrCodeInfo,
        "d-flex justify-content-between align-items-start"
      )}
    >
      {showInfo && <SaveClipboardInfo toggleShow={toggleShowInfo} />}
      <div className={classNames(classes.qrCodeButton, "d-flex")}>
        {title === "applicationItem" ? (
          <Button
            sx={{
              fontSize: 16,
              padding: 0,
              color: "rgb(9, 47, 51)",
              textTransform: "none",
            }}
            onClick={handleOpen}
          >
            Поделиться
          </Button>
        ) : (
          <Button
            sx={{
              fontSize: 18,
              padding: 0,
              textTransform: "none",
            }}
            onClick={handleOpen}
            color="success"
          >
            Поделиться
          </Button>
        )}
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className={qr.box}>
            <CloseIcon
              onClick={handleClose}
              fontSize="large"
              style={{
                position: "absolute",
                top: "33",
                right: "30",
                cursor: "pointer",
              }}
            />
            {/* <QRCode
              id="qr-gen"
              value={qrValue}
              size={200}
              level={"H"}
              includeMargin={true}
            /> */}
            <h1>Поделиться</h1>
            <p>{!!qrcodeTitle && qrcodeTitle}</p>
            <div className={qr.copy_div}>
              <p>{!!copyText && copyText}...</p>
              <img
                style={{ cursor: "pointer" }}
                onClick={() => setShowInfo(true)}
                src={copy}
                alt="copy"
              />
            </div>
            <h6>Поделиться</h6>
            <div className={qr.del}>
              <WhatsappShareButton url={!!link && link}>
                <img src={whatsapp} size={32} style={{ borderRadius: 3 }} />
              </WhatsappShareButton>
              <FacebookShareButton url={!!link && link}>
                <img src={facebook} size={32} style={{ borderRadius: 3 }} />
              </FacebookShareButton>
              <TelegramShareButton url={!!link && link}>
                <img src={telegram} size={32} style={{ borderRadius: 3 }} />
              </TelegramShareButton>
              <TwitterShareButton url={!!link && link}>
                <img src={twitter} size={32} style={{ borderRadius: 3 }} />
              </TwitterShareButton>
              {/* <EmailShareButton url={link}>
                <img src={gmail} size={32} style={{ borderRadius: 3 }} />
              </EmailShareButton> */}
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default QrCode;
