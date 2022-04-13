import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import mod from "./Modals.module.scss";
import first from "../../assets/icons/ModalIcons/1.svg";
import Image from "next/image"
import Link from "next/link"

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

function Treatment({ open, handleClose, data }) {
    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className={mod.box}>
                    <Image src={first} alt="first" />
                    <h1>Спасибо за заказ!</h1>
                    <div className={mod.box_inner}>
                        <p>
                            Ваш заказ № <Link href={`/CL/application`} passHref><span style={{ cursor: "pointer" }}> {!!data?.number && data.number}</span></Link> <br /> принят в
                            обработку{" "}
                        </p>
                        <Link href={"/"} passHref>
                            <button>На главную</button>
                        </Link>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Treatment;
