import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userType } from '../../constants/constants';
import MasjidOwner from './MasjidOwner';
import SupperAdmin from './SupperAdmin';
import Admin from './Admin';
import {
  // useGetOrgByIdQuery,
  useLazyGetOrgByIdQuery,
} from '../../rtk/features/api/org.api';

function ContentList() {
  const { userType: user, org } = useSelector((s) => s.user);
  const [dispatch] = useLazyGetOrgByIdQuery();
  // useGetOrgByIdQuery(org);
  useEffect(() => {
    if (user!=='supper-admin') {
      dispatch(org);
    }
  }, []);

  if (user === userType.supperAdmin) return <SupperAdmin />;
  if (user === userType.masjidOwner) return <MasjidOwner />;
  if (user === userType.admin) return <Admin />;
}

export default ContentList;

