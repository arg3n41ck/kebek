import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { currencies } from './SelectData';
import ListItemText from "@mui/material/ListItemText";
import classNames from "classnames"
import cl from "../Application.module.scss"

export default function PositionSelect({t, data, locale, setCurrency, currency }) {

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div style={{ width: '100%' }}>
      <TextField
        fullWidth
        id='outlined-select-currency'
        select
        value={!currency ? "default" : currency}
        onChange={handleChange}
      >
        <MenuItem value="default">
            {t.applications.selectors.selectStatus}
        </MenuItem>
        {!!data?.length && data.map((item) => (
          <MenuItem
            key={item.pluralName}
            value={item.encryptedName}
            className={classNames(cl.select1)}
            // onClick={() => setCurrency(item.encryptedName)}
            sx={{
              padding: "10px 0",
              "& .MuiListItemText-root": { padding: "0 15px" },
            }}
          >
            <ListItemText sx={{ margin: 0 }} primary={locale === "ru" ? item.pluralName : item.pluralNameKk} />
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
