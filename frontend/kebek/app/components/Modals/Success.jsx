import React, { useState } from "react";
import classes from "./Modals.module.scss";
import { Typography, Modal, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import success from "../../assets/icons/ModalIcons/success.svg"
import Image from "next/image"

export const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 780,
    width: "100%",
    height: "auto",
    borderRadius: "3px",
    bgcolor: "background.paper",
    border: "none",
    outline: "none",
    boxShadow: 24,
    padding: "30px 30px 30px 30px",
};

export default function Success() {
    const [open9, setOpen9] = useState(false);
    const handleOpen9 = () => setOpen9(true);
    const handleClose9 = () => setOpen9(false);

    const [open3, setOpen3] = useState(false);
    const handleOpen3 = () => setOpen3(true);
    const handleClose3 = () => setOpen3(false);

    const [name, setName] = useState('')
    const names = (e) => {
        setName(e.target.value)
    }

    return (
        <div style={{ maxWidth: 593, width: "100%", marginLeft: 20 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                Добавьте доверенное лицо
            </Typography>
            <p>
                Ваш заказ скоро будет доставлен, для его получения добавьте пожалуйста
                доверенно лицо
            </p>
            <a
                href={"#"}
                style={{ color: "#219653", fontSize: 16, textDecoration: "underline" }}
                onClick={handleOpen9}
            >
                Перейти
            </a>
            <Modal
                open={open9}
                onClose={handleClose9}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={classes.box}>
                    <CloseIcon
                        onClick={handleClose9}
                        fontSize="large"
                        style={{
                            position: "absolute",
                            top: "33",
                            right: "30",
                            cursor: "pointer",
                        }}
                    />

                    <h1>Добавить доверенное лицо</h1>
                    <div className={classes.inner}>
                        <input type="text" placeholder="Введите ФИО доверенного лица" />
                        <input type="text" placeholder="Ввведите номер доверенности" />
                        <div className={classes.date}>
                            <label>Действительно с:</label>
                            <input id="date" type="date" defaultValue="cwsulcka" />
                        </div>
                        <div className={classes.date}>
                            <label>Действительно по:</label>
                            <input id="date" type="date" defaultValue="cwsulcka" />
                        </div>
                        <button onClick={handleOpen3}>Добавить</button>
                    </div>
                </Box>
            </Modal>

            <Modal
                open={open3}
                onClose={handleClose3}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={classes.box_success}>
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
                    <Image src={success} alt="success" />
                    <h1>Добавлено доверенно лицо!</h1>
                    <div className={classes.inner_success}>
                        <p>Вы успешно добавили доверенное лицо</p>
                        <p className={classes.name}>{name}</p>
                        <button onClick={handleClose3}>Назад</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
};