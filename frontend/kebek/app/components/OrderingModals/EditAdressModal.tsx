import React from 'react'
import classNames from "classnames"

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Autocomplete, TextField } from '@mui/material';

import classes from './EditAdressModal.module.scss';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Formik, Form } from "formik";
import * as yup from "yup";
import { fetchAddresses, updateAddresses } from '../../redux/products/auth.slice';

export const editAdressModalCtx = React.createContext<any>({
    openEdit: false,
    setOpenEdit: (bool: boolean) => { },
    data: null,
    setData: (data: any) => { }
});

export const EditAdressModalProvider: React.FC = ({ children }) => {
    const [openEdit, setOpenEdit] = React.useState(false);
    const [data, setData] = React.useState<any>();

    return (
        <editAdressModalCtx.Provider value={{ openEdit, setOpenEdit, data, setData }}>
            {children}
            <EditAdressModal>
                <EditAdressModalContent />
            </EditAdressModal>
        </editAdressModalCtx.Provider>
    )
}

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

const Schema = yup.object({
    address: yup.string().required("Введите улицу!"),
});

const EditAdressModalContent: React.FC = () => {
    const { setOpenEdit, data } = React.useContext(editAdressModalCtx);
    const { t } = useTranslation()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const regions: any = useAppSelector((state) => state.product.regions);

    const initialValues: any = {
        city: router.locale === "ru" ? data?.city?.title_ru : data?.city?.title_kk,
        address: data.address,
    }

    const citiesComplete = regions?.map((item: Cities) => (router.locale === "ru" ? { label: item.title_ru, id: item.id } : { label: item.title_kk, id: item.id })) || [];


    const handleSubmit = async (id: number, values: any) => {
        const data: any = {
            address: values.address,
            city: values.city.id,
        }

        await dispatch(updateAddresses(data)).then(() => {
            // dispatch(fetchAddresses())
            fetchAddresses()
            setOpenEdit(false)
        })
    }

    return (
        <>
            <div className={classes.modal_requisites_add_block}>
                <div className={classes.text}>
                    <div className={classes.icon}>
                        <CloseIcon style={{ width: "35px", height: "35px" }} onClick={() => setOpenEdit(false)} />
                    </div>
                    <p className={classes.title}> {t("ordering.accordions.accordion3.modals.editText.title1")} </p>
                    <div className={classes.content_block}>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={Schema}
                            onSubmit={({ values }) => handleSubmit(data.id, values)}
                        >
                            {({
                                values,
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
                                            isOptionEqualToValue={(option, value) => option.label === value}
                                            onBlur={handleBlur}
                                            value={values.city}
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
                                        <input
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="address"
                                            type="text"
                                            className={classNames("col-md-12 col-12", classes.input_adress)}
                                            placeholder={t("ordering.accordions.accordion3.modals.editText.title3")}
                                        />

                                        <div className="col-12 text-center">
                                            <button className={classes.button__delete}>
                                                <b>{t("ordering.accordions.accordion3.modals.editText.title4")}</b>
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
    )
}

const EditAdressModal: React.FC = ({ children }) => {
    const { openEdit, setOpenEdit } = React.useContext(editAdressModalCtx);
    const isMobile = useMediaQuery('(max-width: 697px)');

    if (isMobile) return (
        <SwipeableDrawer
            style={{
                borderRadius: "20px 20px 0 0",
            }
            }
            anchor="bottom"
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            onOpen={() => setOpenEdit(true)}
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
            open={openEdit}
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

export default EditAdressModal


