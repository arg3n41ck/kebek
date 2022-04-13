import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import mod from "./Modals.module.scss";
import fourth from "../../static/icons/ModalIcons/4.svg";

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

function Invoiced() {
    const [open4, setOpen4] = useState(false);
    const handleOpen4 = () => setOpen4(true);
    const handleClose4 = () => setOpen4(false);

    return (
        <div>
            <p onClick={handleOpen4}>четвертая модалка</p>
            <Modal
                open={open4}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={mod.box}>
                    <CloseIcon
                        onClick={handleClose4}
                        fontSize="large"
                        style={{
                            position: "absolute",
                            top: "33",
                            right: "30",
                            cursor: "pointer",
                        }}
                    />
                    <img src={fourth} alt="first" />
                    <h1>Выставлен счет!</h1>
                    <div className={mod.box_inner}>
                        <p>
                            Вам выставлен счет для оплаты заказа, <br /> Вы можете скачать
                            его в личном кабинете kebek.kz{" "}
                        </p>
                        <button>Войти в личный кабинет</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Invoiced;
