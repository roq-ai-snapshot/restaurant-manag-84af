import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  IconProps,
  Text,
  useBreakpointValue,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import {
  ChatMessageBell,
  NotificationBell,
  UserAccountDropdown,
  useAuthorizationApi,
  useSession,
  AccessServiceEnum,
  RoqResourceEnum,
  AccessOperationEnum,
} from '@roq/nextjs';
import ConfigureCodeBanner from 'components/configure-code-banner';
import { useBanner } from 'lib/hooks/use-banner';
import { HelpBox } from 'components/help-box';
import { PoweredBy } from 'components/powered-by';
import { ReactNode, useCallback, useEffect } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import { GithubIcon } from 'icons/github-icon';
import { SlackIcon } from 'icons/slack-icon';
import { TwitterIcon } from 'icons/twitter-icon';
import { YoutubeIcon } from 'icons/youtube-icon';
import { AppLogo } from 'layout/app-logo';
import Link from 'next/link';
import { IconType } from 'react-icons';
import * as inflection from 'inflection';

import { ChatIcon } from 'icons/chat-icon';
import { CustomerIcon } from 'icons/customer-icon';
import { HamburgerIcon } from 'icons/hamburger-icon';
import { HomeIcon } from 'icons/home-icon';
import { InviteMemberIcon } from 'icons/invite-member-icon';
import { LogoIcon } from 'icons/logo-icon';
import { NotificationIcon } from 'icons/notification-icon';
import { ReservationIcon } from 'icons/reservation-icon';
import { RestaurantIcon } from 'icons/restaurant-icon';
import { TableIcon } from 'icons/table-icon';
import { UserIcon } from 'icons/user-icon';
import { useRouter } from 'next/router';
import { routes } from 'routes';
import useSWR from 'swr';
import { FiMail, FiUsers, FiMenu, FiUser, FiMessageCircle, FiFile, FiBox } from 'react-icons/fi';

import { RestaurantInterface } from 'interfaces/restaurant';
import { getRestaurants } from 'apiSdk/restaurants';

interface LinkItemProps {
  name: string;
  icon?: IconType;
  path: string;
  entity: string;
  service?: AccessServiceEnum;
}

interface NavItemPropsInterface {
  name: string;
  icon?: IconType;
  path: string;
  entity: string;
  service?: AccessServiceEnum;
}

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: ReactNode;
}

const sidebarFooterLinks = [
  { Icon: TwitterIcon, url: '#' },
  { Icon: GithubIcon, url: '#' },
  { Icon: YoutubeIcon, url: '#' },
  { Icon: SlackIcon, url: '#' },
];

export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMd = useBreakpointValue({ base: false, md: true });
  const { isBannerVisible, setIsBannerVisible } = useBanner();

  useEffect(() => {
    if (isMd && isOpen) {
      onClose();
    }
  }, [isMd, isOpen, onClose]);

  return (
    <Box minH="100vh" bg={'base.100'}>
      <ConfigureCodeBanner isBannerVisible={isBannerVisible} setIsBannerVisible={setIsBannerVisible} />
      <HelpBox />
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} display={{ base: 'block', md: 'none' }} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} isBannerVisible={isBannerVisible} />

      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Breadcrumbs */}
        {breadcrumbs ? breadcrumbs : null}
        {/* Content */}
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  display: Record<string, string>;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  let loading = false;
  const { session } = useSession();
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();

  const isActiveRoute = useCallback(
    (path: string) => {
      return router.pathname === path || (path !== '/' && router.pathname.startsWith(path));
    },
    [router],
  );

  const tenantRoles = ['owner', 'manager', 'staff-member', 'chef'];
  const isTenantUser = tenantRoles.some((role) => session?.user?.roles?.includes(role));
  const { data, error, isLoading } = useSWR<RestaurantInterface[]>(
    () => (isTenantUser && session?.user?.tenantId ? `/restaurants` : null),
    () => getRestaurants({ tenant_id: session?.user?.tenantId }).then(({ data }) => data),
  );
  loading = isLoading;

  const MockedLinkItems: Array<NavItemPropsInterface> = [
    { name: 'Users', icon: FiUsers, path: '/users', entity: 'user', service: AccessServiceEnum.PROJECT },

    {
      name: 'Restaurant',
      path: isTenantUser ? `/restaurants/view/${data?.[0]?.id}` : '/restaurants',
      entity: 'restaurant',
      service: AccessServiceEnum.PROJECT,
      icon: FiBox,
    },
    { name: 'Menu', path: '/menus', entity: 'menu', service: AccessServiceEnum.PROJECT, icon: FiBox },
    {
      name: 'Operational Hours',
      path: '/operational-hours',
      entity: 'operational_hours',
      service: AccessServiceEnum.PROJECT,
      icon: FiBox,
    },

    /** Add navigation item here **/
  ].filter((e) => hasAccess(e.entity, AccessOperationEnum.READ, AccessServiceEnum.PROJECT));

  return (
    <Box
      transition="3s ease"
      bgColor="base.200"
      borderColor="base.300 !important"
      borderRight="1px solid"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex pos="fixed" left="240px" right={0} h="20" alignItems="center" justifyContent="center">
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex flexDirection="column" h="full" overflowY="auto">
        {/* Mock link items */}
        <Flex alignItems="center" justifyContent="flex-start" px="8" height="80px" flex="0 0 auto">
          <LogoIcon width="24px" height="24px" fill="base.content" />
          <Box sx={{ ml: '10px' }}>
            <AppLogo />
          </Box>
        </Flex>
        <Box className="main-nav">
          {MockedLinkItems.map((link) => (
            <NavItem key={link.name} icon={link.icon} path={link.path} isActive={isActiveRoute(link.path)}>
              {link.name}
            </NavItem>
          ))}
        </Box>
        <Box mt="auto" px={8} pb={4}>
          <Link href={routes.frontend.invites.index} style={{ textDecoration: 'none' }}>
            <Button
              className="nav-userInvite"
              width="100%"
              bgColor="secondary.main"
              color="secondary.content"
              mb={3}
              borderRadius="100px"
              size="sm"
              rightIcon={<InviteMemberIcon color="secondary.content" width="17px" height="17px" />}
              boxShadow={`
              0px 3px 5px -1px #74748526,
              0px 6px 10px 0px #7474851A,
              0px 1px 18px 0px #7474850D
            `}
            >
              Invite Members
            </Button>
          </Link>
          <Button
            width="100%"
            bgColor="neutral.main"
            color="neutral.content"
            borderRadius="100px"
            size="sm"
            rightIcon={<GithubIcon color="neutral.content" width="18px" height="18px" />}
            boxShadow={`
              0px 3px 5px -1px #74748526,
              0px 6px 10px 0px #7474851A,
              0px 1px 18px 0px #7474850D
            `}
          >
            Get source code
          </Button>
        </Box>
        <Box px={8} py={4} borderTop="1px solid" borderColor="base.300">
          <Flex mb={1}>
            {sidebarFooterLinks.map(({ Icon, url }, index) => (
              <Box key={index} mr={3} cursor={'pointer'}>
                <Link href={url} style={{ textDecoration: 'none' }}>
                  <Icon fill="base.content" width="18px" height="18px" opacity="0.6" />
                </Link>
              </Box>
            ))}
          </Flex>
          <Flex justifyContent="flex-start">
            <PoweredBy />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: string | number;
  path: string;
  isActive?: boolean;
}

const NavItem = ({ icon: NavIcon, children, path, isActive, ...rest }: NavItemProps) => {
  return (
    <Link href={path} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        px="8"
        py="3"
        my="1"
        fontSize="14px"
        lineHeight="20px"
        fontWeight={isActive ? 700 : 500}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        {...rest}
      >
        {NavIcon && (
          <Box width="18px" height="18px" display="flex" alignItems="center" justifyContent="center" mr="4">
            <Icon as={NavIcon} color="neutral.main" boxSize="18px" />
          </Box>
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  isBannerVisible: boolean;
}
const MobileNav = ({ onOpen, isBannerVisible, ...rest }: MobileProps) => {
  const { session } = useSession();
  const router = useRouter();
  const { hasAccess } = useAuthorizationApi();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 8 }}
      height="20"
      alignItems="center"
      bg={'base.100'}
      borderBottomWidth="1px"
      borderBottomColor={'base.300'}
      justifyContent={{ base: 'space-between' }}
      position="sticky"
      top={{
        base: isBannerVisible ? '3rem' : 0,
        md: isBannerVisible ? '2.5rem' : 0,
      }}
      zIndex={1000}
      {...rest}
    >
      {/* <AppLogo hamburger for mobile /> */}
      <HStack>
        <Box display={{ base: 'flex', md: 'none' }}>
          <IconButton
            mr="3"
            p="0"
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            sx={{ border: 'none' }}
            icon={<HamburgerIcon color="base.content" width="21px" height="14px" />}
          />
          <AppLogo />
        </Box>

        {session?.roqUserId && (
          <Text
            display={{ base: 'none', md: 'flex' }}
            position="relative"
            fontSize="14px"
            lineHeight="20px"
            color="neutral.main"
          >{`${session.user?.roles.map((e) => inflection.humanize(e))?.join(', ')}`}</Text>
        )}
      </HStack>
      {/* <AppLogo hamburger for mobile /> */}

      {/* <AppLogo isMobile /> */}
      <HStack spacing={{ base: '0', md: '1' }}>
        <Flex alignItems={'center'}>
          <Box ml={2}>{session?.roqUserId && <UserAccountDropdown className="layout-user-profile" />}</Box>
        </Flex>
      </HStack>
    </Flex>
  );
};
