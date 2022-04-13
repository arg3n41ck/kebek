import React from 'react';
import pr from '../../Pages/Profile/Profile.module.scss';
import { FormControlLabel } from '@mui/material';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { profileContext } from '../../Context/ProfileContext';
import { localeContext } from '../../providers/LocaleProvider';

const initialValues = {
  new_password: '',
  old_password: '',
};

const Schema = yup.object({
  old_password: yup.string().required('Пожалуйста, заполните указанные поля!'),
  new_password: yup.string().required('Пожалуйста, заполните указанные поля!'),
});

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 2,
    margin: 0,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',

      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#219653',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#219653',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#219653',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

function Settings() {
  const { changePassword } = React.useContext(profileContext);
  const { t } = React.useContext(localeContext);

  const handleSubmit = async (values) => {
    await changePassword(values);
  };

  return (
    <div className={pr.sett_cont}>
      <h2>{t.profile.settings.nav}</h2>
      <div className={pr.right_second}>
        <div className={pr.push_massage}>
          <h2>{t.profile.settings.title1}</h2>
        </div>
        <div className={pr.push_massage}>
          <h5>{t.profile.settings.title5}</h5>
          <FormControlLabel control={<IOSSwitch defaultChecked />} label='' />
        </div>
        <div className={pr.push_massage}>
          <h5>{t.profile.settings.title6}</h5>
          <FormControlLabel control={<IOSSwitch defaultChecked />} label='' />
        </div>
        {/* <p>{t.profile.settings.title2}</p> */}
        <div className={pr.pass_settings}>
          <h2>{t.profile.settings.title3}</h2>
          {/* <p>{t.profile.settings.title4}</p> */}
          <Formik
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values).then(() => {
                resetForm();
              });
            }}
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
                      errors.new_password && touched.new_password
                        ? { marginBottom: 10 }
                        : { marginBottom: 10 }
                    }
                    className={pr.left_first_main}
                  >
                    <input
                      type='text'
                      placeholder={t.profile.settings.inputPlaceholder1}
                      value={values.old_password}
                      style={
                        errors.old_password && touched.old_password
                          ? { border: '1px solid red', marginBottom: 10 }
                          : { marginBottom: 10 }
                      }
                      name='old_password'
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <input
                      type='text'
                      placeholder={t.profile.settings.inputPlaceholder2}
                      style={
                        errors.new_password && touched.new_password
                          ? { border: '1px solid red', marginBottom: 10 }
                          : { marginBottom: 10 }
                      }
                      value={values.new_password}
                      name='new_password'
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.new_password && errors.old_password && (
                      <div>
                        <p
                          style={{ position: 'absolute' }}
                          className={'text-danger'}
                        >
                          {errors.new_password || errors.old_password}
                        </p>
                      </div>
                    )}
                  </div>

                  <button>{t.profile.settings.button}</button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Settings;
