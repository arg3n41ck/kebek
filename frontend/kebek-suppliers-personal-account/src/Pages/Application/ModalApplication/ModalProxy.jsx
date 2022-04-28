import React from 'react'
import { DatePicker, LocalizationProvider, MobileDatePicker } from "@mui/lab";
import {
    Box,
    Button,
    createTheme,
    Typography,
    useMediaQuery,
    ThemeProvider,
    TextField,
    Paper,
    Modal
} from "@mui/material";
import classes from "../Application.module.scss"
import { ReactComponent as CalendarIcon } from "../../../assets/icons/calendar.svg";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { format, parseISO } from "date-fns";
import { $api } from '../../../services/api';
import { kk, ru } from 'date-fns/locale';
import { localeContext } from '../../../providers/LocaleProvider';

const ModalInput = styled.input`
  width: 100%;
  height: 55px;
  border: 1px solid #e7e7e7;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 10px 20px;
  margin-bottom: 10px;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  color: black;
`;

const CalendarIconS = styled(CalendarIcon)`
  position: absolute;
  top: 14px;
  right: 20px;
  max-width: 30px;
  pointer-events: none;
`;

const ModalBtn = styled.button`
  background-color: #219653;
  border: none;
  border-radius: 3px;
  height: 53px;
  width: 100%;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  color: white;
  margin-top: 10px;
`;

export const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 580,
    width: "100%",
    height: "auto",
    borderRadius: "3px",
    bgcolor: "background.paper",
    border: "none",
    outline: "none",
    boxShadow: 24,
    padding: "57px 30px 30px 30px",
};


function ModalProxy({
    openModal,
    onModal,
    statusModal,
    proxyInfo,
    handleClose
}) {
    const [modalValues, setModalValues] = React.useState(proxyInfo)
    const {locale} = React.useContext(localeContext)

    const inputHandler = (e) => {
        setModalValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        // format(, 'yyyy-MM-dd')
    };

    const postOrUpdate = async () => {
        if (
            modalValues?.proxyFullname &&
            modalValues?.proxyNumber &&
            modalValues?.proxyStartDate &&
            modalValues?.proxyEndDate
        ) {
            $api.patch(`/orders/${modalValues.id}/proxy/`, {
                proxy_fullname: modalValues.proxyFullname,
                proxy_number: +modalValues.proxyNumber,
                proxy_start_date: modalValues.proxyStartDate,
                proxy_end_date: modalValues.proxyEndDate,
            });
            onModal();
            handleClose()
        }
    };


    return (
        <div>
            <Modal
                open={openModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className={`${classes.modal}`}
            >
                <Box sx={style}>
                    {/*{page === 1 ? (*/}
                    {/*  <>*/}
                    <CloseIcon
                        onClick={onModal}
                        fontSize="large"
                        style={{
                            position: "absolute",
                            top: "33",
                            right: "40",
                            cursor: "pointer",
                        }}
                    />
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        style={{
                            fontSize: "31px",
                            lineHeight: "140%",
                            marginBottom: "20px",
                        }}
                        className={classes.modal_box}
                    >
                        {statusModal === "new" ? "Добавить" : "Изменить"} доверенное лицо
                    </Typography>
                    <div style={{ width: "100%" }}>
                        <ModalInput
                            type="text"
                            defaultValue={!!modalValues?.proxyFullname && modalValues?.proxyFullname}
                            placeholder="Введите ФИО доверенного лица"
                            name={"proxyFullname"}
                            onChange={inputHandler}
                        />
                        <ModalInput
                            type="text"
                            defaultValue={!!modalValues?.proxyNumber && modalValues?.proxyNumber}
                            placeholder="Ввведите номер доверенности"
                            name="proxyNumber"
                            value={modalValues?.proxyNumber}
                            onChange={(e) =>
                                setModalValues((prev) => ({
                                    ...prev,
                                    proxyNumber: e.target.value.replace(/\D/g, ""),
                                }))
                            }
                        />
                        <LocalizationProvider locale={locale === "ru" ? ru : kk} dateAdapter={AdapterDateFns}>
                            <div
                                className={"customDatePickerWidth"}
                                style={{ marginBottom: 15 }}
                            >
                                <MobileDatePicker
                                    className={"customDatePickerWidth"}
                                    label="Действительно с:"
                                    value={modalValues?.proxyStartDate}
                                    name={"proxyStartDate"}
                                    onChange={(newValue) => {
                                        setModalValues((prev) => ({
                                            ...prev,
                                            proxyStartDate: `${format(newValue, "yyyy-MM-dd")}`,
                                        }));
                                    }}
                                // renderInput={(params) => [<TextField {...params} />, console.log(params)]}
                                />
                                <CalendarIconS />
                            </div>
                            <div className={"customDatePickerWidth"}>
                                <MobileDatePicker
                                    className={"customDatePickerWidth"}
                                    label="Действительно с:"
                                    value={modalValues?.proxyEndDate}
                                    name={"proxyStartDate"}
                                    onChange={(newValue) => {
                                        setModalValues((prev) => ({
                                            ...prev,
                                            proxyEndDate: `${format(newValue, "yyyy-MM-dd")}`,
                                        }));
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <CalendarIconS />
                            </div>
                        </LocalizationProvider>
                        <ModalBtn onClick={postOrUpdate}>
                            {statusModal === "new" ? "Добавить" : "Изменить"}
                        </ModalBtn>
                    </div>
                    {/*</>*/}
                    {/*) : (*/}
                    {/*  <ModalInfo>*/}
                    {/*    <ModalCloseWrapper onClick={onModal}>*/}
                    {/*      <CloseIcon*/}
                    {/*        fontSize="large"*/}
                    {/*        style={{*/}
                    {/*          position: "absolute",*/}
                    {/*          top: "33",*/}
                    {/*          right: "40",*/}
                    {/*          cursor: "pointer",*/}
                    {/*        }}*/}
                    {/*      />*/}
                    {/*    </ModalCloseWrapper>*/}
                    {/*    <img src={TrustedPersonIcon} alt="" />*/}
                    {/*    <ModalITitle>*/}
                    {/*      {statusModal === "new"*/}
                    {/*        ? "Добавлено доверенно лицо"*/}
                    {/*        : "Доверенное лицо изменено"}*/}
                    {/*      !*/}
                    {/*    </ModalITitle>*/}
                    {/*    <ModalIDescription>*/}
                    {/*      Вы успешно {statusModal === "new" ? "добавили" : "изменили"}{" "}*/}
                    {/*      доверенное лицо <span>{modalValues.proxyFullname}</span>*/}
                    {/*    </ModalIDescription>*/}
                    {/*    <ModalIBackBtn onClick={() => setPage((prev) => --prev)}>*/}
                    {/*      Назад*/}
                    {/*    </ModalIBackBtn>*/}
                    {/*  </ModalInfo>*/}
                    {/*)}*/}
                </Box>
            </Modal>
        </div>
    )
}

export default ModalProxy