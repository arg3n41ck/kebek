import React, { useContext, useEffect } from 'react';
import classes from './Payment.module.scss';
import Box from '@mui/material/Box';
import arrow from '../../assets/icons/left-arrow 1.svg';
import { useNavigate } from 'react-router-dom';
import { localeContext } from '../../providers/LocaleProvider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { paymentContext } from "../../providers/PaymentProvider"
import { useParams } from "react-router-dom"
import Loader from "../../components/Loader/Loader"
import { goodsContext } from '../../providers/GoodsProvider';

function EditPayment() {
  const formRef = React.useRef(null);
  const navigate = useNavigate();
  const { getPaymentById, paymentById, getPaymentTypes, paymentType, setPaymentById, changedPayment, getPayment } = React.useContext(paymentContext)
  const { elevators, getElevators } = React.useContext(goodsContext)
  const { locale } = useContext(localeContext);
  const { id } = useParams()

  useEffect(() => {
    formRef.current.setValues({
      elevator: !!paymentById?.elevator?.id ? paymentById.elevator.id : "",
      type: !!paymentById?.type?.id ? paymentById.type.id : "",
      minutes: !!paymentById?.minutes ? paymentById.minutes : ""
    })
  }, [paymentById]);

  const initialValues = {
    elevator: !!paymentById?.elevator?.id ? paymentById.elevator.id : "",
    type: !!paymentById?.type?.id ? paymentById.type.id : "",
    minutes: !!paymentById?.minutes ? paymentById.minutes : ""
  }

  const handleSubmit = async (values, resetForm) => {
    await changedPayment(id, values).then(() => {
      getPayment()
    })
    resetForm();
    navigate(-1);
    // toast.warning(
    //   'Заказ « Ново-Альджанский... » скоро будет отменен, измените время в настройках'
    // );
  };

  useEffect(() => {
    getPaymentById(id)
    getElevators()
    getPaymentTypes()

    // return () => {
    //   setPaymentById(null)
    // }
  }, [id])


  if (!paymentById?.id && (!paymentType.length && !elevators.length)) {
    return <Loader />
  }

  return (
    <div>
      <div className={classes.navigation_section}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <ul
            className={'d-flex align-items-center m-0 p-0 ps-2'}
            style={{ listStyle: 'none' }}
          >
            <li style={{ color: '#BDBDBD' }} onClick={() => navigate(-1)}>
              <img
                src={arrow}
                alt='arrow'
                width={20}
                height={20}
                style={{ marginRight: 10 }}
              />
              {locale === 'ru' ? 'Назад' : 'Артқа'}
            </li>
            <li style={{ margin: '0 0 0 10px', fontWeight: 600 }}>
              / {locale === 'ru' ? 'Изменить оплату' : 'Төлемді өзгерту'}
            </li>
          </ul>
        </Box>
      </div>
      <h1 style={{ margin: '30px 0 10px 0', fontSize: '25px' }}>
        Основная информация
      </h1>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        // validate={}
        onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <div className={classes.main_info}>
              <TextField
                fullWidth
                id='outlined-select-currency'
                select
                name='elevator'
                value={values.elevator}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {!!elevators?.length && elevators.map((item) => (
                  <MenuItem defaultValue={"siu"} key={item.id} value={item.id}>
                    {locale === "ru" ? item.titleRu : item.titleKk}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                id='outlined-select-currency2'
                select
                name='type'
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {!!paymentType?.length && paymentType.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {locale === "ru" ? item.titleRu : item.titleKk}
                  </MenuItem>
                ))}
              </TextField>
              <input
                className={classes.time}
                type='text'
                placeholder={'Время до отмены заказа (мин.) *'}
                name='minutes'
                value={values.minutes}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            <Button
              type='submit'
              sx={{ height: 54, borderRadius: 1, maxWidth: 281, width: '100%' }}
              fontWeight='fontWeightBold'
              variant='contained'
              color='success'
            >
              Изменить оплату
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditPayment;
