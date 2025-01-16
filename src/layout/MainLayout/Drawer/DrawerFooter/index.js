// project import
import SimpleBar from 'components/third-party/SimpleBar';
import Profile from './Profile';
import DrawerFooterStyled from './DrawerFooterStyled';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => (
    <DrawerFooterStyled
        sx={{
            '& .simplebar-content': {
                display: 'flex',
                flexDirection: 'column'
            },
            mb: 1
        }}
    >
        <Profile />
    </DrawerFooterStyled>
);

export default DrawerContent;
