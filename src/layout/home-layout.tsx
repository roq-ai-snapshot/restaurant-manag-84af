import { Box, Image, Text } from '@chakra-ui/react';
import { FC, ReactNode, useMemo } from 'react';
import { AppLogo } from './app-logo';
import { HelpBox } from 'components/help-box';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Box display="flex" flexDirection="column" h={{ lg: '100vh' }} bg="base.100">
      <HelpBox />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flex={{ base: '0 0 56px' }}
        flexBasis={{ lg: '80px' }}
        borderBottom="1px solid"
        borderBottomColor="base.300"
        padding="0 32px"
      >
        <AppLogo />
      </Box>
      <Box flex="0 0 auto" display={{ lg: 'flex' }} height={{ lg: 'calc(100vh - 80px)' }}>
        {children}
      </Box>
    </Box>
  );
}
