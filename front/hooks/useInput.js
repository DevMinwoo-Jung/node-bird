import { useState, useCallback } from "react";

export default (initialVlue = null) => {
  const [value, setValue] = useState(initialVlue);
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, handler];
};
