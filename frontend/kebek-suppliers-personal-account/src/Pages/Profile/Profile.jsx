import React, { useState } from 'react';
import pr from './Profile.module.scss';
import classNames from 'classnames';
import Personalnformation from '../../components/ProfileItems/Personalnformation';
import Settings from '../../components/ProfileItems/Settings';
import { profileContext } from '../../Context/ProfileContext';
import { userContext } from '../../providers/UserProvider';
import { localeContext } from '../../providers/LocaleProvider';
import Loader from '../../components/Loader/Loader';

function Profile() {
  const { getCities, getRequisites, getAddresses } =
    React.useContext(profileContext);
  const { user, getUser } = React.useContext(userContext);
  const { t } = React.useContext(localeContext);

  React.useEffect(() => {
    getCities();
    getUser();
    getRequisites();
    getAddresses();
  }, []);

 

  if (!user) {
    return <Loader />
  }

  return (
    <div className={pr.container}>
      <h1 className={pr.con_title}>{t.profile.nav}</h1>
      <div className={pr.container_inner}>
        <div className={classNames(pr.main_bottom)}>
          <div className={pr.left_side}>
            <div className={pr.left_side__personal}>
              <Personalnformation />
            </div>
            <div className={pr.left_side__req}>
              <Settings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
