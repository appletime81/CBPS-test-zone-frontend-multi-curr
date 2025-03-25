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
import { TextField } from '@mui/material/index';

//api
import { queryLiability, dropdownmenuBillMilestone } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const LiabilityQuery = ({ setListInfo, partyList, submarineCableList, queryApi, workTitleList }) => {
    const dispatch = useDispatch();
    const [billMilestone, setBillMilestone] = useState('All'); //計帳段號
    const [partyName, setPartyName] = useState('All'); //會員名稱
    const [createDate, setCreateDate] = useState([null, null]); //建立日期
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [invoiceStatus, setInvoiceStatus] = useState({ TRUE: false, FALSE: false }); //處理狀態
    const [bmStoneList, setBmStoneList] = useState([]); //計帳段號下拉選單(需要選擇海纜名稱或海纜作業才能出現)

    const initQuery = () => {
        setBillMilestone('All');
        setPartyName('All');
        setCreateDate([null, null]);
        setSubmarineCable('All');
        setWorkTitle('All');
        setInvoiceStatus({ TRUE: false, FALSE: false });
    };

    const liabilityQuery = async () => {
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

    const handleChange = (event) => {
        setInvoiceStatus({ ...invoiceStatus, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
        let tmpObject = {};
        if (submarineCable !== '' && submarineCable !== 'All') {
            tmpObject.SubmarineCable = submarineCable;
        }
        if (workTitle !== '' && workTitle !== 'All') {
            tmpObject.WorkTitle = workTitle;
        }
        console.log('tmpObject=>>', tmpObject);
        fetch(dropdownmenuBillMilestone, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
            },
            body: JSON.stringify(tmpObject)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('data抓取成功=>>', data);
                if (Array.isArray(data)) {
                    setBmStoneList(data);
                }
            })
            .catch(() => {
                setBmStoneList([]);
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                        }
                    })
                );
            });
        // }
    }, [submarineCable, workTitle]);

    return (
        <MainCard title="Liability條件查詢" sx={{ width: '100%' }}>
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
                        <Select value={submarineCable} onChange={(e) => setSubmarineCable(e.target.value)}>
                            <MenuItem value="All">All</MenuItem>
                            {submarineCableList.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
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
                <Grid item xs={2} sm={2} md={1} lg={1} xl={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        建立日期：
                    </Typography>
                </Grid>
                <Grid item xs={10} sm={10} md={5} lg={5} xl={5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: '起始日', end: '結束日' }}>
                        <DateRangePicker
                            inputFormat="YYYY/MM/DD"
                            value={createDate}
                            onChange={(e) => {
                                setCreateDate(e);
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
                </Grid>
                {/* row2 */}
                <Grid item xs={2} sm={2} md={1} lg={1} xl={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        計帳段號：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇計帳段號</InputLabel>
                        <Select value={billMilestone} label="計帳段號" onChange={(e) => setBillMilestone(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {bmStoneList?.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1} xl={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        會員名稱：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇會員</InputLabel>
                        <Select value={partyName} label="會員名稱" onChange={(e) => setPartyName(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {partyList.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
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
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        終止狀態：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormGroup row value={invoiceStatus}>
                        <FormControlLabel
                            control={
                                <Checkbox name={'TRUE'} onChange={handleChange} checked={invoiceStatus.TRUE} sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }} />
                            }
                            label="終止"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox name={'FALSE'} onChange={handleChange} checked={invoiceStatus.FALSE} sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }} />
                            }
                            label="未終止"
                        />
                    </FormGroup>
                </Grid>
                <Grid item md={3} lg={3} display="flex" justifyContent="end" alignItems="center">
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={liabilityQuery}>
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
    // bmStoneList: PropTypes.array,
    partyList: PropTypes.array,
    submarineCableList: PropTypes.array,
    workTitleList: PropTypes.array,
    queryApi: PropTypes.object
};

export default LiabilityQuery;
