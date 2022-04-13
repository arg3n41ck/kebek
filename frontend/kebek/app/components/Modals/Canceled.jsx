import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import mod from "./Modals.module.scss";
import fifth from "../../assets/icons/ModalIcons/5.svg";
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

function Canceled() {
    const [open5, setOpen5] = useState(false);
    const handleOpen5 = () => setOpen5(true);
    const handleClose5 = () => setOpen5(false);

    return (
        <div>
            <p onClick={handleOpen5}>пятая модалка</p>
            <Modal
                open={open5}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={mod.box}>
                    <CloseIcon
                        onClick={handleClose5}
                        fontSize="large"
                        style={{
                            position: "absolute",
                            top: "33",
                            right: "30",
                            cursor: "pointer",
                        }}
                    />
                    <Image src={fifth} alt="first" />
                    <h1>Отменен!</h1>
                    <div className={mod.box_inner}>
                        <p>
                            Заказ № <span> 44761072-5676</span> отменен из-за <br />{" "}
                            отсутствия оплаты
                        </p>
                        <button>Назад</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Canceled;
