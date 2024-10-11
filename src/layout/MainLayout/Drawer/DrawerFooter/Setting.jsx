import { Box, IconButton, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// assets
import { SettingOutlined } from '@ant-design/icons';

const Setting = () => {
    const menu = useSelector((state) => state.menu);
    const { drawerOpen } = menu;
    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexShrink: 0, ml: drawerOpen ? 0 : 0 }}>
                <IconButton disableRipple color="secondary" sx={{ color: 'text.primary' }}>
                    <Link to="/information" style={{ color: '#262626', textDecoration: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SettingOutlined />
                            {drawerOpen ? <ListItemText sx={{ flexShrink: 0, ml: 0.5 }}>基本資料設定</ListItemText> : ''}
                        </Box>
                    </Link>
                </IconButton>
            </Box>
        </Box>
    );
};

export default Setting;
