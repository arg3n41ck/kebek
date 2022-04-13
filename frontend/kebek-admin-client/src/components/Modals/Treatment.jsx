import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import mod from "./Modals.module.scss";
import first from "../../static/icons/ModalIcons/1.svg";

export const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 580,
    width: "100%",
    height: "auto",
    borderRadius: "3px",
    bgcolor: "background.paper",
    border: "none",
    outline: "none",
    boxShadow: 24,
    padding: "57px 30px 30px 30px",
};

function Treatment() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div>
            <p onClick={handleOpen}>первая модалка</p>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={mod.box}>
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
                    <img src={first} alt="first" />
                    <h1>Спасибо за заказ!</h1>
                    <div className={mod.box_inner}>
                        <p>
                            Ваш заказ № <span> 44761072-5676</span> <br /> принят в
                            обработку{" "}
                        </p>
                        <button>На главную</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Treatment;
