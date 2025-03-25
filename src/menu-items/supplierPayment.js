// assets
import { FileDoneOutlined, TagOutlined } from '@ant-design/icons';

// constant
const icons = {
    FileDoneOutlined,
    TagOutlined
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const supplierPayment = {
    id: 'Pay',
    title: 'supplierPayment',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'item41',
            title: '廠商付款處理',
            type: 'collapse',
            url: '/SupplierPayment/SupplierPayment',
            icon: icons.FileDoneOutlined,
            breadcrumbs: true,
            children: [
                {
                    id: 'item41',
                    title: '廠商付款處理',
                    type: 'item',
                    url: '/SupplierPayment/SupplierPayment',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                },
                {
                    id: 'item42',
                    title: '函稿製作',
                    type: 'item',
                    url: '/SupplierPayment/Correspondence',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                },
                {
                    id: 'item43',
                    title: '付款記錄查詢',
                    type: 'item',
                    url: '/SupplierPayment/PaymentRecord',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                }
            ]
        }
    ]
};

export default supplierPayment;
