import { useSelector } from 'react-redux';
import Card from '../../components/card/Card';
import Welcome from '../../components/welcome/Welcome';
import { useGetContentQuery, useGetUserQuery } from '../../rtk/features/api/owner.user.api';
import LoadingCom from '../../components/loading/loadingCom';
import CardPrayerTime from '../../components/card/CardPrayerTime';
import { useAppContext } from '../../context/context';
import { useGetUserByOrgIdForUserTypeQuery } from '../../rtk/features/api/user.api';

export default function MasjidOwner() {
  const { org } = useSelector((state) => state.user);
  useGetUserByOrgIdForUserTypeQuery(org);
  const { totalScreen } = useAppContext();
  const { data } = useGetUserQuery(org);
  const { data: content, isLoading } = useGetContentQuery(org);
  const { totalAdmin, totalUser } = data || {};
  const { totalContent, time } = content || {};

  return (
    <div className='flex flex-1 px-10 py-7 flex-col space-y-6 '>
      {/* Welcome Part */}
      <Welcome />
      {/* Total Items cal part */}
      <div className='flex md:justify-between md:items-center border-b-2 flex-col md:flex-row items-start '>
        <Card
          title='Total Admin'
          number={totalAdmin || '00'}
          subTitle='All over the world'
          color='bg-teal-200'
          className='pb-5 md:pb-0'
        />
        <Card
          className='md:justify-center pb-5 md:pb-0'
          title='Total Content'
          number={totalContent || '00'}
          subTitle='All over the world'
          color='bg-yellow-25'
        />
        <Card
          className='md:justify-center pb-5 md:pb-0'
          title='Total User'
          number={totalUser || '00'}
          subTitle='Total Masjid Users'
          color='bg-yellow-400'
        />
        <Card
          className='md:justify-end pb-5 md:pb-0'
          border='border-0'
          title='Total Screen'
          number={totalScreen ||'00'}
          subTitle='Till date total screen'
          color='bg-green-700'
        />
      </div>

      {/* futures parts */}
      <div>
        <h1 className='font-NunitoSans font-bold text-2xl border-b-2 mb-3 pb-3'>Prayer Time</h1>
        {isLoading && <LoadingCom />}
        <div className='flex justify-center items-center w-full'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5 text-white font-NunitoSans w-full'>
            {time?.map((e) => <CardPrayerTime data={e} key={Math.random()} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
