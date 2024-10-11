// assets
import { PercentageOutlined } from '@ant-design/icons';

import { Box, IconButton, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const LiabilityManage = () => {
    const menu = useSelector((state) => state.menu);
    const { drawerOpen } = menu;
    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexShrink: 0, ml: drawerOpen ? 0 : 0 }}>
                <IconButton disableRipple color="secondary" sx={{ color: 'text.primary' }}>
                    <Link to="/Liability" style={{ color: '#262626', textDecoration: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PercentageOutlined />
                            {drawerOpen ? <ListItemText sx={{ flexShrink: 0, ml: 0.5 }}>Liability</ListItemText> : ''}
                        </Box>
                    </Link>
                </IconButton>
            </Box>
        </Box>
    );
};

export default LiabilityManage;
