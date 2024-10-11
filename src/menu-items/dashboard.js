// assets
import { HomeOutlined, FolderOpenOutlined, BarChartOutlined, DollarCircleOutlined, AuditOutlined } from '@ant-design/icons';

// icons
const icons = {
    HomeOutlined,
    BarChartOutlined,
    FolderOpenOutlined,
    DollarCircleOutlined,
    AuditOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: 'Home',
            title: 'Home',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.HomeOutlined,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
