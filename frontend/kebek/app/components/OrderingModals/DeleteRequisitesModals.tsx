import React, { memo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import classes from "./DeleteAdressModal.module.scss";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../redux/hooks";
import { fetchRequisites, deleteRequisites } from "../../redux/products/auth.slice";


export const deleteRequisitesModalCtx = React.createContext({
    openDeletRequisiteModal: false,
    setOpenDeletRequisiteModal: (bool: boolean) => { },
    id: null as null,
    setId: (id: number) => { }
});

export const DeleteRequisitesModalProvider: React.FC = ({ children }) => {
    const [openDeletRequisiteModal, setOpenDeletRequisiteModal] = React.useState(false)
    const [id, setId] = React.useState<any>()

    return (
        <deleteRequisitesModalCtx.Provider value={{ openDeletRequisiteModal, setOpenDeletRequisiteModal, id, setId }}>
            {children}
            <DeleteRequisitesModal>
                <DeleteRequisitesModalContent />
            </DeleteRequisitesModal>
        </deleteRequisitesModalCtx.Provider>
    );
};

const DeleteRequisitesModalContent_: React.FC = () => {
    const { setOpenDeletRequisiteModal, id } = React.useContext(deleteRequisitesModalCtx);
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    function stylesMyText(text: any) {
        return {
            __html: text
        }
    }

    const handleDelete = async (id: any) => {
        await dispatch(deleteRequisites(id)).then(() => {
            dispatch(fetchRequisites())
            setOpenDeletRequisiteModal(false)
        })

    }

    return (
        <>
            <div className={classes.modal_adress_delete_block}>
                <div className={classes.text}>
                    <div className={classes.icon}>
                        <CloseIcon
                            style={{ width: "35px", height: "35px" }}
                            onClick={() => setOpenDeletRequisiteModal(false)}
                        />
                    </div>
                    <p className={classes.title}> {t("ordering.accordions.accordion3.modals.deleteText.title1")} </p>
                    <div className={classes.content_block}>
                        <div dangerouslySetInnerHTML={stylesMyText(t("ordering.accordions.accordion3.modals.deleteText.title2"))} className={classes.sure} />
                        <div className="col-12 text-center">
                            <button onClick={() => handleDelete(id)} className={classes.button__delete}>
                                <b>{t("ordering.accordions.accordion3.modals.deleteText.title3")}</b>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const DeleteRequisitesModalContent = memo(DeleteRequisitesModalContent_);

const DeleteRequisitesModal: React.FC = ({ children }) => {
    const { setOpenDeletRequisiteModal } = React.useContext(deleteRequisitesModalCtx);
    const isMobile = useMediaQuery("(max-width: 697px)");

    // if (isMobile)
    //     return (
    //         <SwipeableDrawer
    //             style={{
    //                 borderRadius: "20px 20px 0 0",
    //             }}
    //             anchor="bottom"
    //             open={true}
    //             onClose={() => setOpenDeletRequisiteModal(false)}
    //             onOpen={() => setOpenDeletRequisiteModal(true)}
    //         >
    //             {children}
    //         </SwipeableDrawer>
    //     );

    return (
        <Modal
            className={classes.modal_block}
            style={{
                backgroundColor: "rgba(187, 187, 187, 0.5)",
                WebkitBackdropFilter: "blur(20px)",
            }}
            open={true}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.box_modal}>
                <div className={classes.modal_container}>{children}</div>
            </Box>
        </Modal>
    );
};

export default DeleteRequisitesModal;
