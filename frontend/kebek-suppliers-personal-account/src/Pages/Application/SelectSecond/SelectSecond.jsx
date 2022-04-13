import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { currencies } from './SelectData';

export default function PositionSelect({t, data, locale, currency, setCurrency }) {

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
            {t.applications.selectors.selectName}
        </MenuItem>
        {!!data?.length && data.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {locale === "ru" ? item.titleRu : item.titleKk}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
