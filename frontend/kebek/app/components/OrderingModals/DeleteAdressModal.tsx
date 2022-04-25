import React, { memo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import classes from "./DeleteAdressModal.module.scss";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../redux/hooks";
import { deleteAddresses, fetchAddresses } from "../../redux/products/auth.slice";


export const deleteAdressModalCtx = React.createContext({
  openDelete: false,
  setOpenDelete: (bool: boolean) => { },
  id: null,
  setId: (id: number) => { }
});

export const DeleteAdressModalProvider: React.FC = ({ children }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [id, setId] = React.useState<any>()

  return (
    <deleteAdressModalCtx.Provider value={{ openDelete, setOpenDelete, id, setId }}>
      {children}
      <DeleteAdressModal>
        <DeleteAdressModalContent />
      </DeleteAdressModal>
    </deleteAdressModalCtx.Provider>
  );
};

const DeleteAdressModalContent_: React.FC = () => {
  const { setOpenDelete, id } = React.useContext(deleteAdressModalCtx);
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  function stylesMyText(text: any) {
    return {
      __html: text
    }
  }

  const handleDelete = async (id: any) => {
    await dispatch(deleteAddresses(id)).then(() => {
      dispatch(fetchAddresses())
      setOpenDelete(false)
    })

  }

  return (
    <>
      <div className={classes.modal_adress_delete_block}>
        <div className={classes.text}>
          <div className={classes.icon}>
            <CloseIcon
              style={{ width: "35px", height: "35px" }}
              onClick={() => setOpenDelete(false)}
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

const DeleteAdressModalContent = memo(DeleteAdressModalContent_);

const DeleteAdressModal: React.FC = ({ children }) => {
  const { openDelete, setOpenDelete } = React.useContext(deleteAdressModalCtx);
  const isMobile = useMediaQuery("(max-width: 697px)");

  // if (isMobile)
  //   return (
  //     <SwipeableDrawer
  //       style={{
  //         borderRadius: "20px 20px 0 0",
  //       }}
  //       anchor="bottom"
  //       open={openDelete}
  //       onClose={() => setOpenDelete(false)}
  //       onOpen={() => setOpenDelete(true)}
  //     >
  //       {children}
  //     </SwipeableDrawer>
  //   );

  return (
    <Modal
      className={classes.modal_block}
      style={{
        backgroundColor: "rgba(187, 187, 187, 0.5)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      open={openDelete}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={classes.box_modal}>
        <div className={classes.modal_container}>{children}</div>
      </Box>
    </Modal>
  );
};

export default DeleteAdressModal;
