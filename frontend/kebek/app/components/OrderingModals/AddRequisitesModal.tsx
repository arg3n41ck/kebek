import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import classes from './AddRequisitesModal.module.scss';
import classNames from "classnames"
import { useTranslation } from 'react-i18next';
import { createRequisites, fetchRequisites } from '../../redux/products/auth.slice';
import { useAppDispatch } from '../../redux/hooks';
import { Formik, Form } from "formik";
import * as yup from "yup";


export const requisitesAddModalCtx = React.createContext({
    open: false,
    setOpen: (bool: boolean) => { },
    setData: (data: any) => { },
    data: null
});

export const RequisitesAddModalProvider: React.FC = ({ children }) => {
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState<any>();

    return (
        <requisitesAddModalCtx.Provider value={{ open, setOpen, setData, data }}>
            {children}
            < RequisitesAddModal >
                <RequisitesAddModalContent />
            </RequisitesAddModal>
        </requisitesAddModalCtx.Provider>
    )
}

const initialValues = {
    title: "",
    bin: "",
    bik: "",
    checking_account: ""
};

const Schema = yup.object({
    title: yup.string().required("Введите наименование!"),
    bin: yup.string().required("Введите БИН!"),
    bik: yup.string().required("Введите БИК!"),
    checking_account: yup.string().required("Введите расчестный счёт!"),
});


const RequisitesAddModalContent: React.FC = () => {
    const { setOpen } = React.useContext(requisitesAddModalCtx);
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const handleSubmit = async (values: any) => {
        await dispatch(createRequisites(values)).then(() => {
            dispatch(fetchRequisites())
            setOpen(false)
        })
    }

    return (
        <>
            <div className={classes.modal_requisites_add_block}>
                <div className={classes.text}>
                    <div className={classes.icon}>
                        <CloseIcon style={{ width: "35px", height: "35px" }} onClick={() => setOpen(false)} />
                    </div>
                    <p className={classes.title}> {t("ordering.accordions.accordion3.modals.addAdress.title1")} </p>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={Schema}
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                        }) => {
                            return (
                                <Form>
                                    <div className={classes.inputs_block}>
                                        <input
                                            className={classNames("mt-2", classes.inputs)}
                                            type="text"
                                            placeholder={t("ordering.accordions.accordion3.modals.addAdress.title2")}
                                            value={values.title}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="title"
                                        />

                                        <input
                                            className={classNames("mt-2", classes.inputs)}
                                            type="text"
                                            placeholder={t("ordering.accordions.accordion3.modals.addAdress.title3")}
                                            value={values.bin}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="bin"
                                        />

                                        <input
                                            className={classNames("mt-2", classes.inputs)}
                                            type="text"
                                            placeholder={t("ordering.accordions.accordion3.modals.addAdress.title4")}
                                            value={values.bik}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="bik"
                                        />

                                        <input
                                            className={classNames("mt-2", classes.inputs)}
                                            type="text"
                                            placeholder={t("ordering.accordions.accordion3.modals.addAdress.title5")}
                                            value={values.checking_account}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="checking_account"
                                        />
                                        <button className={classes.button__delete}>
                                            <b>{t("ordering.accordions.accordion3.modals.addAdress.title6")}</b>
                                        </button>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </>
    )
}

const RequisitesAddModal: React.FC = ({ children }) => {
    const { open, setOpen } = React.useContext(requisitesAddModalCtx);
    const isMobile = useMediaQuery('(max-width: 697px)');

    if (isMobile) return (
        <SwipeableDrawer
            style={{
                borderRadius: "20px 20px 0 0",
            }
            }
            anchor="bottom"
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            {children}
        </SwipeableDrawer >
    )

    return (
        <Modal
            className={classes.modal_block}
            style={{
                backgroundColor: "rgba(187, 187, 187, 0.5)",
                WebkitBackdropFilter: "blur(20px)",
            }}
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.box_modal}>
                <div className={classes.modal_container}>
                    {children}
                </div>
            </Box>
        </Modal>
    )
}

export default RequisitesAddModal


