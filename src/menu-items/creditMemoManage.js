// assets
import { SnippetsOutlined, TagOutlined } from '@ant-design/icons';

// constant
const icons = {
    SnippetsOutlined,
    TagOutlined
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const CreditMemoManage = {
    id: 'CM',
    title: 'CreditMemoManage',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'item6',
            title: 'CreditMemo',
            type: 'collapse',
            url: '/CreditMemo/CreditMemoManage',
            icon: icons.SnippetsOutlined,
            breadcrumbs: true,
            children: [
                {
                    id: 'item61',
                    title: 'CreditMemo管理',
                    type: 'item',
                    url: '/CreditMemo/CreditMemoManage',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                }
            ]
        }
    ]
};

export default CreditMemoManage;
