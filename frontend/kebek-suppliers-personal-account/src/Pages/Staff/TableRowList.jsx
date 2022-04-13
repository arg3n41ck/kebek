import React from "react";
import {
    TableRow,
    TableCell,
    Checkbox,
    MenuItem,
    Menu,
    Modal,
    Button,
    Box,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import classNames from "classnames";
import { style } from "../../components/MainDrawerAdmin/MainDrawerAdmin";

function TableRowList({
    locale,
    row,
    getElevatorById,
    handleClick,
    isItemSelected,
    classes,
    labelId,
    Icon,
    userRole,
    deleteStaff,
    getStaff,
    t,
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [deleteModal, setDeleteModal] = React.useState(false);

    const handleClickToAnchor = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleCloseRow = () => {
        setAnchorEl(null);
    };

    const handleClose2 = () => {
        setDeleteModal(false);
    };

    const handleDelete = async (id) => {
        await deleteStaff(id).then(() => {
            getStaff();
        });
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const open2 = Boolean(deleteModal);
    const id = open ? "simple-popper" : undefined;

    return (
        <TableRow
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.id}
            selected={isItemSelected}
        >
            <TableCell sx={{ width: "5%" }} padding="checkbox">
                <Checkbox
                    onClick={(event) => handleClick(event, row.id)}
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                        "aria-labelledby": labelId,
                    }}
                />
            </TableCell>
            <TableCell component="th" id={labelId} scope="row" padding="none">
                {/* {row.supplier} */}
                {row.elevators.map((item) => {
                    return locale === "ru"
                        ? getElevatorById(item)[0]?.titleRu
                        : getElevatorById(item)[0]?.titleKk;
                })}
            </TableCell>
            <TableCell align="left">{row.firstName}</TableCell>
            <TableCell align="left">{userRole(row.userRole)}</TableCell>
            <TableCell align="left">{`${!!row.phoneNumber ? row.phoneNumber : row.username
                }`}</TableCell>
            <TableCell sx={{ width: "5%" }} align="right">
                <button
                    className={classes.three_dots__button}
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClickToAnchor}
                    style={{
                        width: "25px",
                    }}
                >
                    <Icon />
                </button>
                <Menu
                    id="edit-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClickToAnchor}
                    sx={{ width: "200px" }}
                >
                    <Link to={`/staff/edit-staff/${row.id}`}>
                        <MenuItem sx={{ color: "black" }}>{locale === "ru" ? "Изменить" : "Өзгерту"}</MenuItem>
                    </Link>
                    <MenuItem onClick={() => setDeleteModal(true)}>{locale === "ru" ? "Удалить" : "Жою"}</MenuItem>
                </Menu>
            </TableCell>
            <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title2"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CloseIcon
                        onClick={handleClose2}
                        fontSize="large"
                        style={{
                            position: "absolute",
                            top: "33",
                            right: "40",
                            cursor: "pointer",
                        }}
                    />
                    <Typography
                        id="modal-modal-title2"
                        variant="h6"
                        component="h2"
                        style={{
                            fontSize: "31px",
                            lineHeight: "140%",
                            marginBottom: "20px",
                            textAlign: "center",
                        }}
                        className={classes.modal_box}
                    >
                        <p>{t.profile.requisites.modal4.deleteModal.title1}</p>
                    </Typography>
                    <div className={classNames(classes.modal, classes.modal_inner)}>
                        <p>{t.profile.requisites.modal4.deleteModal.title2} </p>
                        <p>{t.profile.requisites.modal4.deleteModal.title3}</p>
                        <button
                            onClick={() => {
                                handleClose2();
                                handleDelete(row.id);
                            }}
                        >
                            {t.profile.requisites.modal4.deleteModal.button}
                        </button>
                    </div>
                </Box>
            </Modal>
        </TableRow>
    );
}

export default TableRowList;
