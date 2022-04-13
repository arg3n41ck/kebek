import React from 'react'
import { TableRow, TableCell, Checkbox, MenuItem, Menu } from '@mui/material'
import { Link } from "react-router-dom"
// // Icon={Icon}
function TableRowList({ row, isItemSelected, labelId, handleClick, locale, classes, Icon }) {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickToAnchor = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleCloseRow = () => {
        setAnchorEl(null);
    };


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
                    onClick={(event) => handleClick(event, row.id)}
                    color='primary'
                    checked={isItemSelected}
                    inputProps={{
                        'aria-labelledby': labelId,
                    }}
                />
            </TableCell>
            <TableCell
                sx={{ width: '30%' }}
                component='th'
                id={labelId}
                scope='row'
                padding='none'
            >
                {locale === "ru" ? row.titleRu : row.titleKk}
            </TableCell>
            <TableCell sx={{ width: '30%' }} align='left'>
                {locale === "ru" ? row.addressRu : row.addressKk}
            </TableCell>
            <TableCell
                sx={{ width: '30%' }}
                align='left'
            >{`${row.phoneNumber}`}</TableCell>
            <TableCell sx={{ width: '5%' }} align='right'>
                <button
                    className={classes.three_dots__button}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickToAnchor}
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
                    <Link to={`suppliers-edit/${row.id}`}>
                        <MenuItem sx={{ color: "black" }} onClick={handleCloseRow}>
                            {locale === "ru" ? "Изменить" : "Өзгерту"}
                        </MenuItem>
                    </Link>
                    {/* <MenuItem onClick={handleCloseRow}>Удалить</MenuItem> */}
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export default TableRowList