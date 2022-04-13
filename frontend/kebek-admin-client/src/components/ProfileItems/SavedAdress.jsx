import React, { useState } from 'react';
import pr from '../../Pages/Profile/Profile.module.scss';
import classNames from 'classnames';
import {
  MenuItem,
  Menu,
  Autocomplete,
  TextField,
  FormControlLabel,
} from '@mui/material';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { style } from '../../components/MainDrawerAdmin/MainDrawerAdmin';
import { profileContext } from '../../Context/ProfileContext';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { userContext } from '../../providers/UserProvider';
import SavedAdressItem from './SavedAdressItem';
import { localeContext } from '../../providers/LocaleProvider';
import SavedAddressEmpty from './SavedAddressEmpty';

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

function SavedAdress() {
  const { cities, addAddresses, addresses, getAddresses } =
    React.useContext(profileContext);
  const citiesComplete =
    cities?.map((item) => ({ label: item.titleRu, id: item.id })) || [];
  const { t } = React.useContext(localeContext);
  const [open, setOpen] = useState(false);
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
    <div className={pr.save_addr_cont}>
      <div className={classNames(pr.left_second, pr.left_third)}>
        <div className={classNames(pr.left_second__container)}>
          <h2>{t.profile.requisites.title2}</h2>
          {!!addresses?.length && (
            <p onClick={handleOpen}>+ {t.profile.requisites.button2}</p>
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
                className={pr.modal_box}
              >
                {t.profile.requisites.modal2.nav}
              </Typography>
              <div className={pr.modal}>
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
                              ? { marginBottom: 28 }
                              : { marginBottom: 28 }
                          }
                          className={pr.saved_address__input}
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
                            onChange={(e, value) =>
                              setFieldValue('city', value)
                            }
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
        <div
          className={
            !!addresses.length ? pr.second_inner : pr.second_inner__address
          }
        >
          {!!addresses?.length ? (
            addresses.map((item) => {
              return <SavedAdressItem item={item} />;
            })
          ) : (
            <SavedAddressEmpty />
          )}
        </div>
      </div>
    </div>
  );
}

export default SavedAdress;
