import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import mod from "./Modals.module.scss";
import second from "../../assets/icons/ModalIcons/2.svg";
import Image from "next/image"

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

function NotPaid() {
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);
    return (
        <div>
            <p onClick={handleOpen2}>вторая модалка</p>
            <Modal
                open={open2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={mod.box}>
                    <CloseIcon
                        onClick={handleClose2}
                        fontSize="large"
                        style={{
                            position: "absolute",
                            top: "33",
                            right: "30",
                            cursor: "pointer",
                        }}
                    />
                    <Image src={second} alt="first" />
                    <h1>Не оплачено!</h1>
                    <div className={mod.box_inner}>
                        <p>
                            Ваш заказ № <span> 44761072-5676</span> <br /> ожидает оплаты{" "}
                        </p>
                        <button>Повторить</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default NotPaid;
