// assets
import { CreditCardOutlined, TagOutlined } from '@ant-design/icons';

// constant
const icons = {
  CreditCardOutlined,
  TagOutlined,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const CreditBalanceManage = {
  id: 'CB',
  title: 'creditBalanceManage',
  caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'item5',
      title: 'CreditBalance',
      type: 'collapse',
      url: '/CreditBalance/CreditBalanceManage',
      icon: icons.CreditCardOutlined,
      breadcrumbs: true,
      children: [
        {
          id: 'item51',
          title: 'Credit Balance管理',
          type: 'item',
          url: '/CreditBalance/CreditBalanceManage',
          icon: icons.TagOutlined,
          breadcrumbs: true,
        },
        {
          id: 'item52',
          title: 'Credit Balance退費',
          type: 'item',
          url: '/CreditBalance/CreditBalanceRefund',
          icon: icons.TagOutlined,
          breadcrumbs: true,
        },
        {
          id: 'item53',
          title: '退費函稿管理',
          type: 'item',
          url: '/CreditBalance/RefundCBManager',
          icon: icons.TagOutlined,
          breadcrumbs: true,
        },
      ],
    },
  ],
};

export default CreditBalanceManage;
