import { TableRow, TableCell, Checkbox, MenuItem, Menu } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import StatusProduct from '../../components/Status/StatusProduct';

function TableRowList({ row, locale, isItemSelected, labelId, Icon, classes, handleDeleteProducts, handleClickCheckbox, handleActivateProduct }) {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleCloseRow = () => {
        setAnchorEl(null);
    };

    const handleDelete = async (id) => {
        await handleDeleteProducts(id)
        setAnchorEl(null)
    }

    const handleActivate = async (id) => {
        await handleActivateProduct(id)
        setAnchorEl(null)
    }



    const open2 = Boolean(anchorEl);
    const id = open2 ? 'simple-popper' : undefined;

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
            <TableCell align='left'>{row.setNumber}</TableCell>
            <TableCell align='left'>{row.price}</TableCell>
            <TableCell align='left'>{row.residue}</TableCell>
            <TableCell align='left'>
                <StatusProduct statusName={row.status} />
            </TableCell>

            <TableCell sx={{ width: '5%' }} align='right'>
                <div style={{ marginRight: 15 }}>
                    <button
                        onClick={handleClick}
                        style={{ border: "none", padding: "0" }}>
                        <Icon />
                    </button>
                    <Menu
                        id='edit-menu'
                        anchorEl={anchorEl}
                        open={open2}
                        onClose={handleCloseRow}
                        sx={{ width: '200px' }}
                    >
                        <Link to={`/goods/edit-goods/${row.id}`}>
                            <MenuItem sx={{ color: "black" }}>{locale === "ru" ? "Изменить" : "Өзгерту"}</MenuItem>
                        </Link>
                        <MenuItem onClick={() => handleActivate(row.id)}>{locale === "ru" ? "Активировать" : "Іске қосу"}</MenuItem>
                        <MenuItem onClick={() => handleDelete(row.id)}>{locale === "ru" ? "Перенести в архив" : "Мұрағатқа жылжытыңыз"}</MenuItem>
                    </Menu>
                </div>
            </TableCell>
        </TableRow>
    )
}

export default TableRowList