import React, { useState } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Box, Modal, Button, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { ReactComponent as Icon } from '../../assets/icons/OrderMenuIcon.svg';
import classes from './Staff.module.scss';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { $api } from '../../services/api';
import classNames from "classnames";
import { localeContext } from "../../providers/LocaleProvider"
import { style } from '../../components/MainDrawerAdmin/MainDrawerAdmin';
import CloseIcon from '@mui/icons-material/Close';

export default function EnhancedTableHead(props) {
  const {
    headCells,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    currentPage,
    pageSize,
    getStaff,
    selected,
    setSelected,
    locale
  } = props;



  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const { t } = React.useContext(localeContext)
  const [anchorEdit, setAnchorEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const open = Boolean(anchorEdit);
  const open2 = Boolean(deleteModal);

  const handleEditRow = (event) => {
    setAnchorEdit(event.currentTarget);
  };

  const handleCloseRow = (event) => {
    setAnchorEdit(null);
  };

  const handleClose2 = () => {
    setDeleteModal(false)
  }

  const handleDeleteManyStaffByIds = async (ids) => {
    try {
      await !!ids.length && ids.forEach((id) => {
        $api.delete(`/users/staff/${id}/`)
      })
      getStaff("default", "default", pageSize, currentPage, "")
      setAnchorEdit(false)
      setSelected([])
      setDeleteModal(false)
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
            <MenuItem onClick={() => setDeleteModal(true)}>{locale === "ru" ? "Удалить" : "Жою"}</MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby='modal-modal-title2'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <CloseIcon
            onClick={handleClose2}
            fontSize='large'
            style={{
              position: 'absolute',
              top: '33',
              right: '40',
              cursor: 'pointer',
            }}
          />
          <Typography
            id='modal-modal-title2'
            variant='h6'
            component='h2'
            style={{
              fontSize: '31px',
              lineHeight: '140%',
              marginBottom: '20px',
              textAlign: 'center',
            }}
            className={classes.modal_box}
          >
            {t.profile.requisites.modal4.deleteModal.title1}
          </Typography>
          <div className={classNames(classes.modal, classes.modal_inner)}>
            <p>{t.profile.requisites.modal4.deleteModal.title2} </p>
            <p>{t.profile.requisites.modal4.deleteModal.title3}</p>
            <button
              onClick={() => {
                handleDeleteManyStaffByIds(selected)
              }}
            >
              {t.profile.requisites.modal4.deleteModal.button}
            </button>
          </div>
        </Box>
      </Modal>
    </TableHead>
  );
}
