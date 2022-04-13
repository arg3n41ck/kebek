import React from 'react';
import cl from '../../Pages/Profile/Profile.module.scss';
import emptyImg from '../../assets/empty_requisits/empty_req.svg';
import { profileContext } from '../../Context/ProfileContext';
import { localeContext } from '../../providers/LocaleProvider';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { style } from '../../components/MainDrawerAdmin/MainDrawerAdmin';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Autocomplete, TextField } from '@mui/material';
import classNames from 'classnames';

const initialValues = {
  city: null,
  address: '',
};

const Schema = yup.object({
  city: yup
    .object()
    .required('Пожалуйста, заполните указанные поля!')
    .nullable(true),
  address: yup.string().required('Пожалуйста, заполните указанные поля!'),
});

function SavedAddressEmpty() {
  const { cities, addAddresses, addresses, getAddresses } =
    React.useContext(profileContext);
  const citiesComplete =
    cities?.map((item) => ({ label: item.titleRu, id: item.id })) || [];
  const { t } = React.useContext(localeContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (values) => {
    const data = {
      address: values.address,
      city: values.city.id,
    };
    await addAddresses(data).then(() => {
      getAddresses();
    });
    handleClose();
  };

  return (
    <div className={cl.address_empty}>
      <div>
        <img src={emptyImg} alt='empty_req' />
      </div>
      <div className={cl.empty_info}>
        <h2>{t.profile.requisites.emptyAddress.title}</h2>
      </div>
      <span className={cl._subtitle_info}>
        {t.profile.requisites.emptyAddress.title2}
      </span>

      {!!addresses?.length ? null : (
        <p className={cl.empty_modal} onClick={handleOpen}>
          + {t.profile.requisites.button2}
        </p>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <CloseIcon
            onClick={handleClose}
            fontSize='large'
            style={{
              position: 'absolute',
              top: '33',
              right: '40',
              cursor: 'pointer',
            }}
          />
          <Typography
            id='modal-modal-title'
            variant='h6'
            component='h2'
            style={{
              fontSize: '31px',
              lineHeight: '140%',
              marginBottom: '20px',
            }}
            className={cl.modal_box}
          >
            {t.profile.requisites.modal2.nav}
          </Typography>
          <div className={cl.modal}>
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
                isSubmitting,
                setFieldValue,
              }) => {
                return (
                  <Form>
                    <div
                      style={
                        (errors.address && touched.address) ||
                        (errors.city && touched.city)
                          ? { marginBottom: 20 }
                          : { marginBottom: 20 }
                      }
                      className={cl.saved_address__input}
                    >
                      <Autocomplete
                        className={classNames('mb-3')}
                        options={citiesComplete}
                        sx={{ width: '100%' }}
                        value={values.city}
                        style={
                          errors.city &&
                          touched.city && { border: '1px solid red' }
                        }
                        onChange={(e, value) => setFieldValue('city', value)}
                        name='city'
                        onBlur={handleBlur}
                        required
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t.profile.requisites.modal2.title1}
                            InputLabelProps={{
                              style: { fontSize: 18, color: '#969696' },
                            }}
                          />
                        )}
                      />
                      {/* {errors.city && touched.city && (
                      <p className={'text-danger'}>{errors.city}</p>
                    )} */}
                      {/* <p>
                                                Если вашего города нет в списке, посмторите{" "}
                                                <a href="#"> ближайшие обслуживающие вас элеваторы</a>
                                            </p> */}
                      <input
                        type='text'
                        style={
                          errors.address && touched.address
                            ? { border: '1px solid red', marginBottom: 10 }
                            : { marginBottom: 10 }
                        }
                        placeholder={t.profile.requisites.modal2.title2}
                        value={values.address}
                        onChange={handleChange}
                        name='address'
                        onBlur={handleBlur}
                        className='input'
                      />
                      {((errors.address && touched.address) ||
                        (errors.city && touched.city)) && (
                        <div
                          style={{
                            position: 'absolute',
                            textAlign: 'center',
                          }}
                        >
                          <p className={'text-danger'}>
                            {errors.address || errors.city}
                          </p>
                        </div>
                      )}
                    </div>
                    <button type='submit'>
                      {t.profile.requisites.modal2.button}
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default SavedAddressEmpty;
