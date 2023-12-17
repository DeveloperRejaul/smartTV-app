import React from 'react';
import { navStr } from '../constants/navigationString';
import Home from '../screen/Home/Home';

export default function MainStack(Stack) {
  return (
    <>
      <Stack.Screen name={navStr.home} component={Home} />
    </>
  );
}
