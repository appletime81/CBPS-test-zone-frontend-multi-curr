import { Box, IconButton, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// assets
import { UploadOutlined } from '@ant-design/icons';

const UploadManage = () => {
    const menu = useSelector((state) => state.menu);
    const { drawerOpen } = menu;
    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexShrink: 0, ml: drawerOpen ? 0 : 0 }}>
                <IconButton disableRipple color="secondary" sx={{ color: 'text.primary' }}>
                    <Link to="/UploadManage" style={{ color: '#262626', textDecoration: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UploadOutlined />
                            {drawerOpen ? <ListItemText sx={{ flexShrink: 0, ml: 0.5 }}>上傳檔案管理</ListItemText> : ''}
                        </Box>
                    </Link>
                </IconButton>
            </Box>
        </Box>
    );
};

export default UploadManage;
