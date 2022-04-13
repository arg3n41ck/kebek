import React, { useState } from 'react';
import pr from './Profile.module.scss';
import classNames from 'classnames';
import Personalnformation from '../../components/ProfileItems/Personalnformation';
import SavedRequisites from '../../components/ProfileItems/SavedRequisites';
import SavedAdress from '../../components/ProfileItems/SavedAdress';
import Settings from '../../components/ProfileItems/Settings';
import Support from '../../components/ProfileItems/Support';
import { profileContext } from '../../Context/ProfileContext';
import { userContext } from '../../providers/UserProvider';
// import Modals from "../../components/Modals/Modals";
import CircularProgress from '@mui/material/CircularProgress';
import { localeContext } from '../../providers/LocaleProvider';

function Profile() {
  const { getCities, getRequisites, getAddresses } =
    React.useContext(profileContext);
  const { getUser, user } = React.useContext(userContext);
  const { t } = React.useContext(localeContext);

  const profileInfo = [
    {
      id: 1,
      title: t.profile.support.links.link1,
    },
    {
      id: 2,
      title: t.profile.support.links.link2,
    },
    {
      id: 3,
      title: t.profile.support.links.link3,
    },
  ];

  React.useEffect(() => {
    getCities();
    getUser();
    getRequisites();
    getAddresses();
  }, []);

  if (!user)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: '90vh',
          alignItems: 'center',
        }}
      >
        <CircularProgress color='success' size='100px' />
      </div>
    );

  return (
    <div className={pr.container}>
      <h1 className={pr.con_title}>{t.profile.nav}</h1>
      <div className={pr.container_inner}>
        {/* <div className={classNames(pr.container_inner_left, pr.main)}> */}
        <div className={classNames(pr.main_bottom)}>
          <div className={pr.left_side}>
            <div className={pr.left_side__personal}>
              <Personalnformation />
            </div>
            <div className={pr.left_side__req}>
              <SavedRequisites />
            </div>
          </div>
          <div className={pr.right_side}>
            <div className={pr.right_side__sett}>
              <Settings />
            </div>
            <div className={pr.right_side__save}>
              <SavedAdress />
            </div>
          </div>
        </div>
        {/* </div> */}

        {/* ----------------------------------------------------------------------------------------------------- */}
        {/* здесь правая сторона */}
        {/* Support */}
        {/* <Support profileInfo={profileInfo} /> */}
      </div>
    </div>
  );
}

export default Profile;
