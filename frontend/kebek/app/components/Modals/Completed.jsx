import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import mod from "./Modals.module.scss";
import seventh from "../../assets/icons/ModalIcons/7.svg";
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

function Completed() {
    const [open7, setOpen7] = useState(false);
    const handleOpen7 = () => setOpen7(true);
    const handleClose7 = () => setOpen7(false);


    return (
        <div>
            <p onClick={handleOpen7}>седьмая модалка</p>
            <Modal
                open={open7}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={mod.box}>
                    <CloseIcon
                        onClick={handleClose7}
                        fontSize="large"
                        style={{
                            position: "absolute",
                            top: "33",
                            right: "30",
                            cursor: "pointer",
                        }}
                    />
                    <Image src={seventh} alt="first" />
                    <h1>Завершен!</h1>
                    <div className={mod.box_inner}>
                        <p>
                            Заказ № <span> 44761072-5676</span> успешно получен
                        </p>
                        <button>На главную</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Completed;
