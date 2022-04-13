import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { NativeSelect } from "@mui/material";
import * as React from "react";

export type FilterItem = {
  id: string;
  label: string;
  value: string;
};
interface Props {
  data: FilterItem[];
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CustomSelect({ data, label, value, onChange }: Props) {
  return (
    <Box sx={{ width: "auto" }}>
      <FormControl sx={{ width: "100%" }}>
        <NativeSelect
          style={{
            border: "1px solid #EEEEEE",
            borderRadius: "0.25rem",
            padding: "10px 0",
          }}
          defaultValue={value}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option style={{ width: "100%" }}>ㅤ{label}</option>
          {data.map((item: any) => (
            <option
              style={{
                width: "250px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              key={item.id}
              value={item.value}
            >
              ㅤ{item.label}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </Box>
  );
}
