import React from 'react'
import classes from "./Avatar.module.scss"
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import classNames from 'classnames';
import { Button, Typography } from '@mui/material';
import { StyledBadge } from '../Badge/Badge';
import { clearUser, getUser, logOutUser } from '../../redux/products/auth.slice';
import router from 'next/router';
import Link from "next/link"
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import closeIcon from "../../assets/icons/x.svg"
import Image from "next/image"

function AvatarUser({ data, setToken }: any) {
  const dispatch = useAppDispatch()
  const token = typeof !!window && window.localStorage.getItem('token');
  const { notifications, user } = useAppSelector((state) => state.auth)
  const [visibleAvatar, setVisibleAvatar] = React.useState(false)

  const role = !!user?.user_role && user.user_role === "OW" ? "OW" : "CL";

  const logOut = () => {
    logOutUser()
    dispatch(clearUser())
    setToken("")
  }

  return (
    <div className={classes.tooltip}>
      <Stack style={{ cursor: "pointer" }} onClick={() => setVisibleAvatar(!visibleAvatar)} direction="row" spacing={2}>
        <Avatar src={!!data?.image ? data.image : ""} alt="Remy Sharp" />
      </Stack>
      {visibleAvatar && (
        <div className={classes.bottom}>
          <div onClick={() => setVisibleAvatar(false)} style={{ cursor: "pointer", position: "absolute", right: 10, top: 10 }}>
            <Image src={closeIcon} alt="closeIcon" width={16} />
          </div>
          <div className={classNames("d-flex flex-column", classes.inner_bottom)}>
            <div className={classNames("d-flex", classes.headerTooltip)}>
              <Avatar style={{ marginTop: 5 }} src={!!data?.image ? data.image : ""} alt="Remy Sharp" />
              <div className={classes.tooltipBottom}>
                <p style={{ fontSize: 16, marginLeft: 8, marginBottom: 0 }}>{!!data?.first_name ? data.first_name : ""}</p>
                <p style={{ color: 'gray', fontSize: 14, marginLeft: 8 }}>{!!data?.username ? data.username : ""}</p>
              </div>
            </div>
            <div style={{ marginLeft: 8 }} className={"d-flex flex-column mt-2"}>
              <Link href={`/${role}/auth/${token}/`} passHref>
                <div style={{ fontSize: 18, color: '#092F33' }}>
                  <Typography color="#092F33" sx={{ fontSize: 18, cursor: "pointer" }}>Личный кабинет</Typography>
                </div>
              </Link>
              <Link href={`/${role}/auth/${token}/`} passHref>
                <div className={"d-flex align-items-center mt-4 mb-4"}>
                  <Typography color="#092F33" sx={{ fontSize: 18, cursor: "pointer" }}>Заявки</Typography>
                </div>
              </Link>
              <Link href={`/${role}/auth/${token}/`} passHref>
                <div className={"d-flex align-items-center"} style={{ fontSize: 18, color: '#092F33' }}>
                  <Typography color="#092F33" sx={{ fontSize: 18, cursor: "pointer" }}>Уведомления</Typography>
                  {!!notifications &&
                    <StyledBadge style={{ marginLeft: 8 }} badgeContent={notifications} />
                  }
                </div>
              </Link>
            </div>
            <hr />
            <Button onClick={logOut} className={"d-flex justify-content-start mb-0 mt-0 pb-0 pt-0"}
              sx={{ marginLeft: '-20px', width: '100%', fontSize: 18, textAlign: "start" }} color="success">
              Выйти
            </Button>

            <i />
          </div>
        </div>
      )}
    </div>
  )
}

export default AvatarUser
