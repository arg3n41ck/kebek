import React from 'react'
import classes from './DeleteProductModal.module.scss'
import classNames from "classnames"
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { cartSelectors, removeProductsFromCart } from '../../redux/products/cart.slice';
import { SwipeableDrawer, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 580,
  width: "80%",
  maxHeight: 480,
  bgcolor: 'background.paper',
  border: "none",
  borderRadius: "1px",
  boxShadow: 1,
  p: 4,
};


type Props = {
  data: { id: number, checked: boolean }[]
}

export default function DeleteProductsModal({ data }: Props): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const cart = useAppSelector((state) => cartSelectors.selectAll(state));
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const checkedForDeleting: any = !!data.length && data.filter(({ checked }: any) => checked)
  const handleDelete = () => {
    const idsOfCardsForDeleting = checkedForDeleting.map(({ id }: any) => id)
    dispatch(removeProductsFromCart(idsOfCardsForDeleting));
    setOpen(false);
  }
  const { t } = useTranslation()

  function stylesMyText(text: any) {
    return {
      __html: text
    }
  }

  const isMobile = useMediaQuery('(max-width: 697px)');


  // if (isMobile && checkedForDeleting.length) return (
  //   <div style={{
  //     backgroundColor: "white",
  //     WebkitBackdropFilter: "blur(100px)",
  //     boxShadow: "inset 0 0 490px white",
  //   }}>
  //     {cart.length ?
  //       (
  //         <Button
  //           style={{
  //             background: "#ffffff",
  //             height: "24px",
  //             borderRadius: "3.01818px",
  //             width: "100%",
  //             border: "none",
  //             display: "flex !important",
  //             alignItems: "center",
  //             color: "#219653",
  //             fontWeight: "500",
  //             fontSize: "16px",
  //             marginRight: 0
  //           }} onClick={handleOpen}>{t("cart.buttons.deleteById")}</Button>
  //       )
  //       :
  //       (
  //         <Button
  //           disabled
  //           style={{
  //             background: "#ffffff",
  //             height: "24px",
  //             borderRadius: "3.01818px",
  //             width: "100%",
  //             border: "none",
  //             display: "flex !important",
  //             alignItems: "center",
  //             color: "#219653",
  //             fontWeight: "500",
  //             fontSize: "16px",
  //             marginRight: 0
  //           }}>{t("cart.buttons.deleteById")}</Button>
  //       )}

  //     <SwipeableDrawer
  //       style={{
  //         borderRadius: "20px 20px 0 0",
  //       }
  //       }
  //       anchor="bottom"
  //       open={open}
  //       onClose={() => setOpen(false)}
  //       onOpen={() => setOpen(true)}
  //     >
  //       <div className={classes.modal_adress_delete_block}>
  //         <div className={classes.text}>
  //           <div className={classes.icon}>
  //             <CloseIcon style={{ width: "35px", height: "35px" }} onClick={() => setOpen(false)} />
  //           </div>
  //           <p className={classes.title}> {t("allProducts.cart.delete.title1")} </p>
  //           <div className={classes.content_block}>
  //             <div dangerouslySetInnerHTML={stylesMyText(t("allProducts.cart.delete.title2"))} className={classes.sure}></div>
  //             <div className="col-12 text-center">
  //               <button onClick={handleDelete} className={classes.button__delete}>
  //                 <b>{t("allProducts.cart.delete.button")}</b>
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </SwipeableDrawer>
  //   </div>
  // )
  return (

    <div style={{
      backgroundColor: "white",
      WebkitBackdropFilter: "blur(100px)",
      boxShadow: "inset 0 0 490px white",
    }}>
      {cart.length && checkedForDeleting.length ?
        (
          <Button
            style={{
              background: "#ffffff",
              height: "24px",
              borderRadius: "3.01818px",
              width: "100%",
              border: "none",
              display: "flex !important",
              alignItems: "center",
              color: "#219653",
              fontWeight: "500",
              fontSize: "16px",
              marginRight: 0
            }} onClick={handleOpen}>{t("cart.buttons.deleteById")}</Button>
        )
        :
        (
          <Button
            disabled
            style={{
              background: "#ffffff",
              height: "24px",
              borderRadius: "3.01818px",
              width: "100%",
              border: "none",
              display: "flex !important",
              alignItems: "center",
              color: "gray",
              fontWeight: "500",
              fontSize: "16px",
              marginRight: 0
            }}>{t("cart.buttons.deleteById")}</Button>
        )}

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={classNames("row d-flex align-items-center justify-content-center flex-column", classes.modal__container)}>
            <div className="col-1 offset-10 pt-0 my-0">
              <CloseIcon onClick={handleClose} />
            </div>
            <div className="col-12 text-center">
              <p className={classes.first__text}>{t("allProducts.cart.delete.title1")}</p>
            </div>
            <div className="col-12 text-center" style={{ width: "80%" }}>
              <p dangerouslySetInnerHTML={stylesMyText(t("allProducts.cart.delete.title2"))} className={classes.second__text}></p>
            </div>
            <div className="col-12 text-center">
              <button className={classes.button__delete} onClick={handleDelete}>
                <b>{t("allProducts.cart.delete.button")}</b>
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}