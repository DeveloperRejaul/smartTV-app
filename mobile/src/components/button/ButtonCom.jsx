import { Spinner, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { fontsNames } from '../../constants/constants';

export default function ButtonCom({
  text, onPress, isLoading, style,
}) {
  return (
    <TouchableOpacity
      disabled={isLoading}
    >
      { isLoading ? <Spinner size='sm' color='white' /> : (
        <Text
          fontFamily={fontsNames.POPPINS_MEDIUM}
          mt='2'
          colorScheme='indigo'
          py='2'
          onPress={onPress}
          style={style}
          textAlign='center'
          bg='blue.500'
          borderRadius={10}
        >
          {text}
        </Text>
      ) }
    </TouchableOpacity>
  );
}
