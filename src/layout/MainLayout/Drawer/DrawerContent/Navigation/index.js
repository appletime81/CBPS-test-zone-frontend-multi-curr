// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// redux
import { useSelector } from 'react-redux';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
    const { userInfo } = useSelector((state) => state.dropdown);


    const filterItem = (item) => {
        const filterItem = item.filter((i) => userInfo[i.id]);
        return filterItem
    }
    
    const navGroups = filterItem(menuItem.items)?.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Fix - Navigation Group
                    </Typography>
                );
        }
    });

    return <Box sx={{ pt: 0, pb: 1.5 }}>{navGroups}</Box>;
};

export default Navigation;
