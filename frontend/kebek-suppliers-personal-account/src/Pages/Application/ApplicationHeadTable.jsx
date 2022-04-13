import React, { useState } from 'react';
import TableHead from '@mui/material/TableHead';
import { TableRow, Modal, Button, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import { ReactComponent as Icon } from '../../assets/icons/OrderMenuIcon.svg';
import classes from './Application.module.scss';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { $api } from '../../services/api';
import classNames from "classnames";
import CloseIcon from "@mui/icons-material/Close";
import { style } from "../../components/MainDrawerAdmin/MainDrawerAdmin";
import cl from "../Profile/Profile.module.scss"

export default function EnhancedTableHead(props) {
    const {
        headCells,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        selected,
        getApplications,
        currentPage,
        pageSize,
        setSelected,
        t,
        locale
    } = props;
    // currentPage={currentPage}
    // pageSize={pageSize}
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const [anchorEdit, setAnchorEdit] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const open = Boolean(anchorEdit);
    const open2 = Boolean(deleteModal);

    const handleClose2 = () => setDeleteModal(false)

    const handleEditRow = (event) => {
        setAnchorEdit(event.currentTarget);
    };
    const handleCloseRow = (event) => {
        setAnchorEdit(null);
    };

    const handleDeleteManyOrdersByIds = async (ids) => {
        try {
            await !!ids.length && ids.forEach((id) => {
                $api.delete(`/orders/${id}/`)
            })
            getApplications("default", "default", "default", "default", "default", "default", "", currentPage, pageSize)
            handleClose2();
            setAnchorEdit(false)
            setSelected([])
        } catch ({ response }) {
            console.log(response)
        }
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding='checkbox'>
                    <Checkbox
                        color='primary'
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component='span' sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell align='right' sx={{ height: '24px' }}>
                    <button
                        className={classes.three_dots__button}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleEditRow}
                        style={{
                            width: '25px',
                        }}
                    >
                        <Icon />
                    </button>
                    <Menu
                        id='edit-menu'
                        anchorEl={anchorEdit}
                        open={open}
                        onClose={handleCloseRow}
                        sx={{ width: '200px' }}
                    >
                        {/* <MenuItem onClick={handleCloseRow}>Изменить</MenuItem> */}
                        <MenuItem onClick={() => setDeleteModal(true)}>{locale === "ru" ? "Удалить" : "Жою"}</MenuItem>
                    </Menu>
                </TableCell>
            </TableRow>
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
                                handleDeleteManyOrdersByIds(selected)
                            }}
                        >
                            {t.profile.requisites.modal3.deleteModal.button}
                        </button>
                    </div>
                </Box>
            </Modal>
        </TableHead>
    );
}
