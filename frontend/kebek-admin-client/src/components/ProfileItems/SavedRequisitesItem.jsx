import React, { useState } from 'react';
import pr from '../../Pages/Profile/Profile.module.scss';
import classNames from 'classnames';
import { MenuItem, Menu } from '@mui/material';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { style } from '../../components/MainDrawerAdmin/MainDrawerAdmin';
import { profileContext } from '../../Context/ProfileContext';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
// import { userContext } from '../../providers/UserProvider';
import { localeContext } from '../../providers/LocaleProvider';

const Schema = yup.object({
  title: yup.string().required('Пожалуйста, заполните указанные поля!'),
  bin: yup.string().required('Пожалуйста, заполните указанные поля!'),
  bik: yup.string().required('Пожалуйста, заполните указанные поля!'),
  checking_account: yup
    .string()
    .required('Пожалуйста, заполните указанные поля!'),
});

function SavedRequisitesItem({ item }) {
  const { getRequisites, deleteRequisite, changedRequisite } =
    React.useContext(profileContext);
  const { t } = React.useContext(localeContext);

  const initialValues = {
    title: item.title,
    bin: item.bin,
    bik: item.bik,
    checking_account: item.checkingAccount,
  };

  const [openDeleteRequisiteModal, setOpenDeleteRequisiteModal] =
    useState(false);
  const handleOpenDeleteRequisiteModal = (id) => {
    setOpenDeleteRequisiteModal(true);
  };
  const handleCloseDeleteRequisiteModal = () =>
    setOpenDeleteRequisiteModal(false);

  const [openEditRequisiteModal, setOpenEditRequisiteModal] = useState(false);
  const handleOpenEditRequisiteModal = () => setOpenEditRequisiteModal(true);
  const handleCloseEditRequisiteModal = () => setOpenEditRequisiteModal(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const openReqiusiteDetailMenu = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (id) => {
    await deleteRequisite(id).then(() => {
      getRequisites();
    });
    setOpenDeleteRequisiteModal(false);
  };

  const handleSubmit = async (id, requisites) => {
    await changedRequisite(id, requisites).then(() => {
      getRequisites();
    });
    handleCloseEditRequisiteModal();
  };

  return (
    <div key={item.id} className={pr.ro}>
      <div>
        <h3>{item.title}</h3>
        <p>
          БИН {item.bin}; БИК {item.bik}; РС {item.checkingAccount}
        </p>
      </div>
      <MoreVertSharpIcon
        style={{ color: '#219653', cursor: 'pointer' }}
        onClick={handleOpen}
      />
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={openReqiusiteDetailMenu}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleOpenEditRequisiteModal}>
          {t.profile.requisites.tooltip.title1}
        </MenuItem>
        <MenuItem onClick={() => handleOpenDeleteRequisiteModal(item.id)}>
          {t.profile.requisites.tooltip.title2}
        </MenuItem>
        <Modal
          open={openDeleteRequisiteModal}
          onClose={handleCloseDeleteRequisiteModal}
          aria-labelledby='modal-modal-title2'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <CloseIcon
              onClick={handleCloseDeleteRequisiteModal}
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
              {t.profile.requisites.modal1.deleteModal.title1}
            </Typography>
            <div className={classNames(pr.modal, pr.modal_inner)}>
              <p>{t.profile.requisites.modal1.deleteModal.title2} </p>
              <p>{t.profile.requisites.modal1.deleteModal.title3}</p>
              <button onClick={() => handleDelete(item.id)}>
                {t.profile.requisites.modal1.deleteModal.button}
              </button>
            </div>
          </Box>
        </Modal>

        <Modal
          open={openEditRequisiteModal}
          onClose={handleCloseEditRequisiteModal}
          aria-labelledby='modal-modal-title2'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <CloseIcon
              onClick={handleCloseEditRequisiteModal}
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
              }}
              className={pr.modal_box}
            >
              {t.profile.requisites.modal1.updateModal.title}
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
                }) => {
                  return (
                    <Form>
                      <div
                        style={
                          errors.checking_account && touched.checking_account
                            ? { marginBottom: 28 }
                            : { marginBottom: 28 }
                        }
                      >
                        <input
                          type='text'
                          placeholder={t.profile.requisites.modal1.title1}
                          value={values.title}
                          style={
                            errors.title && touched.title
                              ? { border: '1px solid red', marginBottom: 10 }
                              : { marginBottom: 10 }
                          }
                          name='title'
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <input
                          type='text'
                          placeholder={t.profile.requisites.modal1.title2}
                          value={values.bin}
                          style={
                            errors.bin && touched.bin
                              ? { border: '1px solid red', marginBottom: 10 }
                              : { marginBottom: 10 }
                          }
                          name='bin'
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <input
                          type='text'
                          placeholder={t.profile.requisites.modal1.title3}
                          value={values.bik}
                          name='bik'
                          style={
                            errors.bik && touched.bik
                              ? { border: '1px solid red', marginBottom: 10 }
                              : { marginBottom: 10 }
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <input
                          type='text'
                          placeholder={t.profile.requisites.modal1.title4}
                          value={values.checking_account}
                          name='checking_account'
                          onChange={handleChange}
                          style={
                            errors.checking_account && touched.checking_account
                              ? { border: '1px solid red', marginBottom: 10 }
                              : { marginBottom: 10 }
                          }
                          onBlur={handleBlur}
                        />
                        {((errors.checking_account &&
                          touched.checking_account) ||
                          (errors.bik && touched.bik) ||
                          (errors.bin && touched.bin) ||
                          (errors.title && touched.title)) && (
                          <div style={{ position: 'absolute' }}>
                            <p className={'text-danger'}>
                              {errors.checking_account ||
                                errors.bik ||
                                errors.bin ||
                                errors.title}
                            </p>
                          </div>
                        )}
                      </div>
                      {(errors.checking_account && touched.checking_account) ||
                      (errors.bin && touched.bin) ||
                      (errors.bik && touched.bik) ||
                      (errors.title && touched.title) ? (
                        <button>
                          {t.profile.requisites.modal1.updateModal.button}
                        </button>
                      ) : (
                        <button
                          type='submit'
                          onClick={() => handleSubmit(item.id, values)}
                        >
                          {t.profile.requisites.modal1.updateModal.button}
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

export default SavedRequisitesItem;
