import { useLocation } from 'react-router-dom';

export default (name) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = JSON.parse(queryParams.get(name));
  return { data };
};
