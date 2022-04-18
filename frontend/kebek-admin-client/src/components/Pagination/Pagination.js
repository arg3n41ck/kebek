import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PaginationItem from "@mui/material/PaginationItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { localeContext } from "../../providers/LocaleProvider";

export default function PaginationApplication({
  page = 1,
  count = 20,
  changePageHandler,
}) {
  const isSm = useMediaQuery("(max-width:578px)");
  const { t } = React.useContext(localeContext);

  return (
    <Stack spacing={2} alignItems="center">
      <Pagination
        boundaryCount={isSm ? 0 : 1}
        siblingCount={isSm ? 0 : 1}
        shape="rounded"
        page={page}
        count={count}
        variant="text"
        size={isSm ? "medium" : "large"}
        color="primary"
        style={{ width: "100%" }}
        onChange={(_, _page) => changePageHandler(_page)}
        renderItem={(item) => (
          <PaginationItem
            components={{
              previous: () => t.applications.pagination.prev,
              next: () => t.applications.pagination.next,
            }}
            {...item}
          />
        )}
      />
    </Stack>
  );
}
