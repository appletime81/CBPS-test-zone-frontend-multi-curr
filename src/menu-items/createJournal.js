// assets
import { TagOutlined, AuditOutlined } from '@ant-design/icons';

// constant
const icons = {
    AuditOutlined,
    TagOutlined,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const createJournal = {
    id: 'Invoice',
    title: 'createJournal',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'item2',
            title: '立帳管理',
            type: 'collapse',
            url: '/CreateJournal/CreateJournal',
            icon: icons.AuditOutlined,
            breadcrumbs: true,
            children: [
                {
                    id: 'item21',
                    title: '立帳作業',
                    type: 'item',
                    url: '/CreateJournal/CreateJournal',
                    icon: icons.TagOutlined,
                    breadcrumbs: true,
                },
                {
                    id: 'item22',
                    title: '立帳查詢',
                    type: 'item',
                    url: '/CreateJournal/JournalQuery',
                    icon: icons.TagOutlined,
                    breadcrumbs: true,
                },
            ],
        },
    ],
};

export default createJournal;
