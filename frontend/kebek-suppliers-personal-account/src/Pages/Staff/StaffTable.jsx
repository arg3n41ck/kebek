import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import StaffHead from './StaffHead';
import { ReactComponent as Icon } from '../../assets/icons/OrderMenuIcon.svg';
import classes from './Staff.module.scss';
import TableRowList from "./TableRowList"

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function statusCheck(status) {
  if (status) {
    return {
      color: '#092F33',
    };
  } else {
    return {
      color: '#828282',
    };
  }
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductsTable({ t, rows, headCells, elevators, locale, deleteStaff, getStaff, currentPage, pageSize }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEdit, setAnchorEdit] = useState(false);
  const open = Boolean(anchorEdit);

  const handleEditRow = (event) => {
    setAnchorEdit(event.currentTarget);
  };
  const handleCloseRow = (event) => {
    setAnchorEdit(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;


  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const userRole = (role) => {
    if (role === "OW") return "Поставщик"
    if (role === "AC") return "Бухгалтер"
    if (role === "AR") return "Администратор"
    if (role === "CL") return "Клиент"
    return ""
  }

  const getElevatorById = (elevator) => {
    return !!elevators?.length && elevators.map((item) => {
      return elevator === item.id && item
    }).filter((item) => item)
  }


  return (
    <div>
      <div>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size='medium'
          >
            <StaffHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
              headCells={headCells}
              t={t}
              currentPage={currentPage}
              pageSize={pageSize}
              getStaff={getStaff}
              selected={selected}
              setSelected={setSelected}
              locale={locale}
            />
            <TableBody>
              {!!rows?.length && stableSort(rows, getComparator(order, orderBy))
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  // locale, row, getElevatorById, handleClick, handleCloseRow
                  return (
                    <TableRowList
                      locale={locale}
                      row={row}
                      getElevatorById={getElevatorById}
                      handleClick={handleClick}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      classes={classes}
                      Icon={Icon}
                      userRole={userRole}
                      deleteStaff={deleteStaff}
                      getStaff={getStaff}
                      t={t}
                    />
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
