import Animated from 'react-native-reanimated';
import { View } from 'react-native';
import Header from '../header';
import TimeCom from '../time/TimeCom';
import { sliderWidth } from '../../constants/constants';
import MarqueeCom from '../marquee/Marquee';
import { Media } from './Media';

const headerCom = <Header screen01 />;
const timeCom = <TimeCom />;
const marqueeCom = <MarqueeCom width={sliderWidth} right={0} bottom={0} />;

export function TemplateTwo({ slide }) {
  return (
    <Animated.View style={{ backgroundColor: '#000' }}>
      {headerCom}
      <View style={{ flexDirection: 'row' }}>
        {timeCom}
        <Media
          src={slide.src}
          type={slide.type}
          audio={slide.audio}
          duration={slide.duration}
          eventName={slide?.eventName}
          endDate={slide?.endDate}
        />
      </View>
      {marqueeCom}
    </Animated.View>
  );
}
