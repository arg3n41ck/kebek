import React from "react";
import classNames from "classnames";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Autocomplete, TextField, Typography } from "@mui/material";

import classes from "./AddAdressModal.module.scss";
import { useTranslation } from "react-i18next";
import { NextRouter, useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createAddresses, fetchAddresses } from "../../redux/products/auth.slice";
import { Formik, Form } from "formik";
import * as yup from "yup";

export const modalAdressAddCtx = React.createContext({
    openAdd: false,
    setOpenAdd: (bool: boolean) => { },
});

export const ModalAdressAddProvider: React.FC = ({ children }) => {
    const [openAdd, setOpenAdd] = React.useState(false);
    return (
        <modalAdressAddCtx.Provider value={{ openAdd, setOpenAdd }}>
            {children}
            <ModalAdressAdd>
                <ModalAdressAddContent />
            </ModalAdressAdd>
        </modalAdressAddCtx.Provider>
    );
};
interface Cities {
    district: {
        id: number,
        title_kk: string,
        title_ru: string
    }
    id: number,
    title_ru: string,
    title_kk: string,
}

const initialValues: any = {
    city: "",
    address: "",
}

const Schema = yup.object({
    address: yup.string().required("Введите улицу!"),
});


const ModalAdressAddContent: React.FC = () => {
    const { setOpenAdd } = React.useContext(modalAdressAddCtx);
    const router: NextRouter = useRouter()
    const { regions, stations } = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch()


    const { setOpenAdd: setAdressAddModalOpen } = React.useContext(modalAdressAddCtx);

    const citiesComplete = regions?.map((item: Cities) => (router.locale === "ru" ? { label: item.title_ru, id: item.id } : { label: item.title_kk, id: item.id })) || [];
    const { t } = useTranslation();

    const openElevatorModal = () => {
        setAdressAddModalOpen(false);
    };

    function stylesMyText(text: any) {
        return {
            __html: text,
        };
    }

    const handleSubmit = async (values: any) => {
        const data: any = {
            address: values.address,
            city: values.city.id
        }
        await dispatch(createAddresses(data)).then(() => {
            dispatch(fetchAddresses())
            setOpenAdd(false)
        })
    }

    return (
        <>
            <div className={classes.modal_requisites_add_block}>
                <div className={classes.text}>
                    <div className={classes.icon}>
                        <CloseIcon
                            style={{ width: "35px", height: "35px" }}
                            onClick={() => setOpenAdd(false)}
                        />
                    </div>
                    <p className={classes.title}>
                        {" "}
                        {t("ordering.accordions.accordion3.modals.addReq.title1")}{" "}
                    </p>
                    <div className={classes.content_block}>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={Schema}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                setFieldValue
                            }) => {
                                return (
                                    <Form>
                                        <Autocomplete
                                            className={classNames(classes.autoComplete, "mt-2")}
                                            options={citiesComplete}
                                            onChange={(e, value) => setFieldValue("city", value)}
                                            value={values.city}
                                            onBlur={handleBlur}
                                            sx={{ width: "100%" }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    name="city"
                                                    label={t(
                                                        "ordering.accordions.accordion3.modals.addReq.title2"
                                                    )}
                                                />
                                            )}
                                        />
                                        <Typography className={"mt-3 mb-3"} sx={{ fontSize: 14 }}>
                                            <span
                                                onClick={openElevatorModal}
                                                dangerouslySetInnerHTML={stylesMyText(
                                                    t("ordering.accordions.accordion3.modals.addReq.title3")
                                                )}
                                            />
                                        </Typography>
                                        <input
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            className={classNames("col-md-12 col-12", classes.input_adress)}
                                            placeholder={t(
                                                "ordering.accordions.accordion3.modals.addReq.title4"
                                            )}
                                            name="address"
                                            required
                                        />
                                        {errors.address && touched.address && (
                                            <p className={"text-danger"}>{errors.address}</p>
                                        )}
                                        <div className="col-12 text-center">
                                            <button className={classes.button__delete}>
                                                <b>
                                                    {t("ordering.accordions.accordion3.modals.addReq.title5")}
                                                </b>
                                            </button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

const ModalAdressAdd: React.FC = ({ children }) => {
    const { openAdd, setOpenAdd } = React.useContext(modalAdressAddCtx);
    const isMobile = useMediaQuery("(max-width: 697px)");

    if (isMobile)
        return (
            <SwipeableDrawer
                style={{
                    borderRadius: "20px 20px 0 0",
                }}
                anchor="bottom"
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onOpen={() => setOpenAdd(true)}
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
            open={openAdd}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.box_modal}>
                <div className={classes.modal_container}>{children}</div>
            </Box>
        </Modal>
    );
};

export default ModalAdressAdd;
