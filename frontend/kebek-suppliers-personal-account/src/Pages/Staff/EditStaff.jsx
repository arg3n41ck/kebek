import React from 'react';
import classes from './Staff.module.scss';
import arrow from '../../assets/icons/left-arrow 1.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { localeContext } from '../../providers/LocaleProvider';
import {
    Button,
    Typography,
    Select,
    MenuItem,
    useMediaQuery,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import classNames from 'classnames';
import { goodsContext } from '../../providers/GoodsProvider';
import { userContext } from '../../providers/UserProvider';
import { staffContext } from '../../providers/StaffProvider';
import ReactInputMask from "react-input-mask"
import Loader from '../../components/Loader/Loader';


const Schema = yup.object({
    first_name: yup.string().required('Пожалуйста, заполните указанные поля!'),
    elevator: yup.string().required('Пожалуйста, заполните указанные поля!'),
    user_role: yup.string().required('Пожалуйста, заполните указанные поля!'),
    phone_number: yup.string().required('Пожалуйста, заполните указанные поля!'),
    email: yup.string().required('Пожалуйста, заполните указанные поля!'),
});

const position = [
    {
        id: 1,
        title: "Администратор",
        value: "AR"
    },
    {
        id: 2,
        title: "Бухгалтер",
        value: "AC"
    },
    {
        id: 3,
        title: "Поставщик",
        value: "OW"
    },
    {
        id: 4,
        title: "Клиент",
        value: "CL"
    }
]



function EditStaff() {
    const { locale } = React.useContext(localeContext);
    const navigate = useNavigate();
    const isSmall = useMediaQuery('(max-width: 578px)');
    const { elevators, getElevators } = React.useContext(goodsContext)
    const { postStaff, getStaffById, staffById, patchStaff } = React.useContext(staffContext)
    const { user } = React.useContext(userContext)
    const { id } = useParams()
    const formRef = React.useRef(null)

    const initialValues = {
        first_name: !!staffById?.firstName ? staffById.firstName : '',
        elevator: !!staffById?.elevators ? staffById.elevators[0] : 'default',
        user_role: !!staffById?.userRole ? staffById.userRole : 'default',
        phone_number: !!staffById?.phoneNumber ? staffById.phoneNumber : '',
        email: !!staffById?.email ? staffById.email : '',
    };

    const handleSubmit = async (values, resetForm, id) => {
        const data = {
            first_name: values.first_name,
            elevator: values.elevator !== "default" ? values.elevator : "",
            user_role: values.user_role !== "default" ? values.user_role : "",
            phone_number: values.phone_number,
            email: values.email,
            username: values.phone_number
        }
        await patchStaff(id, data).then(() => {
            resetForm();
            navigate(-1)
        })
    };

    React.useEffect(() => {
        formRef.current.setValues({
            first_name: !!staffById?.firstName ? staffById.firstName : '',
            elevators: !!staffById?.elevators ? staffById.elevators[0] : 'default',
            user_role: !!staffById?.userRole ? staffById.userRole : 'default',
            phone_number: !!staffById?.phoneNumber ? staffById.phoneNumber : '',
            email: !!staffById?.email ? staffById.email : '',
        })
    }, [staffById]);

    React.useEffect(() => {
        getStaffById(id)
    }, [id])

    React.useEffect(() => {
        !elevators?.length && getElevators()
    }, [])

    if (!staffById?.id && !elevators) {
        return <Loader />
    }

    return (
        <div className={classes.addStaff_container}>
            <divcx
                className={'d-flex align-items-center'}
                style={{ cursor: 'pointer' }}
            >
                <img src={arrow} alt='' />
                <ul
                    className={'d-flex align-items-center m-0 p-0 ps-2'}
                    style={{ listStyle: 'none' }}
                >
                    <li style={{ color: '#BDBDBD' }} onClick={() => navigate(-1)}>
                        {locale === 'ru' ? 'Назад' : 'Артқа'}
                    </li>
                    <li style={{ margin: '0 0 0 10px', fontWeight: 600 }}>
                        / {locale === 'ru' ? 'Изменить сотрудника' : 'Қызметкерді қосу'}
                    </li>
                </ul>
            </divcx>
            <div className={classNames(classes.addStaff_container__items, 'mt-5')}>
                <Formik
                    innerRef={formRef}
                    initialValues={initialValues}
                    onSubmit={(values, { resetForm }) => {
                        handleSubmit(values, resetForm, id);
                    }}
                    validationSchema={Schema}
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
                            <Form>
                                <Typography sx={{ fontSize: '25px' }}>
                                    Основная информация
                                </Typography>
                                <div
                                    className={classNames(
                                        classes.addStaff_container__items__formStaff,
                                        'mb-4'
                                    )}
                                >
                                    <div style={{ position: 'relative', margin: '30px 0' }}>
                                        <input
                                            style={{ height: 53, padding: '14px 20px' }}
                                            className={'w-100 mb-4'}
                                            placeholder='Введите ФИО сотрудника *'
                                            value={values.first_name}
                                            onChange={handleChange}
                                            onBlu={handleBlur}
                                            name='first_name'
                                        />
                                        <div
                                            className={classNames(
                                                isSmall
                                                    ? 'd-flex flex-column w-100'
                                                    : 'w-100 d-flex align-items-center justify-content-between',
                                                classes.formSelects
                                            )}
                                        >
                                            <Select
                                                style={
                                                    isSmall
                                                        ? { border: '1px solid #eeeeee', width: '100%' }
                                                        : { border: '1px solid #eeeeee', width: '49%' }
                                                }
                                                value={values.elevator}
                                                defaultValue='jack'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name='elevator'
                                            >
                                                <MenuItem className={'w-100'} value='default'>
                                                    Выберите поставщика *
                                                </MenuItem>
                                                {!!elevators?.length && elevators.map((item) => {
                                                    return <MenuItem className={'w-100'} value={item.id} >
                                                        {item.titleRu}
                                                    </MenuItem>
                                                })}
                                            </Select>
                                            <Select
                                                style={
                                                    isSmall
                                                        ? {
                                                            border: '1px solid #eeeeee',
                                                            width: '100%',
                                                            marginTop: 20,
                                                        }
                                                        : { width: '49%', border: '1px solid #eeeeee' }
                                                }
                                                defaultValue='jack'
                                                value={values.user_role}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name='user_role'
                                            >
                                                <MenuItem className={'w-100'} value='default'>
                                                    Выберите должность *
                                                </MenuItem>
                                                {!!position?.length && position.map((item) => {
                                                    return <MenuItem className={'w-100'} value={item.value}>
                                                        {item.title}
                                                    </MenuItem>
                                                })}
                                            </Select>
                                        </div>
                                        {((errors.first_name && touched.first_name) ||
                                            (touched.elevator && errors.elevator) ||
                                            (touched.user_role && errors.user_role)) && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -50,
                                                    }}
                                                >
                                                    <p className={'text-danger'}>
                                                        {errors.first_name ||
                                                            errors.elevator ||
                                                            errors.user_role}
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <Typography sx={{ fontSize: '25px' }}>
                                    Контактные данные
                                </Typography>
                                <div
                                    className={classNames(
                                        classes.addStaff_container__items__formStaff,
                                        'mb-5'
                                    )}
                                >
                                    <div
                                        className={
                                            isSmall
                                                ? 'd-flex flex-column w-100'
                                                : 'w-100 d-flex align-items-center justify-content-between mb-4'
                                        }
                                        style={{ margin: '30px 0', position: 'relative' }}
                                    >
                                        <ReactInputMask
                                            style={errors.username && touched.username ? {
                                                border: "1px solid red", height: 53,
                                                padding: '14px 20px',
                                            } : {
                                                height: 53,
                                                padding: '14px 20px',
                                            }}
                                            mask="+7(999)9999999"
                                            // mask="+999999999999"
                                            type="text"
                                            className={"w-100"}
                                            placeholder={locale === "ru" ? "Введите номер телефона" : "Телефон нөмірін енгізіңіз"}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.phone_number}
                                            name="phone_number"
                                        />
                                        {/* <input
                      className={'w-100'}
                      placeholder='Введите ФИО сотрудника *'
                      value={values.phone_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='phone_number'
                      style={
                        errors.phone_number || touched.phone_number
                          ? {
                            border: '1px solid red',
                            height: 53,
                            padding: '14px 20px',
                          }
                          : { height: 53, padding: '14px 20px' }
                      }
                    /> */}
                                        <input
                                            style={
                                                isSmall
                                                    ? {
                                                        height: 53,
                                                        padding: '14px 20px',
                                                        marginLeft: 0,
                                                        marginTop: 20,
                                                    }
                                                    : { height: 53, padding: '14px 20px', marginLeft: 20 }
                                            }
                                            className={'w-100'}
                                            placeholder='Введите Email *'
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name='email'
                                        />
                                        {((errors.phone_number && touched.phone_number) ||
                                            (touched.email && errors.email)) && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -50,
                                                    }}
                                                >
                                                    <p className={'text-danger'}>
                                                        {errors.phone_number || errors.email}
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <Button
                                    type='submit'
                                    sx={{
                                        maxWidth: 281,
                                        height: 53,
                                        width: '100%',
                                        fontSize: 18,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                    }}
                                    color='success'
                                    variant='contained'
                                >
                                    Изменить сотрудника
                                </Button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}

export default EditStaff;
