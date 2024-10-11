// assets
import { SnippetsOutlined, TagOutlined } from '@ant-design/icons';

// constant
const icons = {
    SnippetsOutlined,
    TagOutlined
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const CreditNoteManage = {
    id: 'creditNoteManage',
    title: 'creditNoteManage',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'item6',
            title: 'CreditNote',
            type: 'collapse',
            url: '/CreditNote/CreditNoteManage',
            icon: icons.SnippetsOutlined,
            breadcrumbs: true,
            children: [
                {
                    id: 'item61',
                    title: 'CreditNote管理',
                    type: 'item',
                    url: '/CreditNote/CreditNoteManage',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                }
            ]
        }
    ]
};

export default CreditNoteManage;
