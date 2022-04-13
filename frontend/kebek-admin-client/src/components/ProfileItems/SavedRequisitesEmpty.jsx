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

function SavedRequisitesEmpty() {
  const { requisites, addRequisite, getRequisites } =
    React.useContext(profileContext);
  const [openAddRequisiteModal, setOpenAddRequisiteModal] =
    React.useState(false);
  const handleOpenAddRequisiteModal = () => setOpenAddRequisiteModal(true);
  const handleCloseAddRequisiteModal = () => setOpenAddRequisiteModal(false);
  const { t } = React.useContext(localeContext);

  const handleSubmit = async (requisites) => {
    await addRequisite(requisites).then(() => {
      getRequisites();
    });
    handleCloseAddRequisiteModal();
  };
  return (
    <div className={cl.savedEmpty}>
      <div>
        <img src={emptyImg} alt='empty_req' />
      </div>
      <div className={cl.empty_info}>
        <h2>{t.profile.requisites.emptyReq.title}</h2>
      </div>
      <p className={cl._subtitle_info}>
        {t.profile.requisites.emptyReq.title2}
      </p>
      {!!requisites?.length ? null : (
        <p className={cl.empty_modal} onClick={handleOpenAddRequisiteModal}>
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
            className={cl.modal_box}
          >
            {t.profile.requisites.modal1.updateModal.title}
          </Typography>
          <div className={cl.modal}>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={Schema}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => {
                return (
                  <Form>
                    <div
                      style={
                        (errors.title && touched.title) ||
                        (errors.checking_account && touched.checking_account) ||
                        (errors.bik && touched.bik) ||
                        (errors.bin && touched.bin)
                          ? { marginBottom: 28 }
                          : { marginBottom: 28 }
                      }
                    >
                      <input
                        type='text'
                        placeholder={t.profile.requisites.modal1.title1}
                        value={values.title}
                        name='title'
                        className='mb-2'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={
                          errors.title &&
                          touched.title && {
                            border: '1px solid red',
                          }
                        }
                      />
                      <input
                        type='text'
                        placeholder={t.profile.requisites.modal1.title2}
                        value={values.bin}
                        name='bin'
                        onChange={handleChange}
                        className={'mb-2'}
                        onBlur={handleBlur}
                        style={
                          errors.bin &&
                          touched.bin && { border: '1px solid red' }
                        }
                      />
                      <input
                        type='text'
                        placeholder={t.profile.requisites.modal1.title3}
                        value={values.bik}
                        name='bik'
                        className='mb-2'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={
                          errors.bik &&
                          touched.bik && { border: '1px solid red' }
                        }
                      />
                      <input
                        type='text'
                        placeholder={t.profile.requisites.modal1.title4}
                        value={values.checking_account}
                        name='checking_account'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={
                          errors.checking_account && touched.checking_account
                            ? { border: '1px solid red' }
                            : { marginBottom: 0 }
                        }
                      />
                      {((errors.title && touched.title) ||
                        (errors.checking_account && touched.checking_account) ||
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
  );
}

export default SavedRequisitesEmpty;
