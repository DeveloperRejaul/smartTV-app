import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppContext } from '../../context/context';
import MasjidOwner from './MasjidOwner';
import SupperAdmin from './SupperAdmin';
import { userType } from '../../constants/constants';
import Admin from './Admin';

export default function Home() {
  const { socket } = useAppContext();
  const { userType: type } = useSelector((state) => state.user);
  document.title=`${import.meta.env.VITE_APP_TITLE} | DASHBOARD`;

  useEffect(() => {
    socket.connect();
  }, [socket]);

  if (type === userType.supperAdmin) return <SupperAdmin />;
  if (type === userType.masjidOwner) return <MasjidOwner />;
  if (type === userType.admin) return <Admin />;
}
