import React from 'react';
import pr from '../../Pages/Profile/Profile.module.scss';
import FormControlLabel from '@mui/material/FormControlLabel';
import hov from '../../assets/icons/hov.svg';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { profileContext } from '../../Context/ProfileContext';
import Avatar from '@mui/material/Avatar';
import { useMediaQuery } from '@mui/material';
import { userContext } from '../../providers/UserProvider';
import { localeContext } from '../../providers/LocaleProvider';

const Schema = yup.object({
  first_name: yup.string().required('Пожалуйста, заполните указанные поля'),
  phone_number: yup.string().required('Пожалуйста, заполните указанные поля'),
  email: yup.string().required('Пожалуйста, заполните указанные поля!'),
});

function Personalnformation() {
  const { user, getUser } = React.useContext(userContext);
  const { changeProfileInfo } = React.useContext(profileContext);
  const isMobile = useMediaQuery('(max-width: 578px)');
  const [avatarPreview, setAvatarPreview] = React.useState();
  const { t } = React.useContext(localeContext);

  const initialValues = {
    first_name: !!user?.firstName ? user.firstName : '',
    email: !!user?.email ? user.email : '',
    phone_number: !!user?.phoneNumber ? user.phoneNumber : '',
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    await Object.keys(values).forEach((key) => {
      const value = values[key];
      if (key === 'image') {
        formData.append(key, value, value.name);
      } else {
        formData.append(key, value);
      }
    });
    changeProfileInfo(formData).then(() => {
      getUser().then(() => {
        setAvatarPreview();
      });
    });
  };

  return (
    <>
      <h2 className={pr.personalInfo_title}>{t.profile.personalInfo.title1}</h2>
      <div className={pr.left_first}>
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
                <div className={pr.left_first_header}>
                  <label htmlFor='img'>
                    <div className={pr.loh}>
                      <Avatar
                        alt='Remy Sharp'
                        className={pr.avatar}
                        src={avatarPreview ? avatarPreview.result : user.image}
                        sx={
                          !isMobile
                            ? { width: 106, height: 106, objectFit: 'contain' }
                            : { width: 55, height: 55, objectFit: 'contain' }
                        }
                        a
                      />
                      <div className={pr.hov}>
                        <img src={hov} alt='' />
                        <p>{t.profile.personalInfo.imgButton}</p>
                      </div>
                    </div>
                  </label>
                  <input
                    className={pr.ava}
                    id='img'
                    name='image'
                    type='file'
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const fileReader = new FileReader();
                      fileReader.onload = () => {
                        if (fileReader.readyState === 2) {
                          setFieldValue('image', file);
                          setAvatarPreview(fileReader);
                        }
                      };
                      fileReader.readAsDataURL(file);
                    }}
                  />
                  <div className={pr.moremore}>
                    <h1>{user && user.firstName}</h1>
                    <div className={pr.more_info}>
                      <p>{t.profile.personalInfo.login}</p>
                      <h3>{user && user.username}</h3>
                    </div>
                  </div>
                </div>
                <FormControl
                  component='fieldset'
                  style={{ width: '100%', marginBottom: '15px' }}
                >
                  <RadioGroup
                    className={pr.radio}
                    style={{
                      display: 'none',
                      flexDirection: 'row',
                      width: '100%',
                    }}
                    aria-label='gender'
                    name='row-radio-buttons-group'
                  >
                    <FormControlLabel
                      value='female'
                      control={
                        <Radio
                          sx={{
                            color: '#219653',
                            '&.Mui-checked': {
                              color: '#219653',
                            },
                          }}
                        />
                      }
                      style={{ color: '#219653', marginRight: '34px' }}
                      label='Физ.лицо'
                    />
                    <FormControlLabel
                      value='male'
                      control={
                        <Radio
                          sx={{
                            color: '#219653',
                            '&.Mui-checked': {
                              color: '#219653',
                            },
                          }}
                        />
                      }
                      label='Юр.лицо'
                    />
                  </RadioGroup>
                </FormControl>
                <div
                  style={
                    (errors.email && touched.email) ||
                      (errors.phone_number && touched.phone_number) ||
                      (errors.first_name && touched.first_name)
                      ? { marginBottom: 28 }
                      : { marginBottom: 28 }
                  }
                  className={pr.left_first_main}
                >
                  <input
                    type='text'
                    placeholder={(user && user.firstName) || 'ФИО'}
                    value={values.first_name}
                    style={
                      errors.first_name &&
                      touched.first_name && { border: '1px solid red' }
                    }
                    name='first_name'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <input
                    type='text'
                    placeholder={(user && user.phoneNumber) || 'Номер телефона'}
                    style={
                      errors.phone_number &&
                      touched.phone_number && { border: '1px solid red' }
                    }
                    value={values.phone_number}
                    name='phone_number'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <input
                    type='text'
                    placeholder={(user && user.email) || 'Email'}
                    style={
                      errors.email && touched.email
                        ? { border: '1px solid red', marginBottom: 28 }
                        : { marginBottom: 28 }
                    }
                    value={values.email}
                    name='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {((errors.email && touched.email) ||
                    (errors.first_name && errors.first_name) ||
                    (errors.phone_number && touched.phone_number)) && (
                      <div
                        style={{
                          position: 'relative',
                        }}
                      >
                        <p
                          style={{ position: 'absolute', bottom: -15 }}
                          className={'text-danger'}
                        >
                          {errors.email ||
                            errors.first_name ||
                            errors.phone_number}
                        </p>
                      </div>
                    )}
                  <button className={pr.save_settings}>
                    {t.profile.personalInfo.button}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}

export default Personalnformation;
