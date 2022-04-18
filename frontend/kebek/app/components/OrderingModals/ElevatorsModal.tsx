import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";

import ElevatorRectangle from "../ElevatorRectangle/ElevatorRectangle";
import classes from "./ElevatorsModal.module.scss";

export const addressesModalCtx = React.createContext({
  isOpen: false,
  setIsOpen: (bool: boolean) => {},
});

export const AddressesModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <addressesModalCtx.Provider value={{ isOpen, setIsOpen }}>
      {children}
      <AddressesModal>
        <AddressesModalContent />
      </AddressesModal>
    </addressesModalCtx.Provider>
  );
};

const AddressesModalContent: React.FC = () => {
  const { isOpen, setIsOpen } = React.useContext(addressesModalCtx);
  return (
    <>
      <div className={classes.modal_block}>
        <div className={classes.text}>
          <div className={classes.icon}>
            <CloseIcon
              style={{ width: "30px", height: "30px" }}
              onClick={() => setIsOpen(false)}
            />
          </div>
          <p className={classes.title}> Ближайшие элеваторы</p>
          <p className={classes.choose_adress}>
            Выберете адрес ближайшего обсуживающего ваш город элеватор
          </p>
        </div>
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <ElevatorRectangle key={i + "-elevator"} />
          ))}
      </div>
    </>
  );
};

const AddressesModal: React.FC = ({ children }) => {
  const { isOpen, setIsOpen } = React.useContext(addressesModalCtx);
  const isMobile = useMediaQuery("(max-width: 697px)");

  if (isMobile)
    return (
      <SwipeableDrawer
        style={{
          borderRadius: "20px 20px 0 0",
        }}
        anchor="bottom"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
      >
        {children}
      </SwipeableDrawer>
    );

  return (
    <Modal
      className={classes.modal_block}
      style={{
        backgroundColor: "rgba(187, 187, 187, 0.5)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      open={isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={classes.box_modal}>
        <div className={classes.modal_container}>
          {children}
        </div>
      </Box>
    </Modal>
  );
};

export default AddressesModal;

