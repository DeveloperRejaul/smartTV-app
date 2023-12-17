import { useSelector } from 'react-redux';
import { userType } from '../../constants/constants';
import SuperAdmin from './SuperAdmin';
import MasjidOwner from './MasjidOwner';

function Admin() {
  const { userType: user } = useSelector((s) => s.user);
  if (user === userType.supperAdmin) return <SuperAdmin />;
  if (user === userType.masjidOwner) return <MasjidOwner />;
}

export default Admin;
