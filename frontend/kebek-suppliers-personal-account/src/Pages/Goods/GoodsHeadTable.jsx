import React, { useState } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import { ReactComponent as Icon } from '../../assets/icons/OrderMenuIcon.svg';
import classes from './Goods.module.scss';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ReactComponent as DeleteSvg } from "../../assets/icons/delete.svg"
import classNames from 'classnames';

export default function EnhancedTableHead(props) {
  const {
    headCells,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    activateManyGoods,
    getProducts,
    setSelected,
    selected,
    locale
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const [anchorEdit, setAnchorEdit] = useState(false);
  const open = Boolean(anchorEdit);

  const handleEditRow = (event) => {
    setAnchorEdit(event.currentTarget);
  };
  const handleCloseRow = (event) => {
    setAnchorEdit(null);
  };

  // activateManyGoods={activateManyGoods}
  // getProducts={getProducts}
  // setSelected={setSelected}
  // selected={selected}

  const handleChangeStatusManyGoodsByIds = async (ids, status) => {
    await activateManyGoods(ids, status).then(() => {
      getProducts()
    })
    setAnchorEdit(false)
    setSelected([])
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
          {/* <div style={{ cursor: "pointer" }}>
              <DeleteSvg />
            </div> */}
          <button
            className={classNames(classes.three_dots__button)}
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
            <MenuItem onClick={() => handleChangeStatusManyGoodsByIds(selected, "AC")}>{locale === "ru" ? "????????????????????????" : "???????? ????????"}</MenuItem>
            <MenuItem onClick={() => handleChangeStatusManyGoodsByIds(selected, "AR")}>{locale === "ru" ? "?????????????????? ?? ??????????" : "?????????????????? ????????????????????"}</MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
