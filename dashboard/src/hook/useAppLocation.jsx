import { useLocation } from 'react-router-dom';
import { stringFirstUp } from '../utils/stringOpration';

export default () => {
  const location = useLocation();
  if (location.pathname === '/') return 'Dashboard';
  return stringFirstUp(location.pathname.slice(1, location.pathname.length));
};
