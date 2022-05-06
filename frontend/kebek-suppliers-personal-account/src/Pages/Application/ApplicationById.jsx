import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { applicationContext } from "../../providers/ApplicationProvider"
import { localeContext } from "../../providers/LocaleProvider"
import { Accordion, AccordionSummary, Typography, AccordionDetails, ListItemText, MenuItem, OutlinedInput, Select, Button, useMediaQuery, Menu, Box, Modal, TextField } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format, parseISO } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
// import ExpandMoreIcon from '../../assets/icons/arrow.svg';
import classes from "./Application.module.scss"
import classNames from "classnames"
import Status from "../../components/Status/Status"
import { statusList } from '../../components/Status/constants'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import styled from 'styled-components';
import Loader from "../../components/Loader/Loader"
import ModalCm from "./ModalApplication/ModalProxy"
import arrow from '../../assets/icons/left-arrow 1.svg';
import styl from '@mui/material/styles/styled';
import Stack from '@mui/material/Stack';
import { Formik, Form } from "formik"
import ApplicationByIdProductList from './ApplicationByIdProductList'
import ApplicationByIdDocumentList from './ApplicationByIdDocumentList'
import { goodsContext } from '../../providers/GoodsProvider'

const Input = styl('input')({
    display: 'none',
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 350,
            marginLeft: 0,
        },
    },
    classes: {
        paper: classes.dropdownStyle,
    },
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 580,
    width: '100%',
    height: 'auto',
    borderRadius: '3px',
    bgcolor: 'background.paper',
    border: 'none',
    outline: 'none',
    boxShadow: 24,
    padding: '57px 30px 30px 30px',
};

const initialValues = {
    type: "WB",
    document: ""
}

const statusInDocument = [
    {
        id: 1,
        name: "Накладная",
        value: "WB"
    },
    {
        id: 1,
        name: "Счет на оплату",
        value: "BL"
    }
]

function ApplicationById() {
    const { id } = useParams()
    const { locale } = React.useContext(localeContext)
    const { getApplicationsById, applicationById: data, postDocumentsToOrderById, deleteProductsOrderById, patchStatusOrderById, deleteDocumentOrderById, setApplicationById, changeDeliveryOrderById, changePaymentOrderById } = React.useContext(applicationContext)
    const { elevators, getElevators } = React.useContext(goodsContext)




    const [statusChangedCurrent, setStatusChangedCurrent] = React.useState(""),
        [selectStatus, setSelectStatus] = React.useState(""),
        [openModal, setOpenModal] = React.useState(false),
        [selectBg, setSelectBg] = React.useState({}),
        [statusModal, setStatusModal] = React.useState("new"),
        [anchorEl, setAnchorEl] = React.useState(""),
        isMobile = useMediaQuery("(max-width:578px)"),
        isMedium = useMediaQuery("(max-width:700px)"),
        [anchorEl2, setAnchorEl2] = React.useState(null),
        [anchorEl3, setAnchorEl3] = React.useState(null),
        [imageInfo, setImageInfo] = React.useState(null),
        [paymentType, setPaymentType] = React.useState(null),
        [documentModal, setDocumentModal] = React.useState(false),
        [deliveryType, setDeliveryType] = React.useState(null),
        opens3 = Boolean(anchorEl3),
        opens2 = Boolean(anchorEl2),
        opens = Boolean(anchorEl),
        navigate = useNavigate()

    React.useEffect(() => {
        getApplicationsById(id)
        getElevators()

        return () => {
            setSelectBg("")
            setSelectStatus("")
        }
    }, [])


    const handleCloseModalDocument = () => {
        setDocumentModal(false)
    }

    React.useEffect(() => {
        !!data?.payment?.id && setPaymentType(data.payment.id)
        !!data?.delivery?.id && setDeliveryType(data.delivery.id)
    }, [data])

    React.useEffect(() => {
        !!data?.status && statusList.map((item) => {
            return data?.status === item.encryptedName && [setSelectBg(item), setSelectStatus(locale === "ru" ? item.pluralName : item.pluralNameKk)]
        })
    }, [data?.status])

    React.useEffect(() => {
        !!selectBg.encryptedName && patchStatusOrderById(id, selectBg.encryptedName)
    }, [selectBg])


    const handleClick1 = (event) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleClick2 = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClick3 = (event) => {
        setAnchorEl3(event.currentTarget);
    };

    const handleClose1 = (e) => {
        e.target.innerText === '' && setAnchorEl2(null);
    };

    const handleClose3 = (e) => {
        e.target.innerText === '' && setAnchorEl3(null);
    };

    const handleClose2 = (e) => {
        e.target.innerText === '' && setAnchorEl(null);
    };

    const modalHandler = (setAnchorEl) => {
        setOpenModal((prev) => !prev);
        setAnchorEl(null)
    };

    const handleOpenModalProxy = () => {
        setOpenModal((prev) => !prev)
        setAnchorEl2()
    }

    const handleDeleteDocument = async (id, document_id) => {
        await deleteDocumentOrderById(document_id).then(() => {
            getApplicationsById(id)
        })
    }

    const totalProductCountTon = React.useMemo(() => {
        return !!data?.products && data.products.reduce((acc, curr) => acc + +curr.amount, 0)
    }, [data])

    const typeDocument = (doc) => {
        if (doc === "WB") return "Накладная"
        if (doc === "PS") return "Пропуск"
        if (doc === "BL") return "Счет на оплату"
        return ""
    }


    const handleSubmitDocument = async (values, resetForm, id) => {
        const formData = new FormData();

        const data = {
            type: values.type,
            document: values.document,
            order: id
        }


        await Object.keys(data).forEach((key) => {
            const value = data[key];

            if (key === "document") {
                return formData.append(key, value, value.name)
            }
            formData.append(key, value)
        })

        await postDocumentsToOrderById(formData).then(() => {
            getApplicationsById(id)
        })

        setDocumentModal(false)
        setImageInfo(null)
        resetForm()
    }


    const deleteProductFromOrderById = async (id, applicationId) => {
        const res = data?.products.map((item) => {
            return id !== item.id && ({
                product: item.product.id,
                amount: item.amount,
                product_payment: item.productPayment
            })
        }).filter((item) => item);

        const client = data?.client.id;
        const elevator = data?.elevator.id;
        const delivery = data?.delivery.id;
        const payment = data?.payment.id;
        const delivery_payment = data?.deliveryPayment;

        await deleteProductsOrderById(res, applicationId, elevator, client, delivery, payment, delivery_payment)
        getApplicationsById(applicationId)
        handleClose3()
    }



    const handleChangePayment = React.useCallback(async (value) => {
        setPaymentType(value)

        const res = data?.products.map((item) => {
            return id !== item.id && ({
                product: item.product.id,
                amount: item.amount,
                product_payment: item.productPayment
            })
        }).filter((item) => item);


        const client = data?.client.id;
        const elevator = data?.elevator.id;
        const payment = !!value ? value : data?.payment.id;


        await changePaymentOrderById(res, id, elevator, client, payment)
    })

    const handleChangeDelivery = React.useCallback(async (value) => {
        setDeliveryType(value)
        const res = data?.products.map((item) => {
            return id !== item.id && ({
                product: item.product.id,
                amount: item.amount,
                product_payment: item.productPayment
            })
        }).filter((item) => item);


        const client = data?.client.id;
        const elevator = data?.elevator.id;
        const delivery = !!value ? value : data?.delivery.id;


        await changeDeliveryOrderById(res, id, elevator, client, delivery)
    })

    if (!data) {
        return <Loader />
    }

    return (
        <div className={classes.applicationById__conatainer}>
            {openModal &&
                <ModalCm
                    onModal={modalHandler}
                    statusModal={statusModal}
                    openModal={openModal}
                    proxyInfo={!!data ? data : {}}
                    handleClose={handleClose2}
                />
            }
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: 7
                }}
            >
                <ul className={"d-flex align-items-center m-0 p-0 ps-2"} style={{ listStyle: "none" }}>
                    <div
                        className={"d-flex align-items-center"}
                        onClick={() => navigate(-1)}>
                        <img src={arrow} alt='' />
                        <li style={{ color: "#BDBDBD", marginLeft: "5px" }}>{locale === "ru" ? "Назад" : "Артқа"}</li>
                    </div>
                    <li style={{ margin: '0 0 0 10px', fontWeight: 600 }}>/ {locale === "ru" ? " Информация о заявке" : "Қолданба туралы ақпарат"}</li>
                </ul>
            </Box>
            <div className={classes.applicationById__conatainer__items}>
                <div className={!isMedium ? "d-flex align-items-center justify-content-between" : "d-flex flex-column align-items-start"}>
                    <Typography sx={{ fontSize: 22, fontWeight: 600 }}>
                        Заявка от
                        {!!data?.createdAt && format(parseISO(`${!!data.createdAt && data.createdAt}`), ' d ', {
                            locale: ruLocale,
                        })}
                        {!!data?.createdAt && format(parseISO(`${!!data.createdAt && data.createdAt}`), 'MMMM', {
                            locale: ruLocale,
                        })
                            .charAt(0)
                            .toUpperCase()}
                        {!!data?.createdAt && format(parseISO(`${!!data.createdAt && data.createdAt}`), 'MMMM ', {
                            locale: ruLocale,
                        }).slice(1)}
                        <span
                            style={{
                                color: '#169653',
                                cursor: 'pointer',
                            }}
                        >
                            {!!data.number && data.number}
                        </span>
                    </Typography>

                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectStatus}
                        onChange={(e) => setSelectStatus(e.target.value)}
                        input={<OutlinedInput label="Выберитеs" />}
                        MenuProps={MenuProps}
                        className={`${classes.selectInp}, ${classes.selectOtherArrow}`}
                        IconComponent={KeyboardArrowDownIcon}
                        sx={{
                            height: 54,
                            backgroundColor: selectBg.bg,
                            width: isMedium ? "100%" : "auto",
                            margin: isMedium && "15px 0",
                        }}
                    >
                        {statusList.map((item) => (
                            <MenuItem
                                key={item.pluralName}
                                value={item.pluralName}
                                className={classNames(classes.select1)}
                                onClick={() => [setStatusChangedCurrent(item.encryptedName), setSelectBg(item)]}
                                sx={{
                                    padding: "10px 0",
                                    "& .MuiListItemText-root": { padding: "0 15px" },
                                }}
                            >
                                <ListItemText sx={{ margin: 0 }} primary={locale === "ru" ? item.pluralName : item.pluralNameKk} />
                            </MenuItem>
                        ))}
                    </Select>
                </div >

                <div>
                    <Accordion defaultExpanded sx={{ border: "none", padding: 0 }}>
                        <AccordionSummary
                            sx={{ padding: 0 }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <div className={"d-flex justify-content-between w-100 align-items-center"}>
                                <div className={"d-flex flex-column justify-content-start"}>
                                    <Typography sx={{ fontSize: !isMobile ? 22 : 15, fontWeight: 600 }}>
                                        Товары
                                    </Typography>
                                    <Typography sx={{ fontSize: !isMobile ? 16 : 12, color: "#092F33" }}>
                                        {!!data.products && data.products.length} товара, {totalProductCountTon} тонн
                                    </Typography>


                                </div>
                                <Link to="/goods/add-goods">
                                    <Button sx={{ color: "#169653", fontWeight: 600, textTransform: "none", fontSize: !isMobile ? 16 : 12 }} color="success">
                                        + Добавить товары
                                    </Button>
                                </Link>
                            </div>



                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 0 }}>
                            <div>
                                {!!data.products &&
                                    data.products.map((item) => (
                                        <ApplicationByIdProductList
                                            item={item}
                                            locale={locale}
                                            deleteProductFromOrderById={deleteProductFromOrderById}
                                            id={id}
                                            data={data}
                                            elevators={elevators}
                                            setPaymentType={setPaymentType}
                                            paymentType={paymentType}
                                            deliveryType={deliveryType}
                                            setDeliveryType={setDeliveryType}
                                            handleChangeDelivery={handleChangeDelivery}
                                            handleChangePayment={handleChangePayment}
                                        />
                                    ))}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>

                <div>
                    <Accordion defaultExpanded sx={{ padding: 0, border: "none" }}>
                        <AccordionSummary
                            sx={{ padding: 0 }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <div className={"d-flex justify-content-between w-100 align-items-center"}>
                                <div className={"d-flex flex-column justify-content-start"}>
                                    <Typography sx={{ fontSize: !isMobile ? 22 : 15, fontWeight: 600 }}>
                                        Документы
                                    </Typography>
                                </div>

                                <Button
                                    onClick={() => setDocumentModal(!documentModal)}
                                    sx={{ color: "#169653", fontWeight: 600, textTransform: "none", fontSize: !isMobile ? 16 : 12 }}
                                    color="success"
                                    component="span"
                                >
                                    + Добавить документы
                                </Button>

                                <Modal
                                    style={{
                                        height: '100vh',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    open={documentModal}
                                    onClose={handleCloseModalDocument}
                                >
                                    <Box
                                        sx={{
                                            style,
                                            background: '#fff',
                                            maxWidth: 500,
                                            position: 'relative',
                                        }}
                                    >
                                        <div
                                            onClick={handleCloseModalDocument}
                                            style={{
                                                position: 'absolute',
                                                right: 10,
                                                top: 10,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <CloseIcon />
                                        </div>
                                        <Box
                                            sx={{
                                                padding: 3,
                                            }}
                                        >
                                            <Formik
                                                initialValues={initialValues}
                                                // validate={}
                                                onSubmit={(values, { resetForm }) => handleSubmitDocument(values, resetForm, !!data?.id && data.id)}
                                            >
                                                {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                                                    <Form style={{ margin: 15 }}>
                                                        <Typography sx={{ fontSize: !isMobile ? 30 : 18, fontWeight: 600, marginBottom: 5 }}>Добавление документа</Typography>
                                                        <div style={{ width: '100%' }}>
                                                            <TextField
                                                                fullWidth
                                                                id='outlined-select-currency'
                                                                select
                                                                value={values.type}
                                                                name="type"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            >
                                                                {statusInDocument.map((item) => {
                                                                    return <MenuItem key={item.id} value={item.value}>
                                                                        {item.name}
                                                                    </MenuItem>
                                                                })}

                                                            </TextField>
                                                        </div>
                                                        <div style={{ position: "relative", marginTop: 30, padding: "30px 0" }}>
                                                            <div className={classNames("w-100 h-100 d-flex align-items-center justify-content-start", classes.mediaButton)}
                                                                style={isMobile ? { position: "absolute", left: 0, top: -20, width: "100%" } : { position: "absolute", left: 0, top: -6, width: "100%" }}
                                                            >
                                                                <input
                                                                    type="file"
                                                                    id='img'
                                                                    style={{ position: "absolute", top: 0, width: "100%", padding: "10px 0", cursor: "pointer", opacity: 0, zIndex: 1 }}
                                                                    name='document'
                                                                    accept="image/jpg, image/jpeg, application/pdf, image/png"
                                                                    onChange={(e) => {
                                                                        setFieldValue('document', e.target.files[0])
                                                                        setImageInfo(e.target.files[0])
                                                                    }}
                                                                />
                                                                <button type="button" style={{ position: "absolute", top: 0, width: "100%" }} color="success" variant="contained">{!imageInfo ? "Выберите документ" : "Документ выбран"} </button>
                                                                {/* </>
                                                                )} */}
                                                            </div>
                                                        </div>

                                                        <Button type="submit" className={"w-100"} color="success" variant="contained">
                                                            Добавить документ
                                                        </Button>
                                                    </Form>
                                                )}
                                            </Formik>

                                        </Box>
                                    </Box>
                                </Modal>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 0 }}>
                            {!!data?.documents && data?.documents.filter(({ type }) => type !== "PS")
                                .map((item) => <ApplicationByIdDocumentList
                                    item={item}
                                    isMobile={isMobile}
                                    typeDocument={typeDocument}
                                    data={data}
                                    handleDeleteDocument={handleDeleteDocument}
                                />
                                )}
                        </AccordionDetails>
                    </Accordion>

                    {!!data?.proxyFullname && (
                        <div style={{ position: "relative" }} className={"d-flex justify-content-between align-items-center"}>
                            <Accordion defaultExpanded style={{ margin: 0, border: 'none', padding: 0, width: "100%" }}>
                                <AccordionSummary
                                    sx={{ padding: 0 }}
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >

                                    <div
                                        className={
                                            'd-flex w-100 justify-content-between align-items-center'
                                        }
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: !isMobile ? 21 : 15,
                                            }}
                                        >
                                            Доверенное лицо
                                        </Typography>

                                    </div>
                                </AccordionSummary>
                                <AccordionDetails style={{ padding: 0 }}>

                                    <div
                                        style={{ padding: 0, margin: 0 }}
                                        className={classNames(
                                            classes.proxyInfo__items,
                                            'w-100 d-flex justify-content-between align-items-center d-sm-flex d-none'
                                        )}
                                    >
                                        <div className={classes.proxyInfo}>
                                            <div
                                                className={classNames(
                                                    classes.confidantItem,
                                                    'd-flex justify-content-between w-100 align-items-center'
                                                )}
                                            >
                                                <div
                                                    className={classes.confidantItem_item}
                                                    style={{ maxWidth: 400, width: '100%' }}
                                                >
                                                    <Typography
                                                        className={classes.fullNameConfidantText}
                                                        sx={{
                                                            color: '#828282',
                                                            fontSize: 18,
                                                            padding: 0,
                                                        }}
                                                    >
                                                        ФИО довереного лица
                                                    </Typography>
                                                    <Typography sx={{ color: '#092F33', fontSize: 19 }}>
                                                        {!!data?.proxyFullname && data?.proxyFullname}
                                                    </Typography>
                                                </div>
                                                <div
                                                    className={classes.confidantItem_item}
                                                    style={{ maxWidth: 400, width: '100%' }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: '#828282',
                                                            fontSize: 18,
                                                            padding: 0,
                                                        }}
                                                    >
                                                        № доверенности
                                                    </Typography>
                                                    <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                                                        {!!data?.proxyNumber && `№${data?.proxyNumber}`}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div
                                                className={classNames(
                                                    classes.confidantItem,
                                                    'd-flex justify-content-between w-100 align-items-center'
                                                )}
                                            >
                                                <div
                                                    className={classes.confidantItem_item}
                                                    style={{ maxWidth: 400, width: '100%' }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: '#828282',
                                                            fontSize: 18,
                                                            padding: 0,
                                                        }}
                                                    >
                                                        От ЧЧ / ММ / ГГГ
                                                    </Typography>
                                                    <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                                                        {!!data?.proxyStartDate && format(
                                                            parseISO(data?.proxyStartDate),
                                                            'dd.MM.yyyy'
                                                        )}
                                                    </Typography>
                                                </div>
                                                <div
                                                    className={classes.confidantItem_item}
                                                    style={{ maxWidth: 400, width: '100%' }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: '#828282',
                                                            fontSize: 18,
                                                            padding: 0,
                                                        }}
                                                    >
                                                        По ЧЧ / ММ / ГГГ
                                                    </Typography>
                                                    <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                                                        {!!data?.proxyEndDate && format(
                                                            parseISO(data?.proxyEndDate),
                                                            'dd.MM.yyyy'
                                                        )}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div>
                                            <MoreVertSharpIcon
                                                style={{ color: '#219653', cursor: 'pointer' }}
                                                onClick={handleClick2}
                                            />
                                            <Menu
                                                id='long-menu'
                                                anchorEl={anchorEl}
                                                open={opens}
                                                onClose={handleClose2}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'bottom',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'bottom',
                                                }}
                                                onClick={handleClose2}
                                            >
                                                <MenuItem
                                                    onClick={() => handleOpenModalProxy()}
                                                >
                                                    <Button
                                                        sx={{
                                                            padding: 0,
                                                            textTransform: 'none',
                                                            fontSize: 16,
                                                            fontWeight: 600,
                                                            color: "rgb(9, 47, 51)",
                                                            marginRight: 5,
                                                        }}
                                                    >
                                                        Изменить
                                                    </Button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <Button
                                                        sx={{
                                                            padding: 0,
                                                            textTransform: 'none',
                                                            color: "rgb(9, 47, 51)",
                                                            fontSize: 16,
                                                            fontWeight: 600,
                                                            marginRight: 5,
                                                        }}
                                                    >
                                                        Удалить
                                                    </Button>
                                                </MenuItem>
                                            </Menu>
                                        </div> */}
                                    </div>
                                    <div
                                        className={classNames(
                                            'd-sm-none d-block',
                                            classes.confidationInfo_mobile
                                        )}
                                    >
                                        <Typography sx={{ color: '#092F33', fontSize: 18 }}>
                                            {!!data?.proxyFullname && data?.proxyFullname}
                                        </Typography>
                                        <Typography sx={{ color: '#828282', fontSize: 16 }}>
                                            Доверенность №{!!data?.proxyNumber && data?.proxyNumber} от{' '}
                                            {!!data?.proxyStartDate && format(parseISO(data?.proxyStartDate), 'dd.MM.yyyy')}{' '}
                                            по {!!data?.proxyEndDate && format(parseISO(data?.proxyEndDate), 'dd.MM.yyyy')}
                                        </Typography>
                                    </div>

                                    <div
                                        className={'d-sm-none d-flex w-100 justify-content-between align-items-center mt-4'}
                                    >
                                        <Button
                                            sx={{
                                                padding: 0,
                                                color: '#219653',
                                                textTransform: 'none',
                                                fontSize: 18,
                                                fontWeight: 600,
                                            }}
                                            onClick={() => handleOpenModalProxy()}
                                        >
                                            Изменить
                                        </Button>
                                        <Button
                                            sx={{
                                                padding: 0,
                                                color: '#219653',
                                                textTransform: 'none',
                                                fontSize: 18,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Удалить
                                        </Button>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>


                    )}

                </div>

            </div >
        </div >
    )
}

export default ApplicationById

export const NameFile = ({ u }) => {
    const url = React.useMemo(() => {
        let arr = u.split('/'),
            returnValue = arr[arr.length - 1],
            formatFile = returnValue.split('.');
        return returnValue.length < 10
            ? returnValue
            : `${returnValue.slice(0, 10)}... .${formatFile[formatFile.length - 1]}`;
    }, []);

    return (
        <NameWrapper>
            {url} <p>{u}</p>
        </NameWrapper>
    );
};

const NameWrapper = styled.div`
  position: relative;
  color: #828282;
  cursor: pointer;
  text-decoration: underline;
  p {
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    visibility: hidden;
    transition: 0.3s;
    padding: 3px 5px;
  }
  &:hover {
    color: #219653;
  }
`;