import Animated from 'react-native-reanimated';
import { View } from 'react-native';
import Header from '../header';
import TimeCom from '../time/TimeCom';
import MarqueeCom from '../marquee/Marquee';
import { RH, RW } from '../../constants/dimensions';
import { Media } from './Media';

const headerCom = <Header screen03 />;
const timeCom = <TimeCom screen03 />;
const marqueeCom = <MarqueeCom width={RW(100)} left={0} right={0} bottom={0} />;

export function TemplateThree({ slide }) {
  return (
    <Animated.View style={[{ height: RH(100), width: RW(100), backgroundColor: '#000' }]}>
      <View style={{ flexDirection: 'row' }}>
        {headerCom}
        <Media src={slide.src} type={slide.type} audio={slide.audio} duration={slide.duration} eventName={slide?.eventName} endDate={slide?.endDate} />
      </View>
      {timeCom}
      {marqueeCom}
    </Animated.View>
  );
}
