// assets
import { UploadOutlined, TagOutlined } from '@ant-design/icons';

// constant
const icons = {
    UploadOutlined,
    TagOutlined
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const UploadManage = {
    id: 'uploadManage',
    title: 'uploadManage',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'item10',
            title: '上傳檔案管理',
            type: 'collapse',
            url: '/UploadManage',
            icon: icons.UploadOutlined,
            breadcrumbs: true,
        }
    ]
};

export default UploadManage;
