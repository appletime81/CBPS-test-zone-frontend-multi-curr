import { useState } from 'react';
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

// api
import { refundView, cBRefundView } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// ==============================|| SAMPLE PAGE ||============================== //

const CreditBalanceQuery = ({ value, setListInfo, partiesList, submarineCableList, queryApi }) => {
    const dispatch = useDispatch();
    const [partyName, setPartyName] = useState('All'); //會員名稱
    const [cBType, setCBType] = useState('All'); //CB種類
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [currAmount, setCurrAmount] = useState({ TRUE: false, FALSE: false }); //剩餘金額
    const [createDate, setCreateDate] = useState([null, null]); //建立日期

    const initQuery = () => {
        setPartyName('All');
        setCBType('All');
        setSubmarineCable('All');
        setWorkTitle('All');
        setCurrAmount({ TRUE: false, FALSE: false });
        setCreateDate([null, null]);
    };

    const refundQuery = () => {
        let tmpQuery = {};
        let queryApiValue = value === 0 ? refundView : cBRefundView;
        if (partyName && partyName !== 'All') {
            // tmpQuery = tmpQuery + 'PartyName=' + partyName + '&';
            if (value === 0) {
                tmpQuery.PartyName = partyName;
            } else {
                tmpQuery.Payee = partyName;
            }
        }
        if (submarineCable && submarineCable !== 'All') {
            // tmpQuery = tmpQuery + 'SubmarineCable=' + submarineCable + '&';
            tmpQuery.SubmarineCable = submarineCable;
        }
        if (cBType && cBType !== 'All') {
            // tmpQuery = tmpQuery + 'CBType=' + cBType + '&';
            tmpQuery.CBType = cBType;
        }
        if (workTitle && workTitle !== 'All') {
            // tmpQuery = tmpQuery + 'WorkTitle=' + workTitle + '&';
            tmpQuery.WorkTitle = workTitle;
        }
        if (createDate[0] || createDate[1]) {
            tmpQuery.CreateDate = {
                start: createDate[0] ? dayjs(createDate[0]).format('YYYYMMDD') : '19110101',
                end: createDate[1]
                    ? dayjs(createDate[1]).format('YYYYMMDD')
                    : dayjs(new Date()).format('YYYYMMDD'),
            };
        }
        if (currAmount?.TRUE && !currAmount?.FALSE) {
            // tmpQuery = tmpQuery + 'CurrAmount=true&';
            tmpQuery.CurrAmount = 'true';
        }
        if (currAmount?.FALSE && !currAmount?.TRUE) {
            // tmpQuery = tmpQuery + 'CurrAmount=false&';
            tmpQuery.CurrAmount = 'false';
        }

        console.log('tmpQuery=>>', tmpQuery);
        queryApi.current = tmpQuery;
        fetch(queryApiValue, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpQuery),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('查詢成功=>>', data);
                if (Array.isArray(data)) {
                    setListInfo(data);
                } else {
                    setListInfo([]);
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
    };

    const handleChange = (event) => {
        setCurrAmount({ ...currAmount, [event.target.name]: event.target.checked });
    };

    return (
        <MainCard title="退費函稿查詢" sx={{ width: '100%' }}>
            <Grid container display="flex" alignItems="center" spacing={2}>
                {/* row1 */}
                {value === 0 ? (
                    <>
                        <Grid item sm={1} md={1} lg={1} display="flex" justifyContent="center">
                            <Typography
                                variant="h5"
                                sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}
                            >
                                會員：
                            </Typography>
                        </Grid>
                        <Grid item sm={2} md={2} lg={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>選擇會員</InputLabel>
                                <Select
                                    value={partyName}
                                    label="會員"
                                    onChange={(e) => setPartyName(e.target.value)}
                                >
                                    <MenuItem value={'All'}>All</MenuItem>
                                    {partiesList.map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm={1} md={1} lg={1} display="flex" justifyContent="center">
                            <Typography
                                variant="h5"
                                sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}
                            >
                                CB種類：
                            </Typography>
                        </Grid>
                        <Grid item sm={2} md={2} lg={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>選擇CB種類</InputLabel>
                                <Select
                                    value={cBType}
                                    label="CB種類"
                                    onChange={(e) => setCBType(e.target.value)}
                                >
                                    <MenuItem value={'All'}>All</MenuItem>
                                    <MenuItem value={'MWG'}>MWG</MenuItem>
                                    <MenuItem value={'重溢繳'}>重溢繳</MenuItem>
                                    <MenuItem value={'賠償'}>賠償</MenuItem>
                                    <MenuItem value={'賠償'}>預付</MenuItem>
                                    <MenuItem value={'其他'}>其他</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                ) : null}
                <Grid item sm={1} md={1} lg={1} display="flex" justifyContent="center">
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                        海纜名稱：
                    </Typography>
                </Grid>
                <Grid item sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜名稱</InputLabel>
                        <Select
                            value={submarineCable}
                            label="海纜名稱"
                            onChange={(e) => setSubmarineCable(e.target.value)}
                        >
                            <MenuItem value={'All'}>All</MenuItem>
                            {submarineCableList.map((i) => (
                                <MenuItem key={i.CableName} value={i.CableName}>
                                    {i.CableName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm={1} md={1} lg={1} display="flex" justifyContent="center">
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                        海纜作業：
                    </Typography>
                </Grid>
                <Grid item sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜作業</InputLabel>
                        <Select
                            value={workTitle}
                            label="海纜作業"
                            onChange={(e) => setWorkTitle(e.target.value)}
                        >
                            <MenuItem value={'All'}>All</MenuItem>
                            <MenuItem value={'Upgrade'}>Upgrade</MenuItem>
                            <MenuItem value={'Construction'}>Construction</MenuItem>
                            <MenuItem value={'O&M'}>O&M</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {value === 1 ? (
                    <>
                        <Grid item md={1} lg={1} display="flex" justifyContent="center">
                            <Typography
                                variant="h5"
                                sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}
                            >
                                會員(受款人)：
                            </Typography>
                        </Grid>
                        <Grid item md={2} lg={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>選擇會員</InputLabel>
                                <Select
                                    value={partyName}
                                    label="會員"
                                    onChange={(e) => setPartyName(e.target.value)}
                                >
                                    {partiesList.map((i) => (
                                        <MenuItem key={i} value={i}>
                                            {i}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                ) : null}
                {/* row2 */}
                {value === 0 ? (
                    <>
                        <Grid item sm={2} md={1} lg={1} display="flex" justifyContent="center">
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                    ml: { lg: '0rem', xl: '0rem' },
                                }}
                            >
                                剩餘金額：
                            </Typography>
                        </Grid>
                        <Grid item sm={2} md={2} lg={2}>
                            <FormControl size="small">
                                <FormGroup row size="small" value={currAmount}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={'TRUE'}
                                                checked={currAmount.TRUE}
                                                onChange={handleChange}
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                        fontSize: { lg: 14, xl: 20 },
                                                    },
                                                }}
                                            />
                                        }
                                        label="有"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={'FALSE'}
                                                checked={currAmount.FALSE}
                                                onChange={handleChange}
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                        fontSize: { lg: 14, xl: 20 },
                                                    },
                                                }}
                                            />
                                        }
                                        label="無"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item sm={2} md={1} lg={1} display="flex" justifyContent="center">
                            <Typography
                                variant="h5"
                                sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}
                            >
                                建立日期：
                            </Typography>
                        </Grid>
                        <Grid item sm={4} md={4} lg={4}>
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
                    </>
                ) : null}
                <Grid item md={value === 0 ? 4 : 12} display="flex" justifyContent="end">
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={refundQuery}>
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

export default CreditBalanceQuery;
