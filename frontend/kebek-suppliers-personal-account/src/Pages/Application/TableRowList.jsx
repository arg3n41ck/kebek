import {
    TableRow,
    TableCell,
    Checkbox,
    MenuItem,
    Menu,
    Modal,
    Box,
    Typography,
} from "@mui/material";
import React from "react";
import Status from "../../components/Status/Status";
import StatusProduct from "../../components/Status/StatusProduct";
import { format, parseISO } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import { Link } from "react-router-dom";
import { style } from "../../components/MainDrawerAdmin/MainDrawerAdmin";
import classNames from "classnames";
import CloseIcon from "@mui/icons-material/Close";
import cl from "../Profile/Profile.module.scss"

function TableRowList({
    row,
    locale,
    isItemSelected,
    labelId,
    Icon,
    classes,
    handleDeleteProducts,
    handleClickCheckbox,
    t,
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleCloseRow = () => {
        setAnchorEl(null);
    };

    const handleDelete = async (id) => {
        await handleDeleteProducts(id);
        setAnchorEl(null);
    };
    const handleClose2 = () => {
        setDeleteModal(false);
    };

    const open = Boolean(anchorEl);
    const open2 = Boolean(deleteModal);
    const id = open ? "simple-popper" : undefined;

    const totalSum = React.useMemo(() => {
        return row.products.reduce(
            (acc, curr) => acc + curr.productPayment * curr.amount,
            0
        );
    }, [row.products]);

    return (
        <TableRow
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.id}
            selected={isItemSelected}
            className={classes.rowCont}
        >
            <TableCell sx={{ width: "5%" }} padding="checkbox">
                <Checkbox
                    onClick={(event) => handleClickCheckbox(event, row.id)}
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                        "aria-labelledby": labelId,
                    }}
                />
            </TableCell>
            <TableCell align="left">
                <Link to={`/application/${row.id}`}>
                    <Typography
                        className={classes.number}
                        sx={{
                            fontSize: 16,
                            color: "#092F33",
                            fontWeight: 600,
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        {row.number}
                    </Typography>
                </Link>
                <Typography sx={{ fontSize: 16, color: "#828282" }}>
                    от {format(parseISO(row.createdAt), "dd.MM.yyyy")}
                </Typography>
            </TableCell>
            <TableCell component="th" id={labelId} scope="row" padding="none">
                <Typography sx={{ fontSize: 16, color: "#092F33", fontWeight: 600 }}>
                    {locale === "ru"
                        ? row.client.firstName.length > 20
                            ? `${row.client.firstName.slice(0, 15)}...`
                            : row.client.firstName
                        : row.client.firstName.length > 20
                            ? `${row.client.firstName.slice(0, 15)}...`
                            : row.client.firstName}
                </Typography>
                <Typography sx={{ fontSize: 16, color: "#828282" }}>
                    {row.client.username}
                </Typography>
            </TableCell>
            <TableCell component="th" id={labelId} scope="row" padding="none">
                {locale === "ru"
                    ? row.elevator.titleRu.length > 20
                        ? `${row.elevator.titleRu.slice(0, 15)}...`
                        : row.elevator.titleRu
                    : row.elevator.titleKk.length > 20
                        ? `${row.elevator.titleKk.slice(0, 15)}...`
                        : row.elevator.titleKk}
            </TableCell>
            <TableCell align="left">
                {!!row?.products?.length &&
                    row.products.map((item) => {
                        return (
                            <Typography
                                sx={{ fontSize: 13, color: "#092F33", fontWeight: 600 }}
                            >
                                {item.product.type.titleRu}{" "}
                                <span style={{ color: "gray" }}>{`(${item.amount} т.)`}</span>
                            </Typography>
                        );
                    })}
            </TableCell>
            <TableCell align="left">
                {!!row?.delivery?.titleKk && !!row?.delivery?.titleRu
                    ? locale === "ru"
                        ? row.delivery.titleRu
                        : row.delivery.titleKk
                    : "---"}
            </TableCell>
            <TableCell align="left">{totalSum.toLocaleString("ru-RU")} ₸</TableCell>
            <TableCell align="left">
                <Status statusName={!!row.status && row.status} />
            </TableCell>
            <TableCell sx={{ width: "5%" }} align="right">
                <button
                    className={classes.three_dots__button}
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
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
                    onClose={handleCloseRow}
                    sx={{ width: "200px" }}
                >
                    {/* <MenuItem onClick={handleCloseRow}>Изменить</MenuItem> */}
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
                        className={cl.modal_box}
                    >
                        {t.profile.requisites.modal3.deleteModal.title1}
                    </Typography>
                    <div className={classNames(cl.modal, cl.modal_inner)}>
                        <p>{t.profile.requisites.modal3.deleteModal.title2} </p>
                        <p>{t.profile.requisites.modal3.deleteModal.title3}</p>
                        <button
                            onClick={() => {
                                handleClose2();
                                //   handleClose5();
                                handleDelete(row.id);
                            }}
                        >
                            {t.profile.requisites.modal3.deleteModal.button}
                        </button>
                    </div>
                </Box>
            </Modal>
        </TableRow>
    );
}

export default TableRowList;
