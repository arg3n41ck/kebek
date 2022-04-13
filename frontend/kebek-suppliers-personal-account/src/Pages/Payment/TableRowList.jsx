import React from 'react'
import { TableRow, TableCell, Checkbox, MenuItem, Menu } from '@mui/material'
import StatusProduct from '../../components/Status/StatusProduct';
import { Link } from "react-router-dom";

function TableRowList({ row, locale, isItemSelected, labelId, Icon, classes, handleClickCheckbox, handleDeletePayment, handleActivatePayment, getPayment }) {


    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleCloseRow = () => {
        setAnchorEl(null);
    };

    const handleActivate = async (id) => {
        await handleActivatePayment(id).then(() => {
            getPayment()
        })
        setAnchorEl(null)
    }

    const handleDelete = async (id) => {
        await handleDeletePayment(id).then(() => {
            getPayment()
        })
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return (
        <TableRow
            hover
            role='checkbox'
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.id}
            selected={isItemSelected}
        >
            <TableCell sx={{ width: '5%' }} padding='checkbox'>
                <Checkbox
                    onClick={(event) => handleClickCheckbox(event, row.id)}
                    color='primary'
                    checked={isItemSelected}
                    inputProps={{
                        'aria-labelledby': labelId,
                    }}
                />
            </TableCell>
            <TableCell
                component='th'
                id={labelId}
                scope='row'
                padding='none'
            >
                {locale === "ru" ? (row.elevator.titleRu.length > 20 ? `${row.elevator.titleRu.slice(0, 15)}...` : row.elevator.titleRu) : (row.elevator.titleKk.length > 20 ? `${row.elevator.titleKk.slice(0, 15)}...` : row.elevator.titleKk)}
            </TableCell>
            <TableCell align='left'>{locale === "ru" ? row.type.titleRu : row.type.titleKk}</TableCell>
            <TableCell align='left'>{`${row.minutes} мин`}</TableCell>
            <TableCell align='left'>
                {!!row?.status &&
                    <StatusProduct statusName={row.status} />
                }
            </TableCell>

            <TableCell sx={{ width: '5%' }} align='right'>
                <button
                    className={classes.three_dots__button}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    style={{
                        width: '25px',
                    }}
                >
                    <Icon />
                </button>
                <Menu
                    id='edit-menu'
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseRow}
                    sx={{ width: '200px' }}
                >
                    <Link to={`edit-payment/${row.id}`}>
                        <MenuItem sx={{ color: "black" }} onClick={handleCloseRow}>
                            {locale === "ru" ? "Изменить" : "Өзгерту"}
                        </MenuItem>
                    </Link>
                    <MenuItem onClick={() => handleActivate(row.id)}>{locale === "ru" ? "Активировать" : "Іске қосу"}</MenuItem>
                    <MenuItem onClick={() => handleDelete(row.id)}>{locale === "ru" ? "Перенести в архив" : "Мұрағатқа жылжытыңыз"}</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export default TableRowList