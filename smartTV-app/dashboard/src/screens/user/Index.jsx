import { useSelector } from 'react-redux';
import { userType } from '../../constants/constants';
import SupperAdmin from './SupperAdmin';
import MasjidOwner from './MasjidOwner';
import Admin from './Admin';

function User() {
  const { userType: user } = useSelector((s) => s.user);

  if (user === userType.supperAdmin) return <SupperAdmin />;
  if (user === userType.masjidOwner) return <MasjidOwner />;
  if (user === userType.admin) return <Admin />;
}

export default User;
