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
import { userContext } from '../../providers/UserProvider';
import SavedRequisitesItem from './SavedRequisitesItem';
import { localeContext } from '../../providers/LocaleProvider';
import SavedRequisitesEmpty from './SavedRequisitesEmpty';

const initialValues = {
  title: '',
  bin: '',
  bik: '',
  checking_account: '',
};

const Schema = yup.object({
  title: yup.string().required('Пожалуйста, заполните указанные поля!'),
  bin: yup.string().required('Пожалуйста, заполните указанные поля!'),
  bik: yup.string().required('Пожалуйста, заполните указанные поля!'),
  checking_account: yup
    .string()
    .required('Пожалуйста, заполните указанные поля!'),
});

function SavedRequisites() {
  const {
    addRequisite,
    requisites,
    deleteRequisite,
    changedRequisite,
    getRequisites,
  } = React.useContext(profileContext);
  const [openAddRequisiteModal, setOpenAddRequisiteModal] = useState(false);
  const handleOpenAddRequisiteModal = () => setOpenAddRequisiteModal(true);
  const handleCloseAddRequisiteModal = () => setOpenAddRequisiteModal(false);
  const { t } = React.useContext(localeContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleSubmit = async (requisites) => {
    await addRequisite(requisites).then(() => {
      getRequisites();
    });
    handleCloseAddRequisiteModal();
  };

  return (
    <div className={pr.left_second}>
      <div className={pr.left_second__container}>
        <h2 className={pr.personalInfo_title}>{t.profile.requisites.title1}</h2>
        {!!requisites?.length && (
          <p onClick={handleOpenAddRequisiteModal}>
            + {t.profile.requisites.button1}
          </p>
        )}

        <Modal
          open={openAddRequisiteModal}
          onClose={handleCloseAddRequisiteModal}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <CloseIcon
              onClick={handleCloseAddRequisiteModal}
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
              {t.profile.requisites.modal1.updateModal.title}
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
                }) => {
                  return (
                    <Form>
                      <div
                        style={
                          (errors.title && touched.title) ||
                          (errors.checking_account &&
                            touched.checking_account) ||
                          (errors.bik && touched.bik) ||
                          (errors.bin && touched.bin)
                            ? { marginBottom: 28 }
                            : { marginBottom: 28 }
                        }
                      >
                        <input
                          type='text'
                          placeholder={t.profile.requisites.modal1.title1}
                          style={
                            errors.title &&
                            touched.title && { border: '1px solid red' }
                          }
                          value={values.title}
                          name='title'
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <input
                          type='text'
                          className={'mt-2'}
                          placeholder={t.profile.requisites.modal1.title2}
                          value={values.bin}
                          style={
                            errors.bin &&
                            touched.bin && { border: '1px solid red' }
                          }
                          name='bin'
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <input
                          type='text'
                          className={'mt-2'}
                          placeholder={t.profile.requisites.modal1.title3}
                          value={values.bik}
                          name='bik'
                          onChange={handleChange}
                          style={
                            errors.bik &&
                            touched.bik && { border: '1px solid red' }
                          }
                          onBlur={handleBlur}
                        />
                        <input
                          type='text'
                          className={'mt-2'}
                          placeholder={t.profile.requisites.modal1.title4}
                          value={values.checking_account}
                          name='checking_account'
                          onChange={handleChange}
                          style={
                            errors.checking_account && touched.checking_account
                              ? { border: '1px solid red' }
                              : { marginBottom: 0 }
                          }
                          onBlur={handleBlur}
                        />
                        {((errors.title && touched.title) ||
                          (errors.checking_account &&
                            touched.checking_account) ||
                          (errors.bik && touched.bik) ||
                          (errors.bin && touched.bin)) && (
                          <div
                            style={{
                              position: 'absolute',
                              textAlign: 'center',
                            }}
                          >
                            <p className={'text-danger'}>
                              {errors.checking_account ||
                                errors.bik ||
                                errors.bin ||
                                errors.title}
                            </p>
                          </div>
                        )}
                      </div>
                      <button>{t.profile.requisites.modal1.button}</button>
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
          !!requisites?.length ? pr.second_inner__req : pr.second_inner__con
        }
      >
        {!!requisites?.length ? (
          requisites.map((item) => {
            return <SavedRequisitesItem item={item} />;
          })
        ) : (
          <SavedRequisitesEmpty />
        )}
      </div>
    </div>
  );
}

export default SavedRequisites;
