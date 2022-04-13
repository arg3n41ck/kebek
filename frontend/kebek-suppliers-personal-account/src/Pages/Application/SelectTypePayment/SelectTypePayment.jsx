import * as React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function PaymentTypeSelect({
  t,
  data,
  locale,
  currency,
  setCurrency,
}) {
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <div style={{ width: "100%" }}>
      <TextField
        fullWidth
        id="outlined-select-currency"
        select
        value={!currency ? "default" : currency}
        onChange={handleChange}
      >
        <MenuItem value="default">
          {t.applications.selectors.selectPayType}
        </MenuItem>
        {!!data?.length &&
          data.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {locale === "ru"
                ? item.type.titleRu.length > 20
                  ? `${item.type.titleRu.slice(0, 15)}...`
                  : item.type.titleRu
                : item.type.titleKk.length > 20
                ? `${item.type.titleKk.slice(0, 15)}...`
                : item.type.titleKk}
            </MenuItem>
          ))}
      </TextField>
    </div>
  );
}
