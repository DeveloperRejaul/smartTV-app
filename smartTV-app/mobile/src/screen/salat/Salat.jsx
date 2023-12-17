import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { baseUrl, contentType, navigationType, window } from '../../constants/constants';
import { checkEqual } from '../../utils/selectorCheck';
import { updateNavigation } from '../../rtk/features/navigation/navigationSlice';
import SalatImage from '../../assists/images/solat.jpg';
import { COLORS } from '../../constants/colors';
import ClockCom2 from '../../components/clock/ClockCom2';
import AudioCom from '../../components/Audio/AudioCom';
// import { useAppToast } from '../../hook/useToast';

let timeout;
export default function Salat() {
  const { isInternetReachable } = useNetInfo();
  // const { showToast } = useAppToast();
  const { activeContent } = useSelector((state) => state.content, checkEqual) || {};
  const salatTime = activeContent?.filter((d) => d.type === contentType.SALAT)[0];
  const salatStayTime = salatTime?.startTime;
  const dispatch = useDispatch();

  useEffect(() => {
    timeout = setTimeout(() => {
      dispatch(updateNavigation(navigationType.HOME));
    }, salatStayTime);
    return () => { clearTimeout(timeout); };
  }, []);

  const slideImage = `${isInternetReachable}` === 'false' ? SalatImage : !salatTime?.src ? SalatImage : { uri: baseUrl + salatTime?.src };

  return (
    <>
      {salatTime?.audio && <AudioCom src={salatTime?.audio} /> }
      <View style={{ height: window.height, width: window.width, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={slideImage} style={{ height: '100%', width: '100%' }} resizeMode='cover' />
        <ClockCom2 />
      </View>
    </>
  );
}
