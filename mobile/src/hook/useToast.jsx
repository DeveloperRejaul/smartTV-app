import { Box, useToast } from 'native-base';

export function useAppToast() {
  const toast = useToast();

  const showToast = ({ message = '', position = '' } = {}) => {
    message && toast.show({
      placement: position || 'top-right',
      render: () => (
        <Box mr='10' bg='emerald.500' px='2' py='1' rounded='sm' mb={5}>
          {message}
        </Box>
      ),
    });
  };

  return { showToast };
}
