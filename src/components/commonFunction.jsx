import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 數字格式化
export const handleNumber = (value) => {
    if (value || value === '' || value === '0') {
        const tmpValue = value?.toString().replaceAll(',', '');
        const parts = tmpValue.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    } else {
        return '0';
    }
};

export const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export const CustomQueryTypography = ({ children }) => (
    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
        {children}
    </Typography>
);

export const CustomAddTypography = ({ children }) => (
    <Typography variant="h5" sx={{ fontSize: { lg: '0.85rem', xl: '0.95rem' }, ml: { lg: '0.5rem', xl: '3rem' } }}>
        {children}
    </Typography>
);

export const CustomSelect = ({ label, value, onChange, options, disabled }) => (
    <FormControl fullWidth size="small" disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select value={value} label={label} onChange={onChange}>
            {options.map((item) => (
                <MenuItem key={item} value={item}>
                    {item}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);
