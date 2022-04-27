import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "react-bootstrap";
import classNames from "classnames";

import Typography from "@mui/material/Typography";
import TabsUnstyled from "@mui/base/TabsUnstyled";

import PaymentCard from "../components/OrderingCard/PaymentCard";
import CartInfoCard from "../components/OrderingCard/CartInfoCard";
import RecipientDataAccordion from "../components/OrderingAccordions/RecipientDataAccordion";
import PaymentMethodAccordion from "../components/OrderingAccordions/PaymentMethodAccordion";
import MethodOfObtainingAccordion from "../components/OrderingAccordions/MethodOfObtainingAccordion";

import leftArrow from "../assets/icons/leftArrow.svg";
import classes from "../styles/Ordering.module.scss";
import { AddressesModalProvider } from "../components/OrderingModals/ElevatorsModal";
import { RequisitesAddModalProvider } from "../components/OrderingModals/AddRequisitesModal";
import { ModalAdressAddProvider } from "../components/OrderingModals/AddAdressModal";
import { EditAdressModalProvider } from "../components/OrderingModals/EditAdressModal";
import { DeleteAdressModalProvider } from "../components/OrderingModals/DeleteAdressModal";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { cartSelectors, changeCheckedItemAll, clearCart } from "../redux/products/cart.slice";
import { Card, Checkbox } from "@mui/material";
import DeleteProductsModal from "../components/DeleteProductModal/DeleteProductsModal";
import { useTranslation } from "react-i18next"
import { useRouter } from "next/router";
import { fetchStation } from "../redux/products/products.slice";
import { fetchAddresses, fetchRequisites, getUser, fetchDelivery } from "../redux/products/auth.slice";

import { Formik, Form } from "formik";
import * as yup from "yup";
import Loader from "../components/Loader/Loader";
import { toast } from "react-toastify";
import $api from "../utils/axios";

const Schema = yup.object({
    fullName: yup.string().required("Пожалуйста заполните поля:"),
    phoneNumber: yup.string().required("Пожалуйста заполните поля:"),
    email: yup.string().required("Пожалуйста заполните поля:"),
});

function Ordering() {
    const cart = useAppSelector((state) => cartSelectors.selectAll(state));
    const { delivery } = useAppSelector((state) => state.auth);
    const [radioDelivery, setRadioDelivery] = React.useState("");
    const [deliveryTab, setDeliveryTab] = React.useState(1);
    const [checkboxAll, setCheckboxAll] = React.useState(true);
    const [radioFace, setRadioFace] = React.useState('individual');
    const [radioPayment, setRadioPayment] = React.useState(1);
    const [address, setAddress] = React.useState(null);
    const [requisite, setRequisite] = React.useState<any>(null);
    const [deliveryPayment, setDeliveryPayment] = React.useState(null);
    const [postOrders, setPostOrders] = useState<any>(null);
    const [paymentPC, setPaymentPC] = useState<any>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const formRef = React.useRef(null);
    const [checkedState, setCheckedState] = React.useState(
        !!cart.length ? cart.map((item) => ({ ...item })) : []
    );



    const [open, setOpen] = React.useState(false);
    const [orders, setOrders] = React.useState(null)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { t } = useTranslation();
    const user = useAppSelector(state => state.auth.user)

    const initialValues = {
        fullName: !!user?.first_name ? user.first_name : "",
        phoneNumber: !!user?.phone_number ? user.phone_number : "",
        email: !!user?.email ? user.email : ""
    };



    React.useEffect(() => {
        const newObj: any = {
            client: !!user?.id ? user.id : window.localStorage.getItem("client"),
            elevator: !!cart?.length && cart.filter(({ checked }: any) => checked)[0]?.elevator?.id || "",
            payment: radioPayment,
            delivery: deliveryTab,
            products: !!cart?.length && cart.filter(({ checked }: any) => checked).map((item) => ({
                product: item?.id,
                amount: item?.count * 1000,
                product_payment: item?.price,
            })),
            bin: !!requisite && radioPayment === paymentPC?.id ? requisite.bin : "",
            bik: !!requisite && radioPayment === paymentPC?.id ? requisite.bik : "",
            checking_account: !!requisite && radioPayment === paymentPC?.id ? requisite.checking_account : "",
            title: !!requisite && radioPayment === paymentPC?.id ? requisite.title : "",
            address: !!address ? address : "",
            delivery_payment: !!deliveryPayment ? deliveryPayment : 1
        }
        for (let key in newObj) {
            if (!newObj[key]) {
                delete newObj[key]
                setPostOrders(newObj)
            }
            setPostOrders(newObj)
        }

    }, [address, requisite, radioPayment, deliveryTab])

    const orderPost = async (postOrders: any) => {
        try {
            await $api.post("/orders/", postOrders).then(({ data }: any) => {
                return setOrders(data)
            });
            handleOpen()
            dispatch(clearCart())
        } catch (e) {
            toast.error("Возникла непредвиденная ошибка!");
        }
    }

    const handleOnChange = () => {
        const isCheckedAllCheckbox = !checkboxAll;
        setCheckboxAll(!checkboxAll);
        const rewrittenCheckboxState: any = checkedState.map((item) => ({
            ...item,
            checked: isCheckedAllCheckbox,
        }));
        setCheckedState(rewrittenCheckboxState);
        dispatch(changeCheckedItemAll(rewrittenCheckboxState.map(({ id, checked }: any) => ({ id, changes: { checked } }))));
    }


    const handleSubmit = async (postOrders: any, values: any) => {
        await orderPost(postOrders)
    }


    React.useEffect(() => {
        dispatch(fetchStation());
        dispatch(fetchDelivery());
        const userToken = window.localStorage.getItem('token');
        if (!userToken) {
            router.push('/cart');
        } else {
            dispatch(getUser())
            dispatch(fetchAddresses())
            dispatch(fetchRequisites())
        }
    }, []);

    React.useEffect(() => {
        !!delivery?.length && delivery.forEach((item: any) =>
            !!item.deliveries &&
            item.deliveries.forEach((item: any) => item.status === "AC" && item.type.title_ru === "Самовывоз" && setDeliveryTab(item.id))
        )
    }, [delivery])

    return (
        <Suspense fallback={<Loader />} >
            <div style={{ position: 'relative', paddingBottom: 150 }}>
                <Container>
                    <div className={classNames(classes.ordering_item)}>
                        <div className={classNames(classes.ordering_text)}>
                            <div className={classNames(classes.leftArrow, "d-flex")}>
                                <Link href="/cart" passHref>
                                    <Image src={leftArrow} alt="leftArrow" />
                                </Link>
                                <Link href="/cart" passHref>
                                    <p className={"mt-3"}>{t("ordering.nav.title")}</p>
                                </Link>
                            </div>
                            <Typography sx={{ fontSize: 30 }} className={classes.wadeIn}>
                                {t("ordering.nav.heading")}
                            </Typography>
                        </div>


                        <Formik
                            initialValues={initialValues}
                            validationSchema={Schema}
                            onSubmit={(values) => handleSubmit(postOrders, values)}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                isSubmitting,
                            }) => {
                                return (
                                    <Form className={classes.auth_items__form__form}>
                                        <div className={"row mt-4"}>
                                            <div className={classNames("col-md-8", classes.group134)}>
                                                <Card className={"m-0 p-0"} sx={{ width: "100%", padding: 0.5 }}>
                                                    {!!cart?.length ? (
                                                        <>

                                                            <div
                                                                className={classNames(
                                                                    "d-flex justify-content-between align-items-center pt-2",
                                                                    classes.frame87
                                                                )}
                                                            >
                                                                <div className={"d-flex align-items-center"}>
                                                                    {!cart.length ?
                                                                        (
                                                                            <Checkbox
                                                                                onChange={handleOnChange}
                                                                                checked={checkboxAll}
                                                                                className={classes.cartProductInfo_checkbox}
                                                                                defaultChecked
                                                                                color="success"
                                                                                disabled
                                                                            />
                                                                        )
                                                                        :
                                                                        (
                                                                            <Checkbox
                                                                                onChange={handleOnChange}
                                                                                checked={checkboxAll}
                                                                                className={classes.cartProductInfo_checkbox}
                                                                                defaultChecked
                                                                                color="success"
                                                                            />
                                                                        )}
                                                                    <Typography
                                                                        className={classes.selectAll}
                                                                        sx={{ fontSize: 18 }}
                                                                    >
                                                                        {t("cart.buttons.selectAll")}
                                                                    </Typography>
                                                                </div>
                                                                <DeleteProductsModal data={checkedState} />
                                                            </div>
                                                            {cart.map((item) => (
                                                                <div key={item.id} >
                                                                    <CartInfoCard setCheckboxAll={setCheckboxAll} setCheckedState={setCheckedState} checkedState={checkedState} data={item} />
                                                                </div>
                                                            ))}
                                                        </>
                                                    )
                                                        :
                                                        (
                                                            <div style={{ textAlign: "center", padding: 20 }}>
                                                                <Typography>{router.locale === "ru" ? "Ваша корзина пуста" : "Себетіңіз бос"}</Typography>
                                                            </div>
                                                        )}
                                                </Card>
                                                <TabsUnstyled defaultValue={0}>
                                                    <RecipientDataAccordion values={values} handleChange={handleChange} handleBlur={handleBlur} radioFace={radioFace} errors={errors} touched={touched} setRadioFace={setRadioFace} />
                                                    <RequisitesAddModalProvider>
                                                        <PaymentMethodAccordion setPaymentPC={setPaymentPC} requisite={requisite} setRequisite={setRequisite} setRadioPayment={setRadioPayment} radioPayment={radioPayment} radioFace={radioFace} />
                                                    </RequisitesAddModalProvider>
                                                    <DeleteAdressModalProvider>
                                                        <EditAdressModalProvider>
                                                            <AddressesModalProvider>
                                                                <ModalAdressAddProvider>
                                                                    <MethodOfObtainingAccordion address={address} setAddress={setAddress} radioDelivery={radioDelivery} setRadioDelivery={setRadioDelivery} setDeliveryTab={setDeliveryTab} deliveryTab={deliveryTab} />
                                                                </ModalAdressAddProvider>
                                                            </AddressesModalProvider>
                                                        </EditAdressModalProvider>
                                                    </DeleteAdressModalProvider>
                                                </TabsUnstyled>
                                            </div>
                                            <div
                                                className={classNames(
                                                    classes.ordering_items__paymentCard,
                                                    "col-md-4"
                                                )}
                                            >
                                                <PaymentCard orders={orders} checkedProducts={checkedState} handleClose={handleClose} open={open} />
                                            </div>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </Container>
            </div>
        </Suspense>
    );
}

export default Ordering;
