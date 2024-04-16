import { useState } from 'react';

const useSharedState = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  return [value, setValue];
};

export default useSharedState;