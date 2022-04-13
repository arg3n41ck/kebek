import { useMemo } from "react";
import { useLocation } from "react-router-dom";

//??? query = useQuery();
//??? query.set('search', searchValue) - setting new query params or update existing
//??? query.delete('search'); - removing certain query param
//??? query.has('search'); - Boolean, checking for existing of certain param

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}
export default useQuery;
