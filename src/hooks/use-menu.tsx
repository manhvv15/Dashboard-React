import { useTranslation } from 'react-i18next';

import SvgIcon from '@/components/commons/SvgIcon';
import { LocaleNamespace } from '@/constants/enums/common';
import { ACTIONS, OBJECTS } from '@/constants/variables/common';
import ChartSquareIcon from '@/public/static/icons/chart-square.svg';
import ProxyIcon from '@/public/static/icons/proxy.svg';
import RoleIcon from '@/public/static/icons/role.svg';
import BrandingIcon from '@/public/static/icons/stars-light-sparkle.svg';
import UserIcon from '@/public/static/icons/user.svg';
import { NavigationGroupMenu } from '@/types/navigation';
import { isGrantPermission } from '@/utils/common';

export const useMenu = () => {
  const { t } = useTranslation(LocaleNamespace.Menu);

  const DASHBOARD: NavigationGroupMenu = {
    name: t('Analytics'),
    children: [
      {
        label: t('Analytics'),
        children: [],
        href: '/analytics',
        icon: <ChartSquareIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.ANALYTICS, ACTIONS.VIEW),
      },
    ],
  };
  const CUSTOMER: NavigationGroupMenu = {
    name: t('customers'),
    children: [
      {
        label: t('workspaces'),
        children: [],
        href: '/workspaces',
        icon: <ChartSquareIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.WORKSPACES, ACTIONS.VIEW),
      },
      {
        label: t('customers'),
        children: [],
        href: '/customers',
        icon: <SvgIcon icon="user-profile" />,
        isShow: isGrantPermission(OBJECTS.CUSTOMERS, ACTIONS.VIEW),
      },
      {
        label: t('customner.invoice'),
        children: [],
        href: '/customer/invoices',
        isShow: isGrantPermission(OBJECTS.INVOICES, ACTIONS.VIEW),
      },
      {
        label: t('customner.transaction'),
        children: [],
        href: '/customer/transactions',
        isShow: isGrantPermission(OBJECTS.TRANSACTIONS, ACTIONS.VIEW),
      },
      {
        label: t('customer.loyatiWallet'),
        children: [],
        href: '/customer/loyalty-wallet',
        isShow: isGrantPermission(OBJECTS.LOYALTY_WALLET, ACTIONS.VIEW),
      },
    ],
  };

  const INVIRONMENT_SETTINGS: NavigationGroupMenu = {
    name: t('environmentSettings'),
    children: [
      {
        label: t('environmentSettings.applications'),
        children: [],
        href: '/environment-settings/applications',
        icon: <ChartSquareIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.APPLICATIONS, ACTIONS.VIEW),
      },
      {
        label: t('environmentSettings.applicationGroups'),
        children: [],
        href: '/environment-settings/application-groups',
        icon: <ChartSquareIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.APPLICATION_GROUPS, ACTIONS.VIEW),
      },
      {
        label: t('environmentSettings.notification'),
        children: [],
        href: '/environment-settings/notification',
        icon: <ChartSquareIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.NOTIFICATIONS, ACTIONS.VIEW),
      },
      {
        label: t('environmentSettings.reports'),
        children: [],
        href: '/environment-settings/reports',
        icon: <ChartSquareIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.REPORTS, ACTIONS.VIEW),
      },
      {
        label: t('environmentSettings.report-groups'),
        children: [],
        href: '/environment-settings/report-groups',
        icon: <ChartSquareIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.REPORT_GROUPS, ACTIONS.VIEW),
      },
      {
        label: t('environmentSettings.branding'),
        children: [],
        href: '/environment-settings/branding',
        icon: <BrandingIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.BRANDING, ACTIONS.VIEW),
      },
      {
        label: t('loyaltySystem'),
        children: [],
        href: '/environment-settings/loyalty-system',
        icon: <ChartSquareIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.LOYALTY_SYSTEM, ACTIONS.VIEW),
      },
    ],
  };

  const USER_AND_ROLES: NavigationGroupMenu = {
    name: t('userAndRoles'),
    children: [
      {
        label: t('userAndRoles.users'),
        children: [],
        href: '/user-and-roles/users',
        icon: <SvgIcon icon="user-users" width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.USERS, ACTIONS.VIEW),
      },
      {
        label: t('groupRole'),
        children: [],
        href: '/user-and-roles/group-roles',
        icon: <SvgIcon icon="group-user" width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.GROUP_ROLE, ACTIONS.VIEW),
      },
      {
        label: t('roleApp'),
        children: [],
        href: '/user-and-roles/roles',
        icon: <SvgIcon icon="shopping-list-document-checkmark" width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.ROLES, ACTIONS.VIEW),
      },
      {
        label: t('userAndRoles.permissions'),
        children: [],
        href: '/user-and-roles/permissions',
        icon: <SvgIcon icon="shopping-list-document-checkmark" width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.PERMISSIONS, ACTIONS.VIEW),
      },
    ],
  };

  const CONFIGURATION: NavigationGroupMenu = {
    name: t('configuration'),
    children: [
      {
        label: t('plans'),
        children: [],
        href: '/configuration/plans',
        icon: <SvgIcon icon="group-user" width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.PLANS, ACTIONS.VIEW),
      },
      {
        label: t('serviceModels'),
        children: [],
        href: '/configuration/service-models',
        icon: <UserIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.SERVICE_MODELS, ACTIONS.VIEW),
      },
      {
        label: t('pricingModels'),
        children: [],
        href: '/configuration/pricing-models',
        icon: <RoleIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.PRICING_MODEL, ACTIONS.VIEW),
      },
      {
        label: t('personalizePlans'),
        children: [],
        href: '/configuration/personal-plans',
        icon: <RoleIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.PERSONALIZE_PLANS, ACTIONS.VIEW),
      },
      {
        label: t('paymentMethods'),
        children: [],
        href: '/configuration/payment-methods',
        icon: <ChartSquareIcon width={24} height={24} />,
        isShow: isGrantPermission(OBJECTS.PAYMENT_METHODS, ACTIONS.VIEW),
      },
      {
        label: t('configuration.ship4p.carrier'),
        href: '/configuration/ship4p-carrier-system',
        icon: <SvgIcon icon="carrier" width={24} height={24} />,
        children: [
          {
            label: t('configuration.carrier.system'),
            href: '/configuration/ship4p-carrier-system',
            isShow: isGrantPermission(OBJECTS.SHIP4P_CARRIER_SYSTEM, ACTIONS.VIEW),
            exact: true,
          },
          {
            label: t('configuration.tag.recoment'),
            href: '/configuration/ship4p-carrier-system/tag-recomment',
            isShow: isGrantPermission(OBJECTS.MANAGE_TAG, ACTIONS.VIEW),
          },
          {
            label: t('configuration.recoment'),
            href: '/configuration/ship4p-carrier-system/recomment',
            isShow: isGrantPermission(OBJECTS.MANAGE_RECOMMENDS, ACTIONS.VIEW),
          },
        ],
        isShow:
          isGrantPermission(OBJECTS.SHIP4P_CARRIER_SYSTEM, ACTIONS.VIEW) ||
          isGrantPermission(OBJECTS.MANAGE_TAG, ACTIONS.VIEW) ||
          isGrantPermission(OBJECTS.MANAGE_RECOMMENDS, ACTIONS.VIEW),
      },
      {
        label: t('configuration.proxyAndSettings'),
        icon: <ProxyIcon width={24} height={24} />,
        children: [
          {
            label: t('configuration.proxyAndSettings.manageProxy'),
            href: '/configuration/proxy/manage-proxy',
            isShow: isGrantPermission(OBJECTS.MANAGE_PROXY, ACTIONS.VIEW),
          },
          {
            label: t('configuration.proxyAndSettings.proxyConfiguration'),
            href: '/configuration/proxy/proxy-configuration',
            isShow: isGrantPermission(OBJECTS.PROXY_CONFIGURATION, ACTIONS.VIEW),
          },
        ],
        isShow:
          isGrantPermission(OBJECTS.MANAGE_PROXY, ACTIONS.VIEW) ||
          isGrantPermission(OBJECTS.PROXY_CONFIGURATION, ACTIONS.VIEW),
      },
      {
        label: t('configuration.bidAndOffer'),
        icon: <ProxyIcon width={24} height={24} />,
        children: [
          {
            label: t('configuration.bidAndOffer.manageBid.bidding'),
            href: '/configuration/bid-and-offer/manage-bid/bidding',
            isShow: true,
          },
          {
            label: t('configuration.bidAndOffer.manageBid.won'),
            href: '/configuration/bid-and-offer/manage-bid/won',
            isShow: true,
          },
          {
            label: t('configuration.bidAndOffer.manageBid.lose'),
            href: '/configuration/bid-and-offer/manage-bid/lose',
            isShow: true,
          },
          {
            label: t('configuration.bidAndOffer.manageBid.bidHistory'),
            href: '/configuration/bid-and-offer/manage-bid/bid-history',
            isShow: true,
          },
          {
            label: t('configuration.bidAndOffer.manageSniperBid'),
            href: '/configuration/bid-and-offer/manage-sniper-bid',
            isShow: true,
          },
          {
            label: t('configuration.bidAndOffer.setting.manageNick'),
            href: '/configuration/bid-and-offer/setting/manage-nick',
            isShow: true,
          },
          {
            label: t('configuration.bidAndOffer.setting.bidConfig'),
            href: '/configuration/bid-and-offer/setting/bid-config',
            isShow: true,
          },
        ],
        isShow: isGrantPermission(OBJECTS.MANAGE_BID, ACTIONS.VIEW),
      },
    ],
  };

  const menu = [
    { ...DASHBOARD, children: DASHBOARD.children.filter((el) => el.isShow) },
    { ...CUSTOMER, children: CUSTOMER.children.filter((el) => el.isShow) },
    { ...INVIRONMENT_SETTINGS, children: INVIRONMENT_SETTINGS.children.filter((el) => el.isShow) },
    { ...USER_AND_ROLES, children: USER_AND_ROLES.children.filter((el) => el.isShow) },
    { ...CONFIGURATION, children: CONFIGURATION.children.filter((el) => el.isShow) },
  ];

  return menu.filter((item) => item.children.length > 0);
};
