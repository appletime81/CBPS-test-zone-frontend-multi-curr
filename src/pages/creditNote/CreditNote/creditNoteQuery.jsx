import { useEffect, useState } from 'react';
import {
    Typography,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// day
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { TextField } from '@mui/material/index';

// ==============================|| SAMPLE PAGE ||============================== //

const CreditBalanceQuery = ({ creditBalanceQuery }) => {
    const [issueDate, setIssueDate] = useState([null, null]); //發票日期
    return (
        <MainCard title="Credit Note查詢" sx={{ width: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                {/* row1 */}
                <Grid item xs={1} sm={1} md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
                        會員：
                    </Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇會員</InputLabel>
                        <Select
                            // value={supplierName}
                            label="會員"
                            // onChange={(e) => setSupplierName(e.target.value)}
                        >
                            <MenuItem value={'Taiwan'}>Taiwan</MenuItem>
                            <MenuItem value={'Korean'}>Korean</MenuItem>
                            <MenuItem value={'Japan'}>Japan</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
                        計帳段號：
                    </Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇CB種類</InputLabel>
                        <Select
                            // value={submarineCable}
                            label="發票供應商"
                            // onChange={(e) => setSubmarineCable(e.target.value)}
                        >
                            <MenuItem value={'計帳段號1'}>計帳段號1</MenuItem>
                            <MenuItem value={'計帳段號2'}>計帳段號2</MenuItem>
                            <MenuItem value={'計帳段號3'}>計帳段號3</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
                        海纜：
                    </Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜名稱</InputLabel>
                        <Select
                            // value={submarineCable}
                            label="海纜名稱"
                            // onChange={(e) => setSubmarineCable(e.target.value)}
                        >
                            <MenuItem value={'一段'}>一段</MenuItem>
                            <MenuItem value={'二段'}>二段</MenuItem>
                            <MenuItem value={'三段'}>三段</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {/* <Grid item xs={1} sm={1} md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
                        海纜作業：
                    </Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜作業</InputLabel>
                        <Select
                         
                            // value={submarineCable}
                            label="海纜作業"
                            onChange={(e) => setSubmarineCable(e.target.value)}
                        >
                            <MenuItem value={'一段'}>一段</MenuItem>
                            <MenuItem value={'二段'}>二段</MenuItem>
                            <MenuItem value={'三段'}>三段</MenuItem>
                        </Select>
                    </FormControl>
                </Grid> */}
                {/* row2 */}
                {/* <Grid item xs={1} sm={1} md={1} lg={1} display="flex" alignItems="center">
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0rem', xl: '0rem' } }}>
                        剩餘金額：
                    </Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1} display="flex" justifyContent="space-between">
                    <FormControl row size="small">
                        <FormGroup
                            row
                            size="small"
                            // value={isLiability}
                             
                            // onChange={(e) => setIsLiability(e.target.value)}
                        >
                            <FormControlLabel
                                value={true}
                                control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }} />}
                                label="有"
                            />
                            <FormControlLabel
                                value={false}
                                control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }} />}
                                label="無"
                            />
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} display="flex" alignItems="center">
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0rem', xl: '0rem' } }}>
                        退費紀錄：
                    </Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1} display="flex" justifyContent="space-between">
                    <FormControl row>
                        <FormGroup
                            row
                            // value={isLiability}
                             
                            // onChange={(e) => setIsLiability(e.target.value)}
                        >
                            <FormControlLabel
                                value={true}
                                control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }} />}
                                label="有"
                            />
                            <FormControlLabel
                                value={false}
                                control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }} />}
                                label="無"
                            />
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.5rem', xl: '0.88rem' }, ml: { lg: '0.5rem', xl: '1.5rem' } }}>
                        建立日期：
                    </Typography>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: '起始日', end: '結束日' }}>
                        <DateRangePicker
                            inputFormat="YYYY/MM/DD"
                            value={issueDate}
                            onChange={(e) => {
                                setIssueDate(e);
                            }}
                            renderInput={(startProps, endProps) => (
                                <>
                                    <TextField fullWidth size="small" {...startProps} />
                                    <Box sx={{ mx: 1 }}> to </Box>
                                    <TextField fullWidth size="small" {...endProps} />
                                </>
                            )}
                        />
                    </LocalizationProvider>
                </Grid> */}
                <Grid item xs={6} sm={6} md={2} lg={2} display="flex" justifyContent="end" alignItems="center">
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={CreditBalanceQuery}>
                        查詢
                    </Button>
                    <Button variant="contained">清除</Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default CreditBalanceQuery;
