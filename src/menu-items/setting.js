// assets
import { SettingOutlined, TagOutlined } from '@ant-design/icons';

// constant
const icons = {
    SettingOutlined,
    TagOutlined
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const Setting = {
    id: 'Data',
    title: 'setting',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'item111',
            title: '基本資料設定',
            type: 'collapse',
            url: '/Setting/Liability',
            icon: icons.SettingOutlined,
            breadcrumbs: true,
            children: [
                {
                    id: 'item111',
                    title: 'Liability管理',
                    type: 'item',
                    url: '/Setting/Liability',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                },
                {
                    id: 'item112',
                    title: '貨幣與匯率資料管理',
                    type: 'item',
                    url: '/Setting/Currency',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                },
                {
                    id: 'item113',
                    title: '聯盟相關資料管理',
                    type: 'item',
                    url: '/Setting/Data',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                },
                {
                    id: 'item115',
                    title: '內部提醒通知管理',
                    type: 'item',
                    url: '/Setting/SysNotify',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                },
                {
                    id: 'item116',
                    title: '預算費用項目管理',
                    type: 'item',
                    url: '/Setting/BudgetManage',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                }
            ]
        }
    ]
};

export default Setting;
