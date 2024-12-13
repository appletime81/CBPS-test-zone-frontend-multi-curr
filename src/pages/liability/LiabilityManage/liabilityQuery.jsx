import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Typography,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    FormControlLabel,
    FormGroup,
    Checkbox,
} from '@mui/material';

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

const LiabilityQuery = ({
    setListInfo,
    partyList,
    submarineCableList,
    queryApi,
    workTitleList,
}) => {
    const dispatch = useDispatch();
    const [billMilestoneQuery, setBillMilestoneQuery] = useState('All'); //計帳段號
    const [partyNameQuery, setPartyNameQuery] = useState('All'); //會員名稱
    const [createDate, setCreateDate] = useState([null, null]); //建立日期
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [invoiceStatusQuery, setInvoiceStatusQuery] = useState({ TRUE: false, FALSE: false }); //處理狀態
    const [bmStoneList, setBmStoneList] = useState([]); //計帳段號下拉選單(需要選擇海纜名稱或海纜作業才能出現)

    const initQuery = () => {
        setBillMilestoneQuery('All');
        setPartyNameQuery('All');
        setCreateDate([null, null]);
        setSubmarineCable('All');
        setWorkTitle('All');
        setInvoiceStatusQuery({ TRUE: false, FALSE: false });
    };

    const liabilityQuery = () => {
        let tmpQuery = '/';
        if (billMilestoneQuery && billMilestoneQuery !== 'All') {
            tmpQuery = tmpQuery + 'BillMilestone=' + billMilestoneQuery + '&';
        }
        if (partyNameQuery && partyNameQuery !== 'All') {
            tmpQuery = tmpQuery + 'PartyName=' + partyNameQuery + '&';
        }
        if (submarineCable && submarineCable !== 'All') {
            tmpQuery = tmpQuery + 'SubmarineCable=' + submarineCable + '&';
        }
        if (workTitle && workTitle !== 'All') {
            tmpQuery = tmpQuery + 'WorkTitle=' + workTitle + '&';
        }
        if (createDate[0] && createDate[1]) {
            tmpQuery =
                tmpQuery +
                'startCreateDate=' +
                dayjs(createDate[0]).format('YYYYMMDD') +
                '&' +
                'endCreateDate=' +
                dayjs(createDate[1]).format('YYYYMMDD') +
                '&';
        }
        if (createDate[0] && !createDate[1]) {
            tmpQuery =
                tmpQuery +
                'startCreateDate=' +
                dayjs(createDate[0]).format('YYYYMMDD') +
                '&' +
                'endCreateDate=' +
                dayjs(new Date()).format('YYYYMMDD') +
                '&';
        }
        if (!createDate[0] && createDate[1]) {
            tmpQuery =
                tmpQuery +
                'startCreateDate=' +
                '19110101' +
                '&' +
                'endCreateDate=' +
                dayjs(createDate[1]).format('YYYYMMDD') +
                '&';
        }
        if (invoiceStatusQuery?.TRUE && !invoiceStatusQuery?.FALSE) {
            tmpQuery = tmpQuery + 'End=true&';
        }
        if (invoiceStatusQuery?.FALSE && !invoiceStatusQuery?.TRUE) {
            tmpQuery = tmpQuery + 'End=false&';
        }

        if (tmpQuery.includes('&')) {
            tmpQuery = tmpQuery.slice(0, -1);
        } else {
            tmpQuery = tmpQuery + 'all';
        }

        tmpQuery = queryLiability + tmpQuery;
        queryApi.current = tmpQuery;
        fetch(tmpQuery, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('查詢liabilityQuery成功=>>', data);
                setListInfo(data);
            })
            .catch(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
                );
            });
    };

    const handleChange = (event) => {
        setInvoiceStatusQuery({ ...invoiceStatusQuery, [event.target.name]: event.target.checked });
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
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpObject),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('data抓取成功=>>', data);
                if (Array.isArray(data)) {
                    setBmStoneList(data);
                }
            })
            .catch(() => {
                dispatch(
                    setMessageStateOpen({
                        messageStateOpen: {
                            isOpen: true,
                            severity: 'error',
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡',
                        },
                    }),
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
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        海纜名稱：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel size="small" id="billMilestone">
                            選擇海纜名稱
                        </InputLabel>
                        <Select
                            size="small"
                            value={submarineCable}
                            label="填寫海纜名稱"
                            onChange={(e) => setSubmarineCable(e.target.value)}
                        >
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
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        海纜作業：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel size="small" id="billMilestone">
                            選擇海纜作業
                        </InputLabel>
                        <Select
                            size="small"
                            value={workTitle}
                            label="填寫海纜作業"
                            onChange={(e) => setWorkTitle(e.target.value)}
                        >
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
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        建立日期：
                    </Typography>
                </Grid>
                <Grid item xs={10} sm={10} md={5} lg={5} xl={5}>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        localeText={{ start: '起始日', end: '結束日' }}
                    >
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
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        計帳段號：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇計帳段號</InputLabel>
                        <Select
                            value={billMilestoneQuery}
                            label="計帳段號"
                            onChange={(e) => setBillMilestoneQuery(e.target.value)}
                        >
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
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        會員名稱：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇會員</InputLabel>
                        <Select
                            value={partyNameQuery}
                            label="會員名稱"
                            onChange={(e) => setPartyNameQuery(e.target.value)}
                        >
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
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        終止狀態：
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
                    <FormGroup row value={invoiceStatusQuery}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'TRUE'}
                                    onChange={handleChange}
                                    checked={invoiceStatusQuery.TRUE}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="終止"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'FALSE'}
                                    onChange={handleChange}
                                    checked={invoiceStatusQuery.FALSE}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
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
    queryApi: PropTypes.object,
};

export default LiabilityQuery;
