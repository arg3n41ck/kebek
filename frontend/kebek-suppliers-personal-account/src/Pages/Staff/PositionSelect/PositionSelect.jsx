import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { position } from './PositionSelectData';

export default function PositionSelect({t, currency, setCurrency }) {

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
            {t.staff.selectors.selectPosition}
        </MenuItem>
        {position.map((item) => (
          <MenuItem key={item.id} value={item.value}>
            {item.title}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
