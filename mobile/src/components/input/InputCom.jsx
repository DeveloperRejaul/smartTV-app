import { TextInput } from 'react-native';
import React, { useState, forwardRef } from 'react';
import {
  FormControl, HStack, Text, View,
} from 'native-base';
import Ionicon from '@expo/vector-icons/Ionicons';
import { styles } from './styles';

const passInput = ['confirmPassword', 'password'];

/**
 * @param {any}  value
 * @param {CallableFunction}  onChangeText
 * @param {string}  label
 * @param {string}  inputType
 * @param {string}  wornMessage
 * @returns
 */
export default forwardRef(({ value, onChangeText, label, inputType, wornMessage, handleKeyPress, handleOnSubmitEditing }, ref) => {
  const [focus, setFocus] = useState(false);
  const [showPass, setShowPass] = useState(true);

  return (
    <>
      <HStack justifyContent='space-between'>
        <FormControl.Label>{label}</FormControl.Label>
        <Text color='red.500' pr='5'>{wornMessage}</Text>
      </HStack>

      <View style={[styles.inputBody, {
        borderColor: focus ? '#4e46e5' : '#e4e4e7',
        backgroundColor: focus ? '#f4f4f5' : '#fff',
      }]}
      >
        <TextInput
          returnKeyType='done'
          keyboardType='default'
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleOnSubmitEditing}
          ref={ref}
          secureTextEntry={passInput.includes(inputType) && showPass}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={[styles.input, { width: passInput.includes(inputType) ? '88%' : '100%' }]}
          value={value}
          onChangeText={onChangeText}
        />
        {passInput.includes(inputType) && <Ionicon onPress={() => setShowPass((pre) => !pre)} name={showPass ? 'eye-off-outline' : 'eye-outline'} size={24} color='black' />}
      </View>

    </>
  );
});
