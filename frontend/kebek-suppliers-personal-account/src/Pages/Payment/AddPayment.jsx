import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { localeContext } from '../../providers/LocaleProvider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import classes from './Payment.module.scss';
import arrow from '../../assets/icons/left-arrow 1.svg';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { paymentContext } from '../../providers/PaymentProvider';
import { goodsContext } from '../../providers/GoodsProvider';

const Schema = yup.object({
  elevator: yup.string().required('Пожалуйста, заполните указанные поля!'),
  type: yup.string().required('Пожалуйста, заполните указанные поля!'),
  minutes: yup.string().required('Пожалуйста, заполните указанные поля!'),
});

function AddPayment() {
  const { locale } = useContext(localeContext);
  const navigate = useNavigate();
  const { paymentType, postPayment, getPaymentTypes } = React.useContext(paymentContext)
  const { elevators, getElevators, } = React.useContext(goodsContext)

  const handleSubmit = async (values, resetForm) => {
    const data = {
      elevator: values.elevator !== "default" ? values.elevator : "",
      type: values.type !== "default" ? values.type : "",
      minutes: values.minutes

    }
    await postPayment(data).then(() => {
      resetForm();
    })
    navigate(-1);
  };

  React.useEffect(() => {
    getPaymentTypes()
    getElevators()
  }, [])

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
              / {locale === 'ru' ? 'Добавить оплату' : 'Төлем қосу'}
            </li>
          </ul>
        </Box>
      </div>
      <h1 style={{ margin: '30px 0 10px 0', fontSize: '25px' }}>
        Основная информация
      </h1>
      <Formik
        initialValues={{ elevator: 'default', type: 'default', minutes: '' }}
        validationSchema={Schema}
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
                error={errors.elevator || touched.elevator}
              >
                <MenuItem value="default">
                  Выберите поставщика
                </MenuItem>
                {!!elevators?.length && elevators.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
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
                error={errors.type || touched.type}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <MenuItem value="default">
                  Выберите тип оплаты
                </MenuItem>
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
                style={
                  (errors.minutes || touched.minutes) && { border: '1px solid red' }
                }
              />
            </div>
            {((errors.type && touched.type) ||
              (touched.elevator && errors.elevator) ||
              (errors.minutes && touched.minutes)) && (
                <div style={{ position: 'relative' }}>
                  <p
                    style={{
                      position: 'absolute',
                      top: -27,
                    }}
                    className={'text-danger'}
                  >
                    {errors.type || errors.minutes || errors.elevator}
                  </p>
                </div>
              )}
            <Button
              sx={{ height: 54, borderRadius: 1, maxWidth: 281, width: '100%' }}
              fontWeight='fontWeightBold'
              variant='contained'
              color='success'
              type='submit'
            >
              Добавить оплату
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddPayment;
