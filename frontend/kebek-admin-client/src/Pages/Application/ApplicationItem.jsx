import React, { useEffect, useState } from 'react';
import classes from './Application.module.scss';
import {
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
  Modal,
  Box,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '../../static/icons/down.svg';
import vecor from '../../static/icons/vecor.svg';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import Status from '../../components/Status/Status';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import copy from 'copy-to-clipboard';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import QrCode from '../../components/QrCode/QrCode';
import { style } from '../../components/MainDrawerAdmin/MainDrawerAdmin';
import { localeContext } from '../../providers/LocaleProvider';
import pr from '../../Pages/Profile/Profile.module.scss';
import { ordersContext } from '../../providers/OrdersProvider';
import { makeStyles } from '@mui/styles';

function ApplicationItem({
  data,
  onModal,
  onCurrentOrder,
  onStatusModal,
  handleOpenModal,
  handleDeleteProxyModal,
}) {
  const isMobile = useMediaQuery('(max-width: 578px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMedium = useMediaQuery('(max-width: 992px)');

  const cl = makeStyles({
    expand: {
      backgroundColor: "black"
    }
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const opens = Boolean(anchorEl);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);
  const opens2 = Boolean(anchorEl2);
  const opens3 = Boolean(anchorEl3);
  const [qrCode, setQrCode] = useState(null);
  const { t, locale } = React.useContext(localeContext);
  const { deleteProxy } = React.useContext(ordersContext);

  const handleClick1 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };

  const handleClose1 = (e) => {
    e.target.innerText === '' && setAnchorEl2(null);
  };

  const handleClose2 = (e) => {
    e.target.innerText === '' && setAnchorEl(null);
  };

  const handleClose3 = (e) => {
    e.target.innerText === '' && setAnchorEl3(null);
  };

  const [showInfo, setShowInfo] = React.useState(false);
  const toggleShowInfo = (arg) => {
    setShowInfo(arg);
  };

  useEffect(() => {
    const qrCodeObj = data?.documents.find((item) => item.type === 'PS');
    setQrCode(qrCodeObj?.document);
  }, [data]);

  const doc = !!data?.documents && data.documents.filter((item) => item.type !== 'PS');

  const typeDocument = (doc) => {
    if (doc === "WB") return "Накладная"
    if (doc === "PS") return "Пропуск"
    if (doc === "BL") return "Счет на оплату"
    return ""
  }


  const downloadAllDocuments = () => {
    !!data?.documents && data.documents
      .filter((item) => item.type !== 'PS')
      .forEach((item) => {
        window.open(item.document);
      });
  };


  const totalProductPayment = React.useMemo(() => {
    console.log(data.products)
    return !!data?.products?.length && data.products.reduce((acc, curr) => acc + curr.amount * curr.productPayment, 0)
  }, [data])

  const totalProductCountTon = React.useMemo(() => {
    return !!data?.products?.length && data.products.reduce((acc, curr) => acc + +curr.amount, 0)
  }, [data])


  return (
    <>
      <Card className={classes.applicationItems}>
        {showInfo && <SaveClipboardInfo toggleShow={toggleShowInfo} />}
        <div className={'w-100'}>
          <CardContent>
            <div
              className={classNames(
                classes.header,
                'd-flex justify-content-between align-items-start'
              )}
            >
              <div>
                <Typography sx={{ fontSize: 22, fontWeight: 600 }}>
                  Заявка от
                  {format(parseISO(`${!!data?.createdAt && data.createdAt}`), ' d ', {
                    locale: ruLocale,
                  })}
                  {format(parseISO(`${!!data?.createdAt && data.createdAt}`), 'MMMM', {
                    locale: ruLocale,
                  })
                    .charAt(0)
                    .toUpperCase()}
                  {format(parseISO(`${!!data?.createdAt && data.createdAt}`), 'MMMM ', {
                    locale: ruLocale,
                  }).slice(1)}
                  <Link
                    to={`/info-about-application/${!!data?.id && data.id}`}
                    style={{
                      color: '#219653',
                      cursor: 'pointer',
                    }}
                  >
                    {!!data?.number && data.number}
                  </Link>
                </Typography>
                <Typography sx={{ color: "#092F33", fontSize: "18px", fontWeight: 600 }} >{!!data?.products?.length && data.products.length} товара, {totalProductCountTon} кг</Typography>
              </div>
              <div
                className={classNames(
                  classes.headerInfo,
                  'd-flex align-items-center'
                )}
              >
                <Typography
                  sx={
                    isMedium
                      ? { fontSize: 18, marginTop: 2, marginBottom: 2 }
                      : { fontSize: 18 }
                  }
                  style={{ marginRight: 25 }}
                >
                  {!!data?.payment?.type && locale === "ru" ? data.payment.type.titleRu : data.payment.type.titleKk}
                </Typography>
                <Typography
                  sx={{ fontSize: 21, fontWeight: 600, marginRight: '25px' }}
                >
                  {totalProductPayment} {' ₸'}
                </Typography>
                <div
                  className={
                    'd-flex w-100 align-items-center justify-content-center'
                  }
                  style={{
                    borderRadius: '3px',
                    minWidth: !isMedium ? 262 : '100%',
                    height: '45px',
                    color: '#219653',
                    fontSize: 18,
                    fontWeight: 600,
                    marginTop: isMedium && 10,
                  }}
                >
                  <Status statusName={!!data?.status && data.status} />
                </div>
              </div>
            </div>
          </CardContent>
          <div>
            {!!data?.products?.length &&
              data.products.map((item) => (
                <>
                  <div style={{ border: "1px solid #E0E0E0" }} />
                  <div
                    style={{
                      backgroundColor: '#FAFCFA',
                      padding: 20,
                      margin: 0,
                      maxHeight: 400
                    }}
                    className={classNames(
                      classes.confidantInfo,
                      'w-90 d-flex justify-content-between align-items-center'
                    )}
                  >

                    <div
                      className={classNames(
                        classes.confidantItem,
                        'd-flex justify-content-between w-50 align-items-center'
                      )}
                    >
                      <div
                        className={classes.confidantItem_item}
                        style={{ maxWidth: 400, width: '100%' }}
                      >
                        <Typography
                          sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                        >
                          Наименование
                        </Typography>
                        <Typography
                          sx={{
                            color: '#092F33',
                            fontSize: 21,
                            fontWeight: 500,
                          }}
                        >
                          {!!item?.product?.type && locale === "ru" ? item.product.type.titleRu : item.product.type.titleKk}
                        </Typography>
                      </div>
                      <div
                        className={classes.confidantItem_item}
                        style={{ maxWidth: 250, width: '100%' }}
                      >
                        <Typography
                          sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                        >
                          Кол-во
                        </Typography>
                        <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                          {!!item?.amount && item.amount}
                        </Typography>
                      </div>
                    </div>
                    <div
                      className={classNames(
                        classes.confidantItem,
                        'd-flex justify-content-between w-50 align-items-center'
                      )}
                    >
                      <div
                        className={classes.confidantItem_item}
                        style={{ maxWidth: 250, width: '100%' }}
                      >
                        <Typography
                          sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                        >
                          Способ доставки
                        </Typography>
                        <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                          {!!data?.delivery?.type && locale === "ru" ? data.delivery.type.titleRu : data.delivery.type.titleKk}
                        </Typography>
                      </div>
                      <div
                        className={classes.confidantItem_item}
                        style={{ maxWidth: 400, width: '100%' }}
                      >
                        <Typography
                          sx={{ color: '#828282', fontSize: 18, padding: 0 }}
                        >
                          Поставщик
                        </Typography>
                        <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                          {!!data?.elevator && locale === "ru" ? data.elevator.titleRu : data.elevator.titleKk}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </>
              ))}
          </div>
          {!!qrCode && (
            <CardContent
              className={classNames(
                classes.QrCodeContainer,
                'w-100 d-flex justify-content-between align-items-center'
              )}
            >
              <CardContent className={'d-flex align-items-center'}>
                <img
                  className={classes.qrCode}
                  src={qrCode}
                  alt='qr code'
                />
                <div
                  style={
                    isMobile ? { marginLeft: 5 } : { marginLeft: 30 }
                  }
                >
                  <Typography
                    sx={
                      isMobile
                        ? { color: '#092F33', fontSize: 16 }
                        : { color: '#092F33', fontSize: 21 }
                    }
                  >
                    {!!data?.city ? (locale === "ru" ? `Самовывоз в ${data.city?.titleRu}` : `${data.city?.titleKk} алып кету`) : (
                      <Typography
                        sx={
                          isMobile
                            ? { color: '#828282', fontSize: 12, padding: 0 }
                            : { color: '#828282', fontSize: 18, padding: 0 }
                        }
                      >
                        Ожидается самовывоз
                      </Typography>
                    )}
                  </Typography>

                </div>
              </CardContent>

              <div>
                <MoreVertSharpIcon
                  style={{ color: '#219653', cursor: 'pointer' }}
                  onClick={handleClick3}
                />
                <Menu
                  id=''
                  anchorEl={anchorEl3}
                  open={opens3}
                  onClose={handleClose3}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'bottom',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'bottom',
                  }}
                  onClick={handleClose3}
                >
                  <MenuItem>
                    <a
                      style={{ color: '#092F33' }}
                      target='_target'
                      download
                      onClick={() => download(qrCode)}
                    >
                      Скачать
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <QrCode
                      handleClose1={setAnchorEl3}
                      data={qrCode}
                      title='qrCode'
                      qrcodeTitle='Поделиться QR-кодом'
                    />
                  </MenuItem>
                </Menu>
              </div>
            </CardContent>
          )}
          <Accordion style={{ margin: 0, border: 'none', padding: 0 }}>
            <AccordionSummary
              expandIcon={<img src={ExpandMoreIcon} />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <div
                className={
                  'w-100 d-flex align-items-center justify-content-between'
                }
              >
                <Typography
                  sx={{ fontWeight: 600, fontSize: 21, padding: '10px' }}
                >
                  Документы
                </Typography>
                <Button
                  disabled={!doc?.length}
                  onClick={downloadAllDocuments}
                  color='success'
                  sx={{
                    fontWeight: 600,
                    fontSize: 20,
                    textTransform: 'none',
                    marginRight: 4,
                  }}
                >
                  Скачать все
                </Button>
              </div>
            </AccordionSummary>
            <AccordionDetails style={{ padding: 0 }}>
              {!!data?.documents && data.documents
                .filter((item) => item.type !== 'PS')
                .map((item) => (
                  <div
                    key={item.document}
                    style={{
                      backgroundColor: '#FAFCFA',
                      padding: '25px 15px 25px 25px',
                      margin: 0,
                      borderBottom: '1px solid #E0E0E0',
                    }}
                    className={
                      'w-100 d-flex justify-content-between align-items-center'
                    }
                  >
                    <div
                      className={
                        isMobile ? 'd-flex flex-column' : 'd-flex'
                      }
                    >
                      <Typography
                        sx={{
                          color: '#092F33',
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                      >
                        {typeDocument(item.type)}
                        {console.log(item.document)}
                      </Typography>
                      <Typography
                        className={classes.nameFilePdf}
                        sx={{
                          color: '#828282',
                          fontSize: 18,
                          padding: 0,
                          marginLeft: 39,
                        }}
                      >
                        <NameFile u={!!item?.document && item.document} />
                      </Typography>
                    </div>
                    <div>
                      <MoreVertSharpIcon
                        style={{ color: '#219653', cursor: 'pointer' }}
                        onClick={handleClick1}
                      />
                      <Menu
                        id='demo-positioned-menu'
                        aria-labelledby='demo-positioned-button'
                        anchorEl={anchorEl2}
                        open={opens2}
                        onClick={(e) => handleClose1(e)}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'bottom',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'bottom',
                        }}
                      >
                        <MenuItem
                          onClick={handleClose1}
                          sx={{ fontSize: 16 }}
                        >
                          <a
                            style={{ color: '#092F33' }}
                            href={!!item?.document && item.document}
                            target='_target'
                            download
                          >
                            Скачать
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <QrCode
                            handleClose1={setAnchorEl2}
                            data={data}
                            title='applicationItem'
                            qrcodeTitle='Поделиться документом'
                          />
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                ))}
            </AccordionDetails>
          </Accordion>
          {!!data?.proxyFullname && data.proxyFullname ? (
            <>
              <div style={{ position: "relative" }} className={"d-flex justify-content-between align-items-center"}>
                <Accordion style={{ margin: 0, border: 'none', padding: 0, width: "95%" }}>
                  <AccordionSummary
                    expandIcon={<img className={cl.expand} src={ExpandMoreIcon} />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >

                    <div
                      className={
                        'd-flex w-100 justify-content-between align-items-center'
                      }
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: 21,
                          padding: '10px',
                        }}
                      >
                        Доверенное лицо
                      </Typography>

                    </div>
                  </AccordionSummary>
                  <AccordionDetails style={{ padding: 0 }}>
                    <div
                      style={{ padding: 20, margin: 0 }}
                      className={classNames(
                        classes.confidantInfo,
                        'w-100 d-flex justify-content-between align-items-center d-sm-flex d-none'
                      )}
                    >
                      <div
                        className={classNames(
                          classes.confidantItem,
                          'd-flex justify-content-between w-50 align-items-center'
                        )}
                      >
                        <div
                          className={classes.confidantItem_item}
                          style={{ maxWidth: 400, width: '100%' }}
                        >
                          <Typography
                            className={classes.fullNameConfidantText}
                            sx={{
                              color: '#828282',
                              fontSize: 18,
                              padding: 0,
                            }}
                          >
                            ФИО довереного лица
                          </Typography>
                          <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                            {!!data?.proxyFullname && data.proxyFullname}
                          </Typography>
                        </div>
                        <div
                          className={classes.confidantItem_item}
                          style={{ maxWidth: 250, width: '100%' }}
                        >
                          <Typography
                            sx={{
                              color: '#828282',
                              fontSize: 18,
                              padding: 0,
                            }}
                          >
                            № доверенности
                          </Typography>
                          <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                            №{!!data?.proxyNumber && data.proxyNumber}
                          </Typography>
                        </div>
                      </div>
                      <div
                        className={classNames(
                          classes.confidantItem,
                          'd-flex justify-content-between w-50 align-items-center'
                        )}
                      >
                        <div
                          className={classes.confidantItem_item}
                          style={{ maxWidth: 250, width: '100%' }}
                        >
                          <Typography
                            sx={{
                              color: '#828282',
                              fontSize: 18,
                              padding: 0,
                            }}
                          >
                            От ЧЧ / ММ / ГГГ
                          </Typography>
                          <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                            {format(
                              parseISO(!!data?.proxyStartDate && data.proxyStartDate),
                              'dd.MM.yyyy'
                            )}
                          </Typography>
                        </div>
                        <div
                          className={classes.confidantItem_item}
                          style={{ maxWidth: 400, width: '100%' }}
                        >
                          <Typography
                            sx={{
                              color: '#828282',
                              fontSize: 18,
                              padding: 0,
                            }}
                          >
                            По ЧЧ / ММ / ГГГ
                          </Typography>
                          <Typography sx={{ color: '#092F33', fontSize: 21 }}>
                            {format(
                              parseISO(!!data?.proxyEndDate && data.proxyEndDate),
                              'dd.MM.yyyy'
                            )}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div
                      className={classNames(
                        'd-sm-none d-block',
                        classes.confidationInfo_mobile
                      )}
                    >
                      <Typography sx={{ color: '#092F33', fontSize: 18 }}>
                        {!!data?.proxyFullname && data.proxyFullname}
                      </Typography>
                      <Typography sx={{ color: '#828282', fontSize: 16 }}>
                        Доверенность №{!!data?.proxyNumber && data.proxyNumber} от{' '}
                        {format(parseISO(!!data?.proxyStartDate && data.proxyStartDate), 'dd.MM.yyyy')}{' '}
                        по {format(parseISO(!!data?.proxyEndDate && data.proxyEndDate), 'dd.MM.yyyy')}
                      </Typography>
                    </div>

                    <div
                      style={{ marginLeft: 25, marginBottom: 25 }}
                      className={'d-sm-none d-block mt-4'}
                    >
                      <Button
                        sx={{
                          padding: 0,
                          color: '#219653',
                          textTransform: 'none',
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                        onClick={() => {
                          onStatusModal('change');
                          onCurrentOrder(data);
                          onModal();
                        }}
                      >
                        Изменить
                      </Button>
                      <Button
                        sx={{
                          padding: 0,
                          color: '#219653',
                          textTransform: 'none',
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                        onClick={() => {
                          handleOpenModal();
                          handleDeleteProxyModal(data);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <div style={{ position: "absolute", right: "15px", top: "25px" }}>
                  <MoreVertSharpIcon
                    style={{ color: '#219653', cursor: 'pointer' }}
                    onClick={handleClick2}
                  />
                  <Menu
                    id='long-menu'
                    anchorEl={anchorEl}
                    open={opens}
                    onClose={handleClose2}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'bottom',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'bottom',
                    }}
                    onClick={handleClose2}
                  >
                    <MenuItem>
                      <Button
                        sx={{
                          padding: 0,
                          textTransform: 'none',
                          fontSize: 16,
                          fontWeight: 600,
                          color: "rgb(9, 47, 51)",
                          marginRight: 5,
                        }}
                        onClick={() => {
                          onStatusModal('change');
                          onCurrentOrder(data, handleClose2);
                          onModal(setAnchorEl);
                        }}
                      >
                        Изменить
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        sx={{
                          padding: 0,
                          textTransform: 'none',
                          color: "rgb(9, 47, 51)",
                          fontSize: 16,
                          fontWeight: 600,
                          marginRight: 5,
                        }}
                        onClick={() => {
                          handleOpenModal(setAnchorEl);
                          handleDeleteProxyModal(data, handleClose2);
                        }}
                      >
                        Удалить
                      </Button>
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </>
          ) : (
            <CardContent>
              <Button
                sx={{
                  padding: 0,
                  color: '#219653',
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                  paddingLeft: 0,
                  margin: 0,
                }}
                onClick={() => {
                  onStatusModal('new');
                  onCurrentOrder(data);
                  onModal();
                }}
              >
                + Добавить доверенное лицо
              </Button>
            </CardContent>
          )}
          < hr className={'m-0'} />

        </div>
      </Card>
    </>
  );
}

export default ApplicationItem;

export const NameFile = ({ u }) => {
  const url = React.useMemo(() => {
    let arr = u.split('/'),
      returnValue = arr[arr.length - 1],
      formatFile = returnValue.split('.');
    return returnValue.length < 10
      ? returnValue
      : `${returnValue.slice(0, 10)}... .${formatFile[formatFile.length - 1]}`;
  }, []);

  return (
    <NameWrapper>
      {url} <p>{u}</p>
    </NameWrapper>
  );
};
const NameWrapper = styled.div`
  position: relative;
  color: #828282;
  p {
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    visibility: hidden;
    transition: 0.3s;
    padding: 3px 5px;
  }
  //&:hover {
  //  p {
  //    visibility: visible;
  //  }
  //}
`;

export const SaveClipboardInfo = ({ toggleShow }) => {
  React.useEffect(() => {
    toggleShow(true);
    const timeOut = setTimeout(() => {
      toggleShow(false);
    }, 1000);
    return () => {
      clearInterval(timeOut);
    };
  }, []);

  return createPortal(
    <SlInfo>Скопировано в буфер обмена!</SlInfo>,
    document.querySelector('.mWrapper')
  );
};

const SlInfo = styled.div`
  position: fixed;
  border-radius: 300px;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.4);
  padding: 3px 5px;
  color: #fff;
`;

export const download = (value) => {
  const element = document.createElement('a');
  const file = new Blob([value], { type: 'image/*' });
  element.href = URL.createObjectURL(file);
  element.download = 'image.png';
  element.click();
};
