import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeliveryHeadTable from "./ApplicationHeadTable";
import { ReactComponent as Icon } from "../../assets/icons/OrderMenuIcon.svg";
import classes from "./Application.module.scss";
import green from "../../assets/icons/Ellipse_green.svg";
import grey from "../../assets/icons/Ellipse_sus.svg";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TableRowList from "./TableRowList";

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
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function statusCheck(status) {
    if (status) {
        return {
            color: "#092F33",
        };
    } else {
        return {
            color: "#828282",
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

export default function ApplicationTable({
    deleteOrderById,
    rows,
    headCells,
    locale,
    t,
    getApplications,
    currentPage,
    pageSize,
    handleSelectedOrders
}) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("calories");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEdit, setAnchorEdit] = useState(false);
    const open = Boolean(anchorEdit);
    const [anchorEditStatus, setAnchorEditStatus] = useState(false);
    const openStatus = Boolean(anchorEditStatus);

    const handleEditRowStatus = (event) => {
        setAnchorEditStatus(event.currentTarget);
    };

    const handleDeleteProducts = async (id) => {
        await deleteOrderById(id).then(() => {
            getApplications(
                "default",
                "default",
                "default",
                "default",
                "default",
                "default",
                "",
                currentPage,
                pageSize
            );
        });
    };

    const handleCloseRowStatus = (event) => {
        setAnchorEditStatus(null);
    };

    const handleEditRow = (event) => {
        setAnchorEdit(event.currentTarget);
    };

    const handleCloseRow = (id) => {
        setAnchorEdit(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
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


    React.useEffect(() => {
        handleSelectedOrders(selected)
    }, [selected])

    return (
        <div>
            <div>
                <TableContainer>
                    <Table
                        sx={{
                            minWidth: 750,
                            tableLayout: "fixed"
                        }}
                        aria-labelledby='tableTitle'
                        size='medium'
                    >
                        <DeliveryHeadTable
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows?.length}
                            headCells={headCells}
                            selected={selected}
                            getApplications={getApplications}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            setSelected={setSelected}
                            t={t}
                            locale={locale}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    // row, locale, isItemSelected, labelId, Icon, classes, handleDeleteProducts, handleClickCheckbox
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return <TableRowList
                                        row={row}
                                        locale={locale}
                                        isItemSelected={isItemSelected}
                                        labelId={labelId}
                                        Icon={Icon}
                                        classes={classes}
                                        handleDeleteProducts={handleDeleteProducts}
                                        handleClickCheckbox={handleClick}
                                        t={t}
                                    />
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
