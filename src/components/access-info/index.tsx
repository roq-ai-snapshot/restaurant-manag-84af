import { Flex, Text, Box } from '@chakra-ui/react';
import { useAccessInfo } from 'lib/hooks/use-access-info-text';
import { FiAlertCircle } from 'react-icons/fi';

interface AccessInfoProps {
  entity: string;
}
export const AccessInfo = (props: AccessInfoProps) => {
  const text = useAccessInfo(props.entity);
  return (
    <Flex borderColor="base.300 !important" border="1px" borderRadius="md" p={2} alignItems="center" mb={4}>
      <Box color="neutral.main" mr={1}>
        <FiAlertCircle />
      </Box>
      <Text color="neutral.main" fontSize="sm">
        {text}
      </Text>
    </Flex>
  );
};
