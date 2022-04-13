import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { currencies } from './SelectStatusData';

export default function SelectStatus({ locale, currency, setCurrency }) {

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
        <MenuItem value={"default"}>
          {locale === "ru" ? 'Выберите статус' : 'Күйді таңдаңыз'}
        </MenuItem>
        {currencies.map((item) => (
          <MenuItem key={item.id} value={item.value}>
            {locale === "ru" ? item.label : item.labelKk}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
