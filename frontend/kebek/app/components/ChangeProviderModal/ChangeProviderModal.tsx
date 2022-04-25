import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";

import classes from "./ChangeProviderModal.module.scss";
import {
  addProductToCart,
  clearCart
} from "../../redux/products/cart.slice";
import { useDispatch } from "react-redux";
import { IProductV2 } from "../../types/products";

interface IOpenChange {
  product: IProductV2 | null,
  status: boolean,
}

interface ModalCtxTypes {
  openChange: IOpenChange,
  setOpenChange: ({ product, status }: IOpenChange) => void
}

export const changeProviderModalCtx = React.createContext<ModalCtxTypes>({
  openChange: {
    product: null,
    status: false,
  },
  setOpenChange: ({ }: IOpenChange) => {
  },
});

export const ChangeProviderModalProvider: React.FC = ({ children }) => {
  const [openChange, setOpenChange] = React.useState<{ product: null | IProductV2, status: boolean }>({
    product: null,
    status: false
  });
  return (
    <changeProviderModalCtx.Provider value={{ openChange, setOpenChange }}>
      {children}
      <ChangeProviderModal>
        <ChangeProviderModalContent />
      </ChangeProviderModal>
    </changeProviderModalCtx.Provider>
  );
};

const ChangeProviderModalContent: React.FC = () => {
  const { setOpenChange, openChange } = React.useContext(
    changeProviderModalCtx
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className={classes.modal_adress_delete_block}>
        <div className={classes.text}>
          <div className={classes.icon}>
            <CloseIcon
              style={{ width: "35px", height: "35px" }}
              onClick={() => setOpenChange({ product: null, status: false })}
            />
          </div>
          <p className={classes.title}> Внимание! </p>
          <div className={classes.content_block}>
            <div className={classes.sure}>
              При смене поставщика Ваша корзина будет полностью очищена. Вы
              действительно хотите сменить?
            </div>
            <div className="col-12 text-center">
              <button
                onClick={() => {
                  dispatch(clearCart());
                  !!openChange.product && dispatch(addProductToCart(openChange.product))
                  setOpenChange({ product: null, status: false })
                }}
                className={classes.button__delete}
              >
                <b>Очистить</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ChangeProviderModal: React.FC = ({ children }) => {
  const { openChange, setOpenChange } = React.useContext(
    changeProviderModalCtx
  );
  const isMobile = useMediaQuery("(max-width: 697px)");

  // if (isMobile)
  //   return <div>
  //     <SwipeableDrawer
  //       style={{
  //         borderRadius: "20px 20px 0 0",
  //       }}
  //       anchor="bottom"
  //       open={openChange.status}
  //       onClose={() => setOpenChange({ product: null, status: false })}
  //       onOpen={() => setOpenChange({ product: null, status: true })}
  //     >
  //       {children}
  //     </SwipeableDrawer>
  //   </div>


  return (
    <Modal
      className={classes.modal_block}
      style={{
        backgroundColor: "rgba(187, 187, 187, 0.5)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      open={openChange.status}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={classes.box_modal}>
        <div className={classes.modal_container}>{children}</div>
      </Box>
    </Modal>
  );
};

export default ChangeProviderModal;
