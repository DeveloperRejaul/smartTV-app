import { Image, View, StyleSheet } from 'react-native';
import React from 'react';
import { RH, RW } from '../../constants/dimensions';

export default function ImageBackground({ children, source }) {
  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={styles.image}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RW(100),
    height: RH(100),
    position: 'absolute',
    zIndex: -1,
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    flex: 1,
    position: 'absolute',
    zIndex: -1,
  },
});
