import React from 'react';
import { Text, View } from 'react-native';
import { HStack, VStack } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { styles } from './styles';

/**
 * @param {boolean} countDown
 * @param {boolean} countUp
 * @param {number} time number of minutes
 * @returns
 */

export default function Countdown({ minutes, text }) {
  return (
    <LinearGradient
      colors={['#FAF4B7', '#FAF5E4']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0.01, y: 0.2 }}
      style={styles.container}
    >
      <MaskedView style={styles.mask} maskElement={<View style={styles.maskTextBody}><Text style={styles.maskText}>{text}</Text></View>}>
        <LinearGradient
          colors={['#0C356A', '#FD8D14', '#0C356A']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.1, y: 0.1 }}
          style={{ flex: 1 }}
        />
      </MaskedView>
      <HStack space='4' justifyContent='center' alignItems='center'>
        <View style={styles.time}><Text style={styles.timeText}>{minutes[0]}</Text></View>
        <View style={styles.time}><Text style={styles.timeText}>{minutes[1]}</Text></View>
        <VStack style={styles.dotBody} justifyContent='space-evenly' alignItems='center'>
          <View style={styles.dot} />
          <View style={styles.dot} />
        </VStack>
        <View style={styles.time}><Text style={styles.timeText}>{minutes[2]}</Text></View>
        <View style={styles.time}><Text style={styles.timeText}>{minutes[3]}</Text></View>
      </HStack>
    </LinearGradient>
  );
}
