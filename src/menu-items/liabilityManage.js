// assets
import { PercentageOutlined, TagOutlined } from '@ant-design/icons';

// constant
const icons = {
    PercentageOutlined,
    TagOutlined
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const LiabilityManage = {
    id: 'Liability',
    title: 'liabilityManage',
    type: 'group',
    children: [
        {
            id: 'item8',
            title: 'Liability',
            type: 'item',
            url: '/Liability',
            icon: icons.PercentageOutlined,
            breadcrumbs: true,
        }
    ]
};

export default LiabilityManage;
