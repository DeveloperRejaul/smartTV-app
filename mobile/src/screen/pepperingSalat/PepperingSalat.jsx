import { View, Image } from 'react-native';
import { interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNetInfo } from '@react-native-community/netinfo';
import { PAGE_HEIGHT, PAGE_WIDTH, styles } from './styles';
import { baseUrl, contentType, prayerNavigation } from '../../constants/constants';
import { checkEqual } from '../../utils/selectorCheck';
import { updatePrayerNavigation } from '../../rtk/features/navigation/navigationSlice';
import { data } from './data';
import ClockCom2 from '../../components/clock/ClockCom2';
import AudioCom from '../../components/Audio/AudioCom';
import { COLORS } from '../../constants/colors';
// import { useAppToast } from '../../hook/useToast';

let timeout;
function PepperingSalat() {
  const { isInternetReachable } = useNetInfo();
  // const { showToast } = useAppToast();
  const [play, setPlay] = useState(true);
  const { activeContent } = useSelector((state) => state.content, checkEqual) || {};
  const salatScreen = useSelector((state) => state.screen?.screen?.salatScreen);

  // console.log(activeContent);
  const prepareSalatTime = activeContent?.filter((d) => d.type === contentType.SALAT_SLIDE)[0];
  const stayPrepareSalat = prepareSalatTime?.startTime;
  const dispatch = useDispatch();

  useEffect(() => {
    timeout = setTimeout(() => {
      dispatch(updatePrayerNavigation(prayerNavigation.SALAT));
    }, stayPrepareSalat);
    return () => { clearTimeout(timeout), setPlay(false); };
  }, []);

  // animation configuration
  const animationStyle = useCallback((value) => {
    'worklet';

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const opacity = interpolate(value, [-0.75, 0, 1], [0, 1, 0]);
    return { zIndex, opacity };
  }, []);

  const slideImages = isInternetReachable === 'false' ? data : prepareSalatTime?.slides?.length > 0 ? prepareSalatTime.slides : data;

  return (
    <>
      { salatScreen ? (
        <>
          {prepareSalatTime?.audio && <AudioCom src={prepareSalatTime?.audio} />}
          <View style={{ flex: 1 }}>
            <Carousel
              style={styles.carousel}
              loop
              autoPlay={play}
              width={PAGE_WIDTH}
              height={PAGE_HEIGHT}
              autoPlayInterval={5000}
              scrollAnimationDuration={2000}
              data={slideImages}
              renderItem={({ item }) => (
                <View style={styles.body}>
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    source={prepareSalatTime?.slides?.length > 0 ? { uri: baseUrl + item } : item.src}
                    alt='peapre salat'
                    resizeMode='cover'
                  />
                </View>
              )}
              customAnimation={animationStyle}
            />
            <ClockCom2 />
          </View>
        </>
      )
        : <View style={{ flex: 1, backgroundColor: COLORS.black }} />}
    </>

  );
}

export default PepperingSalat;
