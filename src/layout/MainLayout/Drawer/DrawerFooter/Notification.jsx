import { Box, IconButton, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// assets
import { BellOutlined } from '@ant-design/icons';

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
    const menu = useSelector((state) => state.menu);
    const { drawerOpen } = menu;
    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexShrink: 0, ml: drawerOpen ? 0 : 0 }}>
                <IconButton disableRipple color="secondary" sx={{ color: 'text.primary' }}>
                    <Link to="/Notification" style={{ color: '#262626', textDecoration: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BellOutlined />
                            {drawerOpen ? <ListItemText sx={{ flexShrink: 0, ml: 0.5 }}>內部提醒通知管理</ListItemText> : ''}
                        </Box>
                    </Link>
                </IconButton>
            </Box>
        </Box>
    );
};

export default Notification;
