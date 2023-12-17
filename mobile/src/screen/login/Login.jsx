import {
  Box,
  Center,
  Heading,
  Spinner,
  useToast,
} from 'native-base';

import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import InputCom from '../../components/input/InputCom';
import { validation } from '../../utils/inputValidation';
import { useLoginMutation } from '../../rtk/features/api/api';
import { useAppContext } from '../../context/masjidContext';
import { fontsNames } from '../../constants/constants';
import { socketConnect } from '../../utils/socketConnect';
import { useAppToast } from '../../hook/useToast';

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailMessage, setEmailMessage] = useState();
  const [passMessage, setPassMessage] = useState();
  const [login, { isLoading, isError, isSuccess, data }] = useLoginMutation();
  const { setSocket } = useAppContext();
  const [isFocus, setFocus] = useState(1);
  const input01 = useRef(null);
  const input02 = useRef(null);
  const { isInternetReachable } = useNetInfo();
  const toast = useToast();

  // handle offline and online message
  const { showToast } = useAppToast();
  useEffect(() => {
    if (`${isInternetReachable}` === 'false') showToast({ message: 'You are offline' });
    if (`${isInternetReachable}` === 'true') showToast({ message: 'You are online now' });
  }, [isInternetReachable]);

  useEffect(() => {
    if (input01.current) input01.current.focus();
  }, []);

  useEffect(() => {
    if (input01.current && input02.current) {
      if (isFocus === 1) input01.current.focus();
      if (emailMessage)input01.current.focus();

      if (isFocus === 2) input02.current.focus();
      if (passMessage) input02.current.focus();
    }
  }, [isFocus, emailMessage, passMessage]);

  useEffect(() => {
    if (isSuccess) {
      const { socket } = socketConnect(data.token);
      setSocket(socket);
    }
  }, [isSuccess]);

  useEffect(() => {
    isError && toast.show({
      placement: 'top',
      render: () => (
        <Box bg='warning.400' px='2' py='1' rounded='sm' m='3'>
          Something wrong error occurs
        </Box>
      ),
    });
  }, [isError]);

  const handleSignIn = async () => {
    if (`${isInternetReachable}` === 'false') return showToast({ message: 'You are offline' });
    const { result: isEmail, message: emailMessage } = validation.isEmail(email);
    const { result: isPassword, message: passMessage } = validation.checkPass(password);
    setEmailMessage(emailMessage);
    setPassMessage(passMessage);
    if (isEmail && isPassword) login({ email, password });
  };

  return (
    <Center w='100%' h='100%' bg='#ffffff'>
      <Box safeArea p='2' py='8' w='90%' maxW='290'>
        <Heading fontFamily={fontsNames.POPPINS_MEDIUM} size='lg' fontWeight='600' color='coolGray.800'>
          Welcome
        </Heading>
        <Heading fontFamily={fontsNames.POPPINS_MEDIUM} mt='1' color='coolGray.600' fontWeight='medium' size='xs'>
          Sign in to continue!
        </Heading>

        <View style={{ marginTop: 7, rowGap: 4 }}>
          {/* <FormControl> */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setFocus(1)}
            onFocus={() => setFocus(1)}
            style={{ transform: [{ scale: isFocus === 1 ? 1.02 : 1 }] }}
          >
            <InputCom
              ref={input01}
              type='email'
              value={email}
              onChangeText={setEmail}
              label='Email id'
              inputType='email'
              wornMessage={emailMessage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setFocus(2)}
            onFocus={() => setFocus(2)}
            style={{ transform: [{ scale: isFocus === 2 ? 1.02 : 1 }] }}
          >
            <InputCom
              ref={input02}
              type='password'
              value={password}
              onChangeText={setPassword}
              label='Password'
              inputType='password'
              wornMessage={passMessage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            disabled={isLoading}
            style={{ width: '100%',
              backgroundColor: '#0000ffba',
              paddingVertical: 7,
              borderRadius: 5,
              marginTop: 5,
              transform: [{ scale: isFocus === 3 ? 1.02 : 1 }],
            }}
            onPress={() => { setFocus(3); handleSignIn(); }}
          >
            {isLoading ? <Spinner size='sm' color='white' /> : (
              <Text style={{
                textAlign: 'center',
                color: '#fff',
                fontWeight: 'bold',
              }}
              >
                Sign in
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Box>
    </Center>
  );
}
export default Login;
