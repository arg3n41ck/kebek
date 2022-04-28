import React from 'react';
import { NameFile } from './ApplicationById';
import { Typography, MenuItem, Menu, Modal, Box, TextField, Button } from "@mui/material";
import classes from "./Application.module.scss";
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import { Formik, Form } from "formik";
import CloseIcon from '@mui/icons-material/Close';
import classNames from "classnames";
import { applicationContext } from "../../providers/ApplicationProvider";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 580,
    width: '100%',
    height: 'auto',
    borderRadius: '3px',
    bgcolor: 'background.paper',
    border: 'none',
    outline: 'none',
    boxShadow: 24,
    padding: '57px 30px 30px 30px',
};

const statusInDocument = [
    {
        id: 1,
        name: "Накладная",
        value: "WB"
    },
    {
        id: 2,
        name: "Счет на оплату",
        value: "BL"
    }
]

function ApplicationByIdDocumentList({ item, isMobile, typeDocument, data, handleDeleteDocument }) {

    const [anchorEl, setAnchorEl] = React.useState(null),
        [imageInfo, setImageInfo] = React.useState(item),
        [documentModal, setDocumentModal] = React.useState(false);

    const { getApplicationsById, patchDocumentOrderById } = React.useContext(applicationContext)


    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const initialValues = {
        type: !item.type ? "WB" : item.type === "PS" ? "WB" : item.type,
        document: !item.document ? "" : item.document,
    }


    const handleCloseModalDocument = () => {
        setDocumentModal(false)
    }

    const handleCloseRow = () => {
        setAnchorEl(null);
    };


    const handleDelete = async (data, item) => {
        await handleDeleteDocument(data.id, item.id)
        setAnchorEl(false)
    }



    const handleSubmitDocument = async (values, resetForm, id, document_id) => {
        const formData = new FormData();

        const data = {
            type: values.type,
            document: values.document,
            order: id
        }


        await Object.keys(data).forEach((key) => {
            const value = data[key];

            if (key === "document") {
                return formData.append(key, value, value.name)
            }
            formData.append(key, value)
        })

        await patchDocumentOrderById(document_id, formData).then(() => {
            getApplicationsById(id)
        })

        setDocumentModal(false)
        setImageInfo(null)
        resetForm()
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return (
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
                    isMobile ? 'd-flex flex-column' : 'd-flex justify-content-between align-items-center'
                }
                style={!isMobile ? { maxWidth: 700, width: "100%" } : null}
            >
                <Typography
                    sx={{
                        color: '#092F33',
                        fontSize: 18,
                        fontWeight: 600,
                    }}
                >
                    {typeDocument(item.type)}
                </Typography>
                <Typography
                    className={classes.nameFilePdf}
                    sx={{
                        color: '#828282',
                        fontSize: 18,
                        padding: 0,
                    }}
                >
                    <a href={`${!!item?.document && item.document}`} target="_blank">
                        <NameFile u={!!item?.document && item.document} />
                    </a>
                </Typography>
            </div>
            <div className={"ms-3"}>
                <MoreVertSharpIcon
                    style={{ color: '#219653', cursor: 'pointer' }}
                    onClick={handleClick}
                />
                <Menu
                    id='demo-positioned-menu'
                    aria-labelledby='demo-positioned-button'
                    anchorEl={anchorEl}
                    open={open}
                    onClick={(e) => handleClick(e)}
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
                        sx={{ fontSize: 16 }}
                        onClick={() => setDocumentModal(!documentModal)}
                    >
                        Изменить
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleDelete((!!data?.id && item?.id) && data, item)}
                    >
                        Удалить
                    </MenuItem>
                </Menu>
            </div>
            <Modal
                style={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                open={documentModal}
                onClose={handleCloseModalDocument}
            >
                <Box
                    sx={{
                        style,
                        background: '#fff',
                        maxWidth: 500,
                        position: 'relative',
                    }}
                >
                    <div
                        onClick={handleCloseModalDocument}
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            cursor: 'pointer',
                        }}
                    >
                        <CloseIcon />
                    </div>
                    <Box
                        sx={{
                            padding: 3,
                        }}
                    >
                        <Formik
                            initialValues={initialValues}
                            // validate={}
                            onSubmit={(values, { resetForm }) => handleSubmitDocument(values, resetForm, !!data?.id && data.id, !!item?.id && item.id)}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                                <Form style={{ margin: 15 }}>
                                    <Typography sx={{ fontSize: !isMobile ? 30 : 18, fontWeight: 600, marginBottom: 5 }}>Изменение документа</Typography>
                                    <div style={{ width: '100%' }}>
                                        <TextField
                                            fullWidth
                                            id='outlined-select-currency'
                                            select
                                            value={values.type}
                                            name="type"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            {statusInDocument.map((item) => {
                                                return <MenuItem key={item.id} value={item.value}>
                                                    {item.name}
                                                </MenuItem>
                                            })}

                                        </TextField>
                                    </div>
                                    <div style={{ position: "relative", marginTop: 30, padding: "30px 0" }}>
                                        <div className={classNames("w-100 h-100 d-flex align-items-center justify-content-start", classes.mediaButton)}
                                            style={isMobile ? { position: "absolute", left: 0, top: -20, width: "100%" } : { position: "absolute", left: 0, top: -6, width: "100%" }}
                                        >
                                            <input
                                                type="file"
                                                id='img'
                                                style={{ position: "absolute", top: 0, width: "100%", padding: "10px 0", cursor: "pointer", opacity: 0, zIndex: 1 }}
                                                name='document'
                                                accept="image/jpg, image/jpeg, application/pdf, image/png"
                                                onChange={(e) => {
                                                    setFieldValue('document', e.target.files[0])
                                                    setImageInfo(e.target.files[0])
                                                }}
                                            />
                                            <button type="button" style={{ position: "absolute", top: 0, width: "100%" }} color="success" variant="contained">{!imageInfo ? "Выберите документ" : "Документ выбран"} </button>
                                            {/* </>
                                                                )} */}
                                        </div>
                                    </div>

                                    <Button type="submit" className={"w-100"} color="success" variant="contained">
                                        Изменить документ
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default ApplicationByIdDocumentList