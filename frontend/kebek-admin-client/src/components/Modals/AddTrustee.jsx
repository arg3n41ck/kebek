import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import mod from "./Modals.module.scss";
import third from "../../static/icons/ModalIcons/3.svg";

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


function AddTrustee() {
    const [open3, setOpen3] = useState(false);
    const handleOpen3 = () => setOpen3(true);
    const handleClose3 = () => setOpen3(false);

    return (
        <div>
            <p onClick={handleOpen3}>третья модалка</p>
            <Modal
                open={open3}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={mod.box}>
                    <CloseIcon
                        onClick={handleClose3}
                        fontSize="large"
                        style={{
                            position: "absolute",
                            top: "33",
                            right: "30",
                            cursor: "pointer",
                        }}
                    />
                    <img src={third} alt="first" />
                    <h1>Добавьте доверенное лицо!</h1>
                    <div className={mod.box_inner}>
                        <p>
                            Вам необходимо добавить доверенное <br /> лицо для получения
                            товара{" "}
                        </p>
                        <button>+ Добавить</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default AddTrustee;
