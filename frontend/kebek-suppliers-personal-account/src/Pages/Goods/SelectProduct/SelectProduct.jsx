import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { currencies } from './SelectProductData';

export default function SelectProduct({ locale, data, currency, setCurrency }) {

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
          {locale === "ru" ? 'Выберите наименование' : 'Атын таңдаңыз'}
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
