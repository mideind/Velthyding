import { useState, useCallback } from "react";
import qs from "query-string";

const setQueryStringWithoutPageReload = (qsValue) => {
  const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${qsValue}`;

  window.history.pushState({ path: newurl }, "", newurl);
};

const setQueryStringValue = (
  key,
  value,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({ ...values, [key]: value });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

const getQueryStringValue = (key, queryString = window.location.search) => {
  const values = qs.parse(queryString);
  return values[key];
};

function useQueryString(key, initialValue) {
  const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
  const onSetValue = useCallback(
    (newValue) => {
      setValue(newValue);
      setQueryStringValue(key, newValue);
    },
    [key]
  );

  return [value, onSetValue];
}

export default useQueryString;
