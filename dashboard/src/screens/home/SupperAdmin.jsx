import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Card from '../../components/card/Card';
import CardFutures from '../../components/card/CardFutures';
import { colors } from '../../constants/colors';
import Welcome from '../../components/welcome/Welcome';
import { navPath } from '../../constants/navPath';
import { useGetAllNumberOfUserQuery } from '../../rtk/features/api/user.api';
import { useGetAllOrgQuery } from '../../rtk/features/api/org.api';
import { useGetAllContentQuery } from '../../rtk/features/api/content.api';
import { useAppContext } from '../../context/context';
import { usePresents } from '../../hook/usePresents';

export default function SupperAdmin() {
  const navigate = useNavigate();
  const { data, refetch } = useGetAllNumberOfUserQuery();
  const { data: org } = useGetAllOrgQuery();
  const { data: content } = useGetAllContentQuery();
  const { activeOrgs } = useAppContext();
  const inactiveOrgs = org?.orgNum - activeOrgs;
  const screens = usePresents({ total: org?.orgNum, min: org?.orgNum });
  const on = usePresents({ total: org?.orgNum, min: activeOrgs });
  const off = usePresents({ total: org?.orgNum, min: inactiveOrgs });
  const images = usePresents({
    total: content?.contentNum,
    min: content?.totalImage,
  });
  const videos = usePresents({
    total: content?.contentNum,
    min: content?.totalVideo,
  });
  const urls = usePresents({
    total: content?.contentNum,
    min: content?.totalUrl,
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className='flex flex-1 px-10 py-7 flex-col space-y-6 '>
      {/* Welcome Part */}
      <Welcome />
      {/* Total Items cal part */}
      <div className='flex md:justify-between md:items-center border-b-2 flex-col md:flex-row items-start '>
        <Card
          title='Total Masjid Owner'
          number={data?.owners || 0}
          subTitle='All over the world'
          color='bg-teal-200'
          className='pb-5 md:pb-0'
        />
        <Card
          className='md:justify-center pb-5 md:pb-0'
          title='Total Masjid Admin'
          number={data?.admins || 0}
          subTitle='All over the world'
          color='bg-yellow-25'
        />
        <Card
          className='md:justify-center pb-5 md:pb-0'
          title='Total User'
          number={data?.users || 0}
          subTitle='Total Masjid Users'
          color='bg-yellow-400'
        />
        <Card
          className='md:justify-end pb-5 md:pb-0'
          border='border-0'
          title='Total Screen'
          subTitle='Till date total screen'
          color='bg-green-700'
          number={data?.screen || 0}
        />
      </div>

      {/* futures parts */}

      <div className='h-52  flex gap-5 flex-col lg:flex-row'>
        <div className=' lg:max-w-[30rem] w-full'>
          <CardFutures
            btnText='See Details'
            name='Organization'
            text1={`${Math.abs(activeOrgs)} Active`}
            text2={`${Math.abs(inactiveOrgs)} Inactive`}
            text3={`${org?.orgNum} Screen`}
            number={org?.orgNum || 0}
            percentage1={on}
            percentage2={off}
            percentage3={screens}
            bgColor={colors.tint}
            stockColor={colors.circle}
            borderColor={colors.circleBorder}
            onClick={() => navigate(navPath.organization)}
          />
        </div>
        <div className='lg:max-w-[30rem] w-full'>
          <CardFutures
            btnText='See Details'
            name='Media'
            text1={`${content?.totalImage || '0'} Image`}
            text2={`${content?.totalVideo || '0'} Video`}
            text3={`${content?.totalUrl || '0'} URLs`}
            number={content?.contentNum || 0}
            percentage1={images}
            percentage2={videos}
            percentage3={urls}
            bgColor={colors.circle2}
            stockColor={colors.circle2Stock}
            borderColor={colors.circle2Border}
            onClick={() => navigate(navPath.content)}
          />
        </div>
      </div>
    </div>
  );
}

