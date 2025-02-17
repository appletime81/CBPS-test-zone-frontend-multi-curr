import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem, Box, FormControlLabel, FormGroup, Checkbox } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// day
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TextField } from '@mui/material/index';

//api
import { queryLiability } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const LiabilityQuery = ({ setListInfo, submarineCableList, queryApi, workTitleList }) => {
    const dispatch = useDispatch();
    const [billMilestone, setBillMilestone] = useState('All'); //計帳段號
    const [partyName, setPartyName] = useState('All'); //會員名稱
    const [createDate, setCreateDate] = useState([null, null]); //建立日期
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [invoiceStatus, setInvoiceStatus] = useState({ TRUE: false, FALSE: false }); //處理狀態
    const [invoiceNo, setInvoiceNo] = useState(''); //發票號碼
    const [issueDate, setIssueDate] = useState(new Date()); //發票日期

    const initQuery = () => {
        setBillMilestone('All');
        setPartyName('All');
        setCreateDate([null, null]);
        setSubmarineCable('All');
        setWorkTitle('All');
        setInvoiceStatus({ TRUE: false, FALSE: false });
    };

    const budgetQuery = async () => {
        // 尚未開發
        let tmpQuery = '/';
        if (billMilestone !== 'All') tmpQuery += `BillMilestone=${billMilestone}&`;

        if (partyName !== 'All') tmpQuery += `PartyName=${partyName}&`;
        if (submarineCable !== 'All') tmpQuery += `SubmarineCable=${submarineCable}&`;
        if (workTitle !== 'All') tmpQuery += `WorkTitle=${workTitle}&`;
        if (createDate[0]) tmpQuery += `startCreateDate=${dayjs(createDate[0]).format('YYYYMMDD')}&`;
        if (createDate[1]) tmpQuery += `endCreateDate=${dayjs(createDate[1]).format('YYYYMMDD')}&`;
        if (invoiceStatus.TRUE && !invoiceStatus.FALSE) tmpQuery += 'End=true&';
        if (invoiceStatus.FALSE && !invoiceStatus.TRUE) tmpQuery += 'End=false&';
        tmpQuery = tmpQuery.endsWith('&') ? tmpQuery.slice(0, -1) : tmpQuery + 'all';
        tmpQuery = queryLiability + tmpQuery;
        queryApi.current = tmpQuery;
        try {
            const response = await fetch(tmpQuery, {
                method: 'GET',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') }
            });
            const data = await response.json();
            setListInfo(data);
        } catch {
            dispatch(setMessageStateOpen({ messageStateOpen: { isOpen: true, severity: 'error', message: '網路異常，請檢查網路連線或與系統窗口聯絡' } }));
        }
    };

    return (
        <MainCard title="預算費用條件查詢" sx={{ width: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                {/* row1 */}
                <Grid item xs={2} sm={2} md={1} lg={1} display="flex">
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        海纜名稱：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜名稱</InputLabel>
                        <Select size="small" value={submarineCable} label="填寫海纜名稱" onChange={(e) => setSubmarineCable(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {submarineCableList.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1} display="flex">
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        海纜作業：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜作業</InputLabel>
                        <Select size="small" value={workTitle} label="填寫海纜作業" onChange={(e) => setWorkTitle(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {workTitleList.map((i) => (
                                <MenuItem key={i.Title} value={i.Title}>
                                    {i.Title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0rem', xl: '1.5rem' }
                        }}
                    >
                        年份：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                inputFormat="YYYY/MM/DD"
                                value={issueDate}
                                onChange={(e) => {
                                    setIssueDate(e);
                                }}
                                renderInput={(params) => <TextField size="small" {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={6} md={3} lg={3} />
                <Grid item xs={2} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        項目序號：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <TextField fullWidth variant="outlined" value={invoiceNo} size="small" label="填寫發票號碼" onChange={(e) => setInvoiceNo(e.target.value)} />
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        項目名稱：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <TextField fullWidth variant="outlined" value={invoiceNo} size="small" label="填寫發票號碼" onChange={(e) => setInvoiceNo(e.target.value)} />
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={6} lg={6} display="flex" justifyContent="end" alignItems="center">
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={budgetQuery}>
                        查詢
                    </Button>
                    <Button variant="contained" onClick={initQuery}>
                        清除
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

LiabilityQuery.propTypes = {
    setListInfo: PropTypes.func,
    partyList: PropTypes.array,
    submarineCableList: PropTypes.array,
    workTitleList: PropTypes.array,
    queryApi: PropTypes.object
};

export default LiabilityQuery;
