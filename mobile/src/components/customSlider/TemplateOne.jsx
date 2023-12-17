import Animated from 'react-native-reanimated';
import { View } from 'react-native';
import Header from '../header';
import { sliderWidth } from '../../constants/constants';
import MarqueeCom from '../marquee/Marquee';
import TimeCom from '../time/TimeCom';
import { Media } from './Media';

const headerCom = <Header screen01 />;
const timeCom = <TimeCom />;
const marqueeCom = <MarqueeCom width={sliderWidth} left={0} bottom={0} />;

export function TemplateOne({ slide }) {
  return (
    <Animated.View style={{ backgroundColor: '#000' }}>
      {headerCom}
      <View style={{ flexDirection: 'row' }}>
        <Media src={slide.src} type={slide.type} audio={slide.audio} duration={slide.duration} eventName={slide?.eventName} endDate={slide?.endDate} />
        {timeCom}
      </View>
      {marqueeCom}
    </Animated.View>
  );
}
