import React from 'react'
import classes from "../../styles/Ordering.module.scss"
import { Accordion, AccordionSummary, Radio, AccordionDetails, FormControl, Typography, RadioGroup, FormControlLabel, IconButton, Modal, Box } from "@mui/material"
import classNames from "classnames"
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { TabPanelUnstyled } from '@mui/base';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from "@mui/icons-material/Close";

import { requisitesAddModalCtx } from '../OrderingModals/AddRequisitesModal'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { editAdressModalCtx } from '../OrderingModals/EditAdressModal';
import { deleteRequisitesModalCtx } from '../OrderingModals/DeleteRequisitesModals';
import { useRouter } from 'next/router';
import { requisitesEditModalCtx } from '../OrderingModals/EditRequisitesModal';
import { deleteRequisites, fetchRequisites } from '../../redux/products/auth.slice';
import cl from "../OrderingModals/DeleteAdressModal.module.scss"

function stylesMyText(text: any) {
    return {
        __html: text
    }
}

export const MoreInfo = ({ setRequisite, className = "", data }: any) => {
    const { setOpen: setOpenEditRequisiteModal, setData } = React.useContext(requisitesEditModalCtx);
    const [open, setOpen] = React.useState(false)
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const openEditRequisiteModal = (data: any) => {
        setOpenEditRequisiteModal(true);
        setData(data)
    };

    const handleDelete = async (id: any) => {
        await dispatch(deleteRequisites(id)).then(() => {
            setRequisite(null)
            dispatch(fetchRequisites())
            setOpen(false)
        })
    }
    const { setOpenDeletRequisiteModal, openDeletRequisiteModal, setId } = React.useContext(deleteRequisitesModalCtx)

    const openRequisitesModal = (id: number) => {
        setOpenDeletRequisiteModal(true);
        setId(id)
    };

    return (
        <div className={classNames(classes.header__items__location, className)}>
            <div className={classNames(classes.header__items__location__image)} />
            <div className={classNames("flex", classes.tooltip)}>
                <MoreVertIcon />
                <div className={classes.bottom}>
                    <div className={classes.buttons_bottom}>
                        <div
                            onClick={() => openEditRequisiteModal(data)}
                            className={classes.update_button}
                        >
                            {t("ordering.accordions.accordion3.modals.title1")}
                        </div>
                        <div
                            onClick={() => setOpen(true)}
                            className={classes.delete_button}
                        >
                            {t("ordering.accordions.accordion3.modals.title2")}
                        </div>
                        <i />
                    </div>
                </div>
            </div>
            <Modal
                className={cl.modal_block}
                style={{
                    backgroundColor: "rgba(187, 187, 187, 0.5)",
                    WebkitBackdropFilter: "blur(20px)",
                }}
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cl.box_modal}>
                    <div className={cl.modal_container}>
                        <div className={cl.modal_adress_delete_block}>
                            <div className={cl.text}>
                                <div className={cl.icon}>
                                    <CloseIcon
                                        style={{ width: "35px", height: "35px" }}
                                        onClick={() => setOpen(false)}
                                    />
                                </div>
                                <p className={cl.title}>{t("ordering.accordions.accordion3.modals.deleteText.title11")} </p>
                                <div className={cl.content_block}>
                                    <div dangerouslySetInnerHTML={stylesMyText(t("ordering.accordions.accordion3.modals.deleteText.title22"))} className={cl.sure} />
                                    <div className="col-12 text-center">
                                        <button onClick={() => handleDelete(data?.id)} className={cl.button__delete}>
                                            <b>{t("ordering.accordions.accordion3.modals.deleteText.title3")}</b>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

function PaymentMethodAccordion({ setPaymentPC, radioFace, setRadioPayment, radioPayment, setRequisite, requisite }: any) {
    const { requisites, delivery, payment } = useAppSelector((state: any) => state.auth);
    const router = useRouter()
    const { t } = useTranslation()

    const handleClick = (item: any) => {
        setRequisite(item)
    }

    const paymentVisible = !!delivery?.length && delivery.map(({ payments }: any) => {
        return !!payments?.length && payments.map((item: any) => {
            return item.type.title_ru !== "Перечисление на расчетный счет" && item
        }).filter((item: any) => item && item.status === "AC" && item)
    })

    const paymentNotVisible = !!delivery?.length && delivery.map(({ payments }: any) => {
        return !!payments?.length && payments.map((item: any) => {
            setPaymentPC(item);
            return item.type.title_ru === "Перечисление на расчетный счет" && item
        }).filter((item: any) => item && item.status === "AC" && item)
    })[0]


    React.useEffect(() => {
        radioFace === "entity" ? setRadioPayment(!!paymentNotVisible?.length && paymentNotVisible[paymentNotVisible.length - 1].id) : setRadioPayment(!!paymentVisible?.length && paymentVisible.map((payment: any) => {
            return !!payment?.length && payment.map((item: any) => {
                return (item.type.title_ru === "Наличными в кассу" || item.type.title_kk === "Кассаға қолма-қол") && item
            })[0]
        })[0].id)
    }, [radioFace, paymentVisible])

    const handleChangeRadioPayment = (event: any) => {
        setRadioPayment(Number(event.target.value));
    };

    const { setOpen: setModalOpen } = React.useContext(requisitesAddModalCtx);
    const openModal = () => {
        setModalOpen(true);
    }

    React.useEffect(() => {
        (!requisite && !!requisites?.length) && setRequisite(requisites[0])
    }, [requisite, requisites])

    return (
        <div>
            <Accordion defaultExpanded className={classNames("mb-4", classes.accordion)} >
                <AccordionSummary
                    expandIcon={<ArrowForwardIosSharpIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={{ fontSize: 21 }}>{t("ordering.accordions.accordion2.heading")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl sx={{ width: '100%' }}>
                        <RadioGroup
                            value={radioPayment}
                            onChange={handleChangeRadioPayment}
                        >
                            <div>
                                {!!paymentVisible?.length && paymentVisible.map((payment: any) => {
                                    return !!payment?.length && payment.map((item: any) => (
                                        <div key={item.id}>
                                            <FormControlLabel key={item.id} className={classes.formControl__text} value={item.id} control={<Radio />}
                                                label={<Typography
                                                    color={radioPayment == item.id ? "primary" : "black"}>
                                                    {router.locale === "ru" ? item.type.title_ru : item.type.title_kk}
                                                </Typography>}
                                            />
                                        </div>
                                    ))
                                })}
                                {!!paymentNotVisible?.length && paymentNotVisible.map((item: any) => (
                                    <div key={item.id}>
                                        <TabPanelUnstyled className={classes.PCenumeration} value={1} >
                                            <FormControlLabel className={classes.formControl__text} value={item.id} control={<Radio />}
                                                label={<Typography
                                                    color={radioPayment == item.id ? "primary" : "black"}>
                                                    {router.locale === "ru" ? item.type.title_ru : item.type.title_kk}
                                                </Typography>}
                                            />
                                        </TabPanelUnstyled>
                                    </div>
                                ))}
                            </div>

                            {!!paymentNotVisible?.length && paymentNotVisible[paymentNotVisible.length - 1].id === radioPayment ? (
                                <div className={"mt-2"}>
                                    <TabPanelUnstyled className={classes.PCenumeration} value={1}>
                                        <div className={"d-flex align-items-center justify-content-between"}>
                                            <TabPanelUnstyled className={classes.PCenumeration} value={1}>
                                                <Typography className={classes.saved_requisites} sx={{ fontSize: 21, fontWeight: 400 }}>{t("ordering.accordions.accordion2.saveReq.title1")}</Typography>
                                            </TabPanelUnstyled>

                                            <div className={"d-flex justify-content-end"}>
                                                <button type="button" className={classes.add_button} onClick={openModal}
                                                    style={{ background: 'none', color: "rgba(33, 150, 83, 1)", fontSize: "18px", border: "0px" }}
                                                >
                                                    + {t("ordering.accordions.accordion2.saveReq.title2")}
                                                </button>
                                            </div>
                                        </div>
                                        <div className={"mt-2"}>
                                            {
                                                !!requisites && requisites.map((item: any) => (
                                                    <div onClick={() => handleClick(item)} style={requisite?.id === item.id ? { height: 76, border: '1px solid #219653', borderRadius: 3, cursor: "pointer" } : { height: 76, border: '1px solid #e0e0e0', borderRadius: 3, cursor: "pointer" }} className={classNames("d-flex mt-2 align-items-center justify-content-between", classes.saveRequis)}
                                                        key={item.id}>
                                                        <div style={{ padding: '14px 20px' }}>
                                                            <Typography className={classes.headingBin} sx={{ fontSize: 18, fontWeight: 400 }}>ТОО {item.title}</Typography>
                                                            <span style={{ color: 'gray', fontSize: 14 }}>БИН {item.bin}; </span>
                                                            <span style={{ color: 'gray', fontSize: 14 }}>БИК {item.bik}; </span>
                                                            <span style={{ color: 'gray', fontSize: 14 }}>РС {item.checking_account};</span>
                                                        </div>
                                                        <IconButton color="success">
                                                            <MoreInfo setRequisite={setRequisite} data={item} className="d-sm-flex" />
                                                        </IconButton>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </TabPanelUnstyled>
                                </div>
                            ) : null}

                        </RadioGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </div >
    )
}

export default PaymentMethodAccordion


