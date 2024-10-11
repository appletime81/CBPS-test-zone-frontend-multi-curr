// assets
import { BellOutlined, TagOutlined } from '@ant-design/icons';

// constant
const icons = {
    BellOutlined,
    TagOutlined
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const Notification = {
    id: 'SysNotify',
    title: 'notification',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'item9',
            title: '內部提醒通知管理',
            type: 'item',
            url: '/Notification',
            icon: icons.BellOutlined,
            breadcrumbs: true,
        }
    ]
};

export default Notification;
