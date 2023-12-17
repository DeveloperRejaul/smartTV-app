import { navStr } from '../constants/navigationString';
import Login from '../screen/login/Login';

export default function authStack(Stack) {
  return <Stack.Screen name={navStr.login} component={Login} />;
}
