// assets
import { SearchOutlined, TagOutlined } from '@ant-design/icons';

// constant
const icons = {
    SearchOutlined,
    TagOutlined
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const AllResearch = {
    id: 'GlobalQuery',
    title: 'allResearch',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'item7',
            title: '發票帳單全域查詢',
            type: 'collapse',
            url: '/AllResearch/ResearchBill',
            icon: icons.SearchOutlined,
            breadcrumbs: true,
            children: [
                {
                    id: 'item71',
                    title: '發票查帳單',
                    type: 'item',
                    url: '/AllResearch/ResearchBill',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                },
                {
                    id: 'item72',
                    title: '帳單查發票',
                    type: 'item',
                    url: '/AllResearch/ResearchInvoice',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                },
                {
                    id: 'item73',
                    title: '發票查立帳資訊',
                    type: 'item',
                    url: '/AllResearch/ResearchJournal',
                    icon: icons.TagOutlined,
                    breadcrumbs: true
                }
            ]
        }
    ]
};

export default AllResearch;
