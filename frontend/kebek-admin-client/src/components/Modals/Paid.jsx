import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import mod from "./Modals.module.scss";
import sixth from "../../static/icons/ModalIcons/6.svg";

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

function Paid() {
    const [open6, setOpen6] = useState(false);
    const handleOpen6 = () => setOpen6(true);
    const handleClose6 = () => setOpen6(false);

    return (
        <div>
            <p onClick={handleOpen6}>шестая модалка</p>
            <Modal
                open={open6}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={mod.box}>
                    <CloseIcon
                        onClick={handleClose6}
                        fontSize="large"
                        style={{
                            position: "absolute",
                            top: "33",
                            right: "30",
                            cursor: "pointer",
                        }}
                    />
                    <img src={sixth} alt="first" />
                    <h1>Оплачено!</h1>
                    <div className={mod.box_inner}>
                        <p>
                            Заказ № <span> 44761072-5676</span> оплачен <br />
                            Спасибо за использование системы Kebek!
                        </p>
                        <button>Войти в личный кабинет</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Paid;
