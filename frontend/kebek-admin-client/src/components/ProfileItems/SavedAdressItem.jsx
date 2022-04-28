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
import { localeContext } from '../../providers/LocaleProvider';

const Schema = yup.object({
  // title_ru: yup.string().required("Введите город!"),
  // title_kk: yup.string().required("Введите город!"),
  city: yup
    .object()
    .required('Пожалуйста, заполните указанные поля!')
    .nullable(true),
  address: yup.string().required('Пожалуйста, заполните указанные поля!'),
});

function SavedAdressItem({ item, values }) {
  const { t, locale } = React.useContext(localeContext);
  const { cities, getAddresses, deleteAddresses, changedAddresses } =
    React.useContext(profileContext);
  const citiesComplete =
    cities?.map((item) => ({ label: locale === "ru" ? item.titleRu : item.titleKk, id: item.id })) || [];

  console.log(item)

  const initialValues = {
    city: { label: locale === "ru" ? item.city.titleRu : item.city.titleKk, id: item.city.id },
    address: item.address,
  };

  const [open9, setOpen9] = useState(false);
  const handleOpen9 = () => setOpen9(true);
  const handleClose9 = () => setOpen9(false);

  const [open5, setOpen5] = useState(false);
  const handleOpen5 = () => setOpen5(true);
  const handleClose5 = () => setOpen5(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const opens = Boolean(anchorEl);

  const handleClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (id) => {
    await deleteAddresses(id).then(() => {
      getAddresses();
    });
    setOpen9(false);
  };

  const handleSubmit = async (id, values) => {
    const data = {
      address: values.address,
      city: values.city.id,
    };
    await changedAddresses(id, data).then(() => {
      getAddresses();
    });
    handleClose5();
    handleClose2();
  };

  return (
    <div key={item.id} className={pr.ro}>
      <div>
        <h3>
          {item.city.titleRu}, {item.address}
        </h3>
        {/* <h3>{user.addresses[0].city.title_ru}, {user.addresses[0].address}</h3> */}
      </div>

      <MoreVertSharpIcon
        style={{ color: '#219653', cursor: 'pointer' }}
        onClick={handleClick2}
      />
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={opens}
        onClose={handleClose2}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleOpen5}>
          {t.profile.requisites.tooltip.title1}
        </MenuItem>
        <MenuItem onClick={handleOpen9}>
          {t.profile.requisites.tooltip.title2}
        </MenuItem>
        <Modal
          open={open9}
          onClose={handleClose9}
          aria-labelledby='modal-modal-title2'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <CloseIcon
              onClick={handleClose9}
              fontSize='large'
              style={{
                position: 'absolute',
                top: '33',
                right: '40',
                cursor: 'pointer',
              }}
            />
            <Typography
              id='modal-modal-title2'
              variant='h6'
              component='h2'
              style={{
                fontSize: '31px',
                lineHeight: '140%',
                marginBottom: '20px',
                textAlign: 'center',
              }}
              className={pr.modal_box}
            >
              {t.profile.requisites.modal2.deleteModal.title1}
            </Typography>
            <div className={classNames(pr.modal, pr.modal_inner)}>
              <p>{t.profile.requisites.modal2.deleteModal.title2} </p>
              <p>{t.profile.requisites.modal2.deleteModal.title3}</p>
              <button
                onClick={() => {
                  handleClose9();
                  handleClose5();
                  handleDelete(item.id);
                }}
              >
                {t.profile.requisites.modal2.deleteModal.button}
              </button>
            </div>
          </Box>
        </Modal>
        <Modal
          open={open5}
          onClose={handleClose5}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <CloseIcon
              onClick={handleClose5}
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
              {t.profile.requisites.modal2.updateModal.title}
            </Typography>
            <div className={pr.modal}>
              <Formik initialValues={initialValues} validationSchema={Schema}>
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
                            ? { marginBottom: 14 }
                            : { marginBottom: 14 }
                        }
                      >
                        <Autocomplete
                          className={classNames('mb-3')}
                          options={citiesComplete}
                          sx={{ width: '100%' }}
                          value={values.city}
                          getOptionLabel={(option) => option.label}
                          name='city'
                          onBlur={handleBlur}
                          onChange={(e, value) => setFieldValue('city', value)}
                          style={
                            errors.city &&
                            touched.city && { border: '1px solid red' }
                          }
                          renderInput={(params) => (
                            <TextField {...params} label={'Выберите город'} />
                          )}
                        />
                        <input
                          type='text'
                          placeholder='Введите улицу'
                          value={values.address}
                          onChange={handleChange}
                          name='address'
                          onBlur={handleBlur}
                          style={
                            errors.address && touched.address
                              ? { border: '1px solid red', marginBottom: 10 }
                              : { marginBottom: 10 }
                          }
                        />
                        {((errors.address && touched.address) ||
                          (errors.city && touched.city)) && (
                            <div style={{ position: 'absolute' }}>
                              <p className={'text-danger'}>
                                {errors.address || errors.city}
                              </p>
                            </div>
                          )}
                      </div>

                      {(errors.address && touched.address) ||
                        (errors.city && touched.city) ? (
                        <button type='submit'>
                          {t.profile.requisites.modal2.updateModal.button}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubmit(item.id, values)}
                          type='submit'
                        >
                          {t.profile.requisites.modal2.updateModal.button}
                        </button>
                      )}
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </Box>
        </Modal>
      </Menu>
    </div>
  );
}

export default SavedAdressItem;
