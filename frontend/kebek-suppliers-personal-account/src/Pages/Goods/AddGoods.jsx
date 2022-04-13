import React from 'react'
import classes from "./Goods.module.scss"
import arrow from '../../assets/icons/left-arrow 1.svg';
import notImage from '../../assets/icons/notImage.svg';
import { useNavigate } from 'react-router-dom';
import { localeContext } from '../../providers/LocaleProvider';
import { Button, Typography, Select, MenuItem, Box, useMediaQuery } from '@mui/material';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import classNames from "classnames"
import LinearProgress from '@mui/material/LinearProgress';


import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { goodsContext } from '../../providers/GoodsProvider';


const initialValues = {
    elevator: "default",
    type: "default",
    set_number: '',
    price: '',
    min_limit: '',
    max_limit: '',
    residue: '',
    image: null
};

const Schema = yup.object({
    elevator: yup.string().required('Пожалуйста, заполните указанные поля!'),
    type: yup.string().required('Пожалуйста, заполните указанные поля!'),
    set_number: yup.string().required('Пожалуйста, заполните указанные поля!'),
    price: yup.string().required('Пожалуйста, заполните указанные поля!'),
    min_limit: yup.string().required('Пожалуйста, заполните указанные поля!'),
    max_limit: yup.string().required('Пожалуйста, заполните указанные поля!'),
    residue: yup.string().required('Пожалуйста, заполните указанные поля!'),
    // image: yup.object().required('Пожалуйста, заполните указанные поля!').nullable(true),
});

function AddGoods() {
    const navigate = useNavigate();
    const { locale } = React.useContext(localeContext)
    const isSmall = useMediaQuery("(max-width: 578px)")
    const [drag, setDrag] = React.useState(false)
    const [avatarPreview, setAvatarPreview] = React.useState([])
    const { postProducts, elevators, getElevators, getProductTypes, productTypes } = React.useContext(goodsContext)

    const handleSubmit = async (values, resetForm) => {
        const formData = new FormData();

        const data = {
            elevator: values.elevator !== "default" ? values.elevator : "",
            type: Number(values.type !== "default" ? values.type : ""),
            set_number: values.set_number,
            price: Number(values.price),
            min_limit: Number(values.min_limit),
            max_limit: Number(values.max_limit),
            image: values.image,
            residue: Number(values.residue),
        }

        await Object.keys(data).forEach((key) => {
            const value = values[key];
            if (key === 'image') {
                return value.map((item) => {
                    formData.append(key, item, item.name);
                })

            } else {
                formData.append(key, value);
            }
        });

        await postProducts(formData).then(() => {
            resetForm()
            setAvatarPreview([])
        })
    }

    React.useEffect(() => {
        getElevators()
        getProductTypes()
    }, [])

    const dragStartHandler = (e) => {
        e.preventDefault()
        setDrag(true)
    }


    const dragLeaveHandler = (e) => {
        e.preventDefault()
        setDrag(false)
    }

    const onDropHandler = (e, setFieldValue, values) => {
        setFieldValue('image', !!values.image ? [...values.image, ...e.dataTransfer.files] : [...e.dataTransfer.files]);
        setAvatarPreview((prev) => [...prev, ...e.dataTransfer.files]);


        // [...e.dataTransfer.files].map((item) => {
        //     if (item.type === "image/jpeg" || item.type === "image/jpg") {
        //         setFieldValue('image', !!values.image ? [...values.image, ...item] : [...item]);
        //         setAvatarPreview((prev) => [...prev, item]);
        //     }
        // })
    }


    return (
        <div className={classes.addStaff_container}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
            >
                <img src={arrow} alt='' />
                <ul className={"d-flex align-items-center m-0 p-0 ps-2"} style={{ listStyle: "none" }}>
                    <li style={{ color: "#BDBDBD" }} onClick={() => navigate(-1)}>{locale === "ru" ? "Назад" : "Артқа"}</li>
                    <li style={{ margin: '0 0 0 10px', fontWeight: 600 }}>/ {locale === "ru" ? "Добавить товары" : "Өнімдерді қосу"}</li>
                </ul>
            </Box>
            <div className={classes.addStaff_container__items}>
                <div className={classes.form1}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                        validationSchema={Schema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            isSubmitting,
                            setFieldValue
                        }) => {
                            return (
                                <Form>
                                    <Typography className={"mt-4 mb-2"} sx={{ fontSize: "25px" }} >Основная информация</Typography>
                                    <div className={classNames(classes.addStaff_container__items__formStaff, "mb-3")}>
                                        <div style={{ position: "relative", margin: "30px 0" }} >
                                            <div className={classNames(isSmall ? "d-flex flex-column w-100" : "w-100 d-flex align-items-center justify-content-between", classes.formSelects)}>
                                                <Select
                                                    style={isSmall ? { border: "1px solid #eeeeee", width: "100%" } : { border: "1px solid #eeeeee", width: "49%" }}
                                                    value={values.elevator}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    name="elevator"
                                                >
                                                    <MenuItem className={"w-100"} value="default">Выберите поставщика *</MenuItem>
                                                    {!!elevators?.length && elevators.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id} className={"w-100"}>{locale === "ru" ? item.titleRu : item.titleKk}</MenuItem >
                                                    })}
                                                </Select>
                                                <Select
                                                    style={isSmall ? { border: "1px solid #eeeeee", width: "100%", marginTop: 20 } : { width: "49%", border: "1px solid #eeeeee" }}
                                                    value={values.type}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    name="type"
                                                >
                                                    <MenuItem className={"w-100"} value="default">Выберите должность *</MenuItem >
                                                    {!!productTypes?.length && productTypes.map((item) => {
                                                        return <MenuItem key={item.id} value={item.id} className={"w-100"}>{locale === "ru" ? item.titleRu : item.titleKk}</MenuItem >
                                                    })}
                                                </Select>
                                            </div>

                                            <div className={classNames(isSmall ? "d-flex flex-column w-100 mt-3" : "w-100 mt-3 d-flex align-items-center justify-content-between", classes.formSelects)}>
                                                <input
                                                    style={isSmall ? { border: "1px solid #eeeeee", width: "100%" } : { border: "1px solid #eeeeee", width: "49%" }}
                                                    placeholder='Введите код товара *'
                                                    value={values.set_number}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    name="set_number"
                                                />

                                                <input
                                                    placeholder='Введите стоимость (за кг) *'
                                                    style={isSmall ? { border: "1px solid #eeeeee", width: "100%" } : { border: "1px solid #eeeeee", width: "49%" }}
                                                    value={values.price}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    name="price"
                                                />
                                            </div>
                                            {((errors.price && touched.price) ||
                                                (touched.elevator && errors.elevator) ||
                                                (touched.type && errors.type) || (touched.productСode && errors.productСode)) && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: -50
                                                        }}
                                                    >
                                                        <p
                                                            className={'text-danger'}
                                                        >
                                                            {errors.price ||
                                                                errors.elevator ||
                                                                errors.type ||
                                                                errors.set_number
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    <Typography className={"mb-2"} sx={{ fontSize: "25px" }} >Объем заказа (макс/мин)</Typography>
                                    <div className={classNames(classes.addStaff_container__items__formStaff, "mb-5")}>
                                        <div className={isSmall ? "d-flex flex-column w-100" : "w-100 d-flex align-items-center justify-content-between mb-4"} style={{ margin: "30px 0", position: "relative" }}>
                                            <input
                                                style={{ height: 53, padding: "14px 20px" }}
                                                className={"w-100"}
                                                placeholder="Мин. объем заказа (в кг) *"
                                                value={values.min_limit}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="min_limit"
                                            />
                                            <input
                                                style={isSmall ? { marginLeft: 0, marginTop: 20 } : { marginLeft: 20 }}
                                                className={"w-100"}
                                                placeholder="Макс. объем заказа (в кг) *"
                                                value={values.max_limit}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="max_limit"
                                            />
                                            <input
                                                style={isSmall ? { marginLeft: 0, marginTop: 20 } : { marginLeft: 20 }}
                                                className={"w-100"}
                                                placeholder="Остаток (в кг) *"
                                                value={values.residue}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="residue"
                                            />
                                            {((errors.min_limit && touched.min_limit) ||
                                                (touched.max_limit && errors.max_limit) ||
                                                (touched.residue && errors.residue)) && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: -50
                                                        }}
                                                    >
                                                        <p className={'text-danger'}>
                                                            {errors.min_limit || errors.max_limit || errors.residue}
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    <Typography className={"mb-2"} sx={{ fontSize: "25px" }}>Медиа</Typography>
                                    <ImageDropzone
                                        errors={errors}
                                        touched={touched}
                                        classes={classes}
                                        classNames={classNames}
                                        dragStartHandler={dragStartHandler}
                                        dragLeaveHandler={dragLeaveHandler}
                                        onDropHandler={onDropHandler}
                                        values={values}
                                        drag={drag}
                                        isSmall={isSmall}
                                        setFieldValue={setFieldValue}
                                        avatarPreview={avatarPreview}
                                        setAvatarPreview={setAvatarPreview}
                                    />
                                    <Button type="submit" sx={{ maxWidth: 281, height: 53, width: "100%", fontSize: 18, fontWeight: 600, textTransform: "none" }} color="success" variant="contained" >Добавить товар</Button>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
                <div>

                </div>
            </div>
        </div >
    )
}

export function ImageDropzone({
    errors,
    touched,
    classes,
    classNames,
    dragStartHandler,
    dragLeaveHandler,
    onDropHandler,
    values,
    drag,
    isSmall,
    setFieldValue,
    setAvatarPreview,
    avatarPreview,
}) {
    return (
        <div
            className={classNames(classes.addStaff_container__items__formStaff_image, "mb-5")}
            style={drag ? { backgroundColor: "#F2F5F7", border: "1px dashed #219653" } : null}
            onDragStart={(e) => dragStartHandler(e)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragStartHandler(e)}
            onDrop={(e) => onDropHandler(e, setFieldValue, values)}
        >
            <div
                className={isSmall ? "d-flex flex-column w-100" : "w-100 d-flex align-items-center justify-content-between mb-4"}
                style={{ margin: "30px 0", position: "relative" }}

            >

                <div
                    className={"w-100 h-100 d-lg-flex align-items-center justify-content-center ms-5 d-none"}>
                    <Typography sx={{ color: "#828282", fontSize: 16 }}>
                        или перетащите изображение в эту область
                    </Typography>
                </div>

                <div className={classNames("w-100 h-100 d-flex align-items-center justify-content-start", classes.mediaButton)}
                    style={isSmall ? { position: "absolute", left: 0, top: -20, maxWidth: 260, width: "100%" } : { position: "absolute", left: 0, top: -6, maxWidth: 260, width: "100%" }}
                >
                    <input
                        type="file"
                        id='img'
                        style={{ position: "absolute", top: 0, width: "100%", padding: "10px 0", cursor: "pointer" }}
                        name='image'
                        placeholder="file"
                        multiple
                        accept="image/jpg, image/jpeg"
                        onChange={(e) => {
                            setFieldValue('image', !!values.image ? [...values.image, ...e.target.files] : [...e.target.files])
                            setAvatarPreview((prev) => [...prev, ...e.target.files])
                        }}

                    />
                    <button style={{ position: "absolute", top: 0, width: "100%" }} color="success" variant="contained">Загрузите изображение...</button>
                </div>

                {/* {((errors.image && touched.image)) && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: -50
                            }}
                        >
                            <p
                                className={'text-danger'}
                            >
                                {errors.image}
                            </p>
                        </div>
                    )} */}
            </div>

            {!!avatarPreview?.length && <>{avatarPreview.map(item => <Item data={item} />)}</>}


        </div>
    )
}

export function Item({ data }) {
    const [progress, setProgress] = React.useState(0);
    const mbInfo = data.size / 1024 / 1024;
    const [seconds, setSeconds] = React.useState(Math.floor(Math.random() * 7) + 3);

    // React.useEffect(() => {
    //     const timer = setInterval(() => {
    //         setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
    //     }, 800);
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + Math.floor(Math.round(mbInfo) > 3 ? Math.random() * 7 : Math.random() * 15) + 1));
        }, Math.floor(Math.random() * 150) + 50);
        return () => {
            clearInterval(timer)
        }
    }, [])

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setSeconds((seconds) => (seconds > 0 && progress !== 100 ? seconds - 1 : 0));
        }, 1000);
        return () => {
            clearInterval(timer)
        }
    }, [seconds]);

    return (
        <Box key={data.name} sx={{ width: '100%' }}>
            <div className={"d-flex align-items-center mb-3"}>
                <img style={{ width: 64, height: 54, objectFit: "cover" }} src={progress === 100 ? window.URL.createObjectURL(data) : notImage} />
                <div className={"w-100 d-flex flex-column ms-3"}>
                    <div style={{ position: "relative" }} className={"d-flex align-items-start pt-1"}>
                        <div style={{ position: "absolute" }} className={"mt-3"}>
                            <CircularProgressWithLabel value={progress} />
                        </div>
                        <p className={"mt-3"} style={{ marginLeft: 30 }}>{data.name}</p>
                    </div>
                    <p>{mbInfo.toFixed(2)} MB: {Math.round(progress)}% {seconds !== 0 &&
                        (`оставшееся время: 00:0${seconds}`)
                    }</p>
                    <LinearProgress color="success" variant="determinate" value={progress} />
                </div>
            </div>
        </Box>
    );
}


export function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            {props.value < 100 &&
                <div style={{ position: "absolute", top: -13 }}>
                    <CircularProgress variant="determinate" {...props} size={18} />
                </div>
            }
            <div style={{ color: "green", marginRight: 2 }}>
                {props.value === 100 && <CheckIcon />}
            </div>
        </Box>
    );
}

export default AddGoods