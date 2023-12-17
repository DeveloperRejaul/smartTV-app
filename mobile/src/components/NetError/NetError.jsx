import { Box, Center, Text } from 'native-base';
import Icon from '@expo/vector-icons/Entypo';
import { RF, RW } from '../../constants/dimensions';
import { COLORS } from '../../constants/colors';

export default function NetError() {
  return (
    <Center flex={1}>
      <Box bg='amber.400' w='50%' h='50%' shadow='2' justifyContent='space-between' rounded='lg' overflow='hidden'>
        <Center flex={1} justifyContent='space-evenly'>
          <Center h={RW(7)} w={RW(7)} bg='amber.600' rounded='full' justifyContent='center' alignItems='center'>
            <Icon name='paper-plane' size={RF(3.5)} style={{ paddingRight: 3 }} color={COLORS.white} />
          </Center>
          <Box>
            <Text color='white' textAlign='center' fontWeight='semibold' fontSize='lg'>We Couldn't find flight </Text>
            <Text color='white' textAlign='center' fontSize='md' fontWeight='normal'>The internet connection to be offline </Text>
          </Box>
        </Center>
        <Box bg='white' h='15%' justifyContent='center' alignItems='center'>
          <Text fontWeight='bold' fontSize='lg' color='amber.400'>Offline</Text>
        </Box>
      </Box>
    </Center>
  );
}
