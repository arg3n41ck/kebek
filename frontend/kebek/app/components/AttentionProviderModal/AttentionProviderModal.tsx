
import React from 'react'
import classes from './AttentionProviderModal.module.scss'
import classNames from "classnames"
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/base/BackdropUnstyled';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 580,
    maxHeight: 480,
    bgcolor: 'background.paper',
    border: "none",
    borderRadius: "1px",
    boxShadow: 1,
    p: 4,
};

export default function AttentionProviderModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div style={{
            backgroundColor: "white",
            WebkitBackdropFilter: "blur(100px)",
            boxShadow: "inset 0 0 490px white"
        }}>
            <Button onClick={handleOpen}>Очистить корзину</Button>

            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} style={{
                }}>
                    <div className={classNames("row d-flex align-items-center justify-content-center flex-column", classes.modal__container)}>
                        <div className="col-1 offset-10 pt-0 my-0">
                            <CloseIcon onClick={handleClose} />
                        </div>
                        <div className="col-12 text-center">
                            <p className={classes.first__text}>Внимание!</p>
                        </div>
                        <div className="col-12 text-center" style={{ width: "80%" }}>
                            <p className={classes.second__text}>При смене поставщика Ваша корзина будет полностью очищена, Вы действительно хотите сменить?</p>
                        </div>
                        <div className="col-12 text-center">
                            <button className={classes.button__delete}>
                                <b>Очистить</b>
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

// const DeleteProductModal = () => {
//     return (
//         <div className={classNames("container-fluid d-flex align-items-center justify-content-center vh-100", classes.main__container)}>
//             <div className={classNames("row d-flex align-items-center justify-content-center flex-column", classes.modal__container)}>
//                 <div className="col-1 offset-10 pt-0 my-0">
//                     <CloseIcon />
//                 </div>
//                 <div className="col-12 text-center">
//                     <p className={classes.first__text}>Удаление товара</p>
//                 </div>
//                 <div className="col-12 text-center" style={{ width: "80%" }}>
//                     <p className={classes.second__text}>Вы действительно хотите удалить выбранные товары? Отменить действие будет невозможно</p>
//                 </div>
//                 <div className="col-12 text-center">
//                     <button className={classes.button__delete}>
//                         Удалить
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default DeleteProductModal
