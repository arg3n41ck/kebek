import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { localeContext } from '../../providers/LocaleProvider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import classes from './Delivery.module.scss';
import arrow from '../../assets/icons/left-arrow 1.svg';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { goodsContext } from '../../providers/GoodsProvider';
import { deliveryContext } from '../../providers/DeliveriesProvider';

const Schema = yup.object({
  elevator: yup.string().required('Пожалуйста, заполните указанные поля!'),
  title_ru: yup.string().required('Пожалуйста, заполните указанные поля!'),
  // title_kk: yup.string().required('Пожалуйста, заполните указанные поля!'),
  type: yup.string().required('Пожалуйста, заполните указанные поля!'),
  price: yup.string().required('Пожалуйста, заполните указанные поля!'),
});

function AddDelivery() {
  const { locale } = useContext(localeContext);
  const navigate = useNavigate();
  const { elevators, getElevators } = React.useContext(goodsContext)
  const { deliveryType, getDeliveryTypes, postDelivery } = React.useContext(deliveryContext)

  const handleSubmit = async (values, resetForm) => {
    const data = {
      elevator: values.elevator,
      title_ru: values.title_ru,
      title_kk: values.title_kk,
      type: typeof values.type === "number" ? values.type : Number(values.type),
      price: typeof values.price === "number" ? values.price : Number(values.price),
    }
    await postDelivery(data)
    resetForm();
    await navigate(-1);
  };

  React.useEffect(() => {
    !elevators?.length && getElevators()
    !deliveryType?.length && getDeliveryTypes()
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
              / {locale === 'ru' ? 'Добавить доставку' : 'Жеткізу қосу'}
            </li>
          </ul>
        </Box>
      </div>
      <h1 style={{ margin: '30px 0 10px 0', fontSize: '25px' }}>
        Основная информация
      </h1>
      <Formik
        initialValues={{ elevator: 'default', title_ru: '', title_kk: '', price: '', type: 'default' }}
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
                error={errors.elevator || touched.elevator}
              >
                <MenuItem value="default">
                  Выберите поставщика *
                </MenuItem>

                {!!elevators?.length && elevators.map((item) => {
                  return <MenuItem key={item.id} value={item.id}>
                    {locale === "ru" ? item.titleRu : item.titleKk}
                  </MenuItem>
                })}

              </TextField>
              <TextField
                fullWidth
                id='outlined-select-currency'
                select
                name='type'
                value={values.type}
                onChange={handleChange}
                error={errors.type || touched.type}
              >
                <MenuItem value="default">
                  Выберите тип доставки *
                </MenuItem>
                {!!deliveryType?.length && deliveryType.map((item) => {
                  return <MenuItem key={item.id} value={item.id}>
                    {locale === "ru" ? item.titleRu : item.titleKk}
                  </MenuItem>
                })}
              </TextField>
              <input
                className={classes.name_ru}
                type='text'
                placeholder={'Введите наименование (рус) *'}
                name='title_ru'
                value={values.title_ru}
                onBlur={handleBlur}
                onChange={handleChange}
                style={
                  (errors.title_ru || touched.title_ru) && {
                    border: '1px solid red',
                  }
                }
              />
              <input
                className={classes.name_kz}
                type='text'
                placeholder={'Введите наименование (каз) *'}
                name='title_kk'
                value={values.title_kk}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            <h1 style={{ margin: '30px 0 10px 0', fontSize: '25px' }}>
              Стоимость (Кг)
            </h1>
            <div className={classes.price_section}>
              <input
                className={classes.price_kg}
                type='text'
                placeholder={'Введите стоимость (за кг) *'}
                name='price'
                value={values.price}
                onBlur={handleBlur}
                onChange={handleChange}
                style={
                  (errors.price || touched.price) && {
                    border: '1px solid red',
                  }
                }
              />
            </div>
            {(
              (touched.title_ru && errors.title_ru) ||
              (errors.price && touched.price) ||
              (errors.elevator && touched.elevator) ||
              (errors.type && touched.type)) && (
                <div style={{ position: 'relative' }}>
                  <p
                    style={{
                      position: 'absolute',
                      top: -25,
                    }}
                    className={'text-danger'}
                  >
                    {
                      errors.title_ru ||
                      errors.price ||
                      errors.elevator || errors.type}
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
              Добавить доставку
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddDelivery;
