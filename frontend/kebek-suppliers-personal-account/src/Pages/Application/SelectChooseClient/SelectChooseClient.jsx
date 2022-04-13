import * as React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export const currencies = [
  {
    value: "«Ново-Альджанский...»",
    label: "«Ново-Альджанский...»",
  },
  {
    value: "«Ново-Альджанский...»",
    label: "«Ново-Альджанский...»",
  },
  {
    value: "«Ново-Альджанский...»",
    label: "«Ново-Альджанский...»",
  },
  {
    value: "«Ново-Альджанский...»",
    label: "«Ново-Альджанский...»",
  },
];

// export default function PaymentTypeSelect({ data, locale, currency, setCurrency }) {

//     const handleChange = (event) => {
//         setCurrency(event.target.value);
//     };

//     return (
//         <div style={{ width: '100%' }}>
//             <TextField
//                 fullWidth
//                 id='outlined-select-currency'
//                 select
//                 value={currency}
//                 onChange={handleChange}
//             >
//                 {!!data?.length && data.map((item) => (
//                     <MenuItem key={item.id} value={item.id}>
//                         {locale === "ru" ? (item.titleRu.length > 20 ? `${item.titleRu.slice(0, 15)}...` : item.titleRu) : (item.titleKk.length > 20 ? `${item.titleKk.slice(0, 15)}...` : item.titleKk)}
//                     </MenuItem>
//                 ))}
//             </TextField>
//         </div>
//     );
// }

export default function ChooseClientSelect({
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
          {t.applications.selectors.selectClient}
        </MenuItem>

        {!!data?.length &&
          data.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.firstName}
            </MenuItem>
          ))}
      </TextField>
    </div>
  );
}
