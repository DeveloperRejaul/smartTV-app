import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import mainStack from './MainStack';
import authStack from './AuthStack';

export default function MainNavigation() {
  const isLogin = useSelector((state) => state.auth.isLogin, shallowEqual);
  const Stack = createNativeStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLogin ? mainStack(Stack) : <>{authStack(Stack)}</>}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
