import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'native-base';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBarCom from '../components/ProgressBar/ProgressBar';
import { RH, RW } from '../constants/dimensions';
import useTimer from '../hook/useTimer';
import { styles } from './styles';

const progressWidth = RW(50);
const progressHeight = RH(5);

export default function Prayer({ name, time }) {
  const { minutes } = useTimer({ countDown: true, time });

  return (
    <Stack justifyContent='center' flex='1' bg='black' alignItems='center'>
      <Text style={styles.text}>Waktu sebelum azan</Text>
      <MaskedView style={styles.mask} maskElement={<View style={styles.maskTextBody}><Text style={styles.maskText}>{name}</Text></View>}>
        <LinearGradient
          colors={['#0C356A', '#FD8D14', '#0C356A']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.1, y: 0.1 }}
          style={{ flex: 1 }}
        />
      </MaskedView>

      <ProgressBarCom time={time} width={progressWidth} height={progressHeight} style={styles.progress} />
      <Text style={styles.timerText}>{`${minutes[0]}${minutes[1]} : ${minutes[2]}${minutes[3]}` }</Text>

    </Stack>
  );
}
