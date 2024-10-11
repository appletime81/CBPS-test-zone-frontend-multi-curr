import { useEffect, useState } from 'react';
import {
    Typography,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    FormGroup,
    Checkbox,
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// day
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from '@mui/material/index';

//api
import { getCurrencyExchangeData } from 'components/apis.jsx';
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

import PropTypes from 'prop-types';

// ==============================|| SAMPLE PAGE ||============================== //

const LiabilityQuery = ({ setListInfo, currencyListInfo, submarineCableList, queryApi }) => {
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [billYM, setBillYM] = useState(null); //出帳日期
    const [purpose, setPurpose] = useState(''); //主旨/用途
    const [code, setCode] = useState('All');
    const [toCode, setToCode] = useState('All');
    const [ifEnd, setIfEnd] = useState({ true: false, false: false }); //終止狀態
    const dispatch = useDispatch();

    const initQuery = () => {
        setSubmarineCable('All');
        setWorkTitle('All');
        setBillYM(null);
        setPurpose('');
        setCode('All');
        setToCode('All');
        setIfEnd({ true: false, false: false });
    };

    const currencyQuery = () => {
        let tmpObject = {};
        if (submarineCable && submarineCable !== 'All') {
            tmpObject.SubmarineCable = submarineCable;
        }

        if (workTitle && workTitle !== 'All') {
            tmpObject.WorkTitle = workTitle;
        }
        if (billYM) {
            tmpObject.BillYM = dayjs(billYM).format('YYYY/MM/DD');
        }
        if (purpose !== '') {
            tmpObject.Purpose = purpose;
        }
        if (code && code !== 'All') {
            tmpObject.Code = code;
        }
        if (toCode && toCode !== 'All') {
            tmpObject.Tocode = toCode;
        }
        if (ifEnd?.true && !ifEnd?.false) {
            tmpObject.ifEnd = true;
        }
        if (!ifEnd?.true && ifEnd?.false) {
            tmpObject.ifEnd = false;
        }
        queryApi.current = tmpObject;
        fetch(getCurrencyExchangeData, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpObject),
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setListInfo(data);
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'info',
                                message: '查詢成功',
                            },
                        }),
                    );
                } else {
                    setListInfo([]);
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'info',
                                message: '查無資料',
                            },
                        }),
                    );
                }
            })
            .catch((e) => console.log('e1=>', e));
    };

    const handleChange = (event) => {
        setIfEnd({ ...ifEnd, [event.target.name]: event.target.checked });
    };

    return (
        <MainCard title="貨幣與匯率條件查詢" sx={{ width: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                {/* row1 */}
                <Grid item md={1} lg={1} display="flex">
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
                <Grid item md={2} lg={2}>
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
                <Grid item md={1} lg={1} display="flex">
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
                <Grid item md={2} lg={2}>
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
                            <MenuItem value={'Upgrade'}>Upgrade</MenuItem>
                            <MenuItem value={'Construction'}>Construction</MenuItem>
                            <MenuItem value={'O&M'}>O&M</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={1} lg={1} xl={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        出帳日期：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2} xl={2}>
                    <FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                inputFormat="YYYYMM"
                                views={['year', 'month']}
                                value={billYM}
                                onChange={(e) => {
                                    setBillYM(e);
                                }}
                                renderInput={(params) => <TextField size="small" {...params} />}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                <Grid item md={1} lg={1} display="flex">
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        主旨/用途：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={purpose}
                        size="small"
                        inputProps={{ maxLength: 65 }}
                        onChange={(e) => setPurpose(e.target.value)}
                    />
                </Grid>
                <Grid item md={1} lg={1} xl={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        原始幣別：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2} xl={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>原始幣別</InputLabel>
                        <Select value={code} onChange={(e) => setCode(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {currencyListInfo.map((i) => (
                                <MenuItem key={i.Code} value={i.Code}>
                                    {i.Code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={1} lg={1} xl={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        兌換幣別：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2} xl={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>兌換幣別</InputLabel>
                        <Select value={toCode} onChange={(e) => setToCode(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {currencyListInfo.map((i) => (
                                <MenuItem key={i.Code} value={i.Code}>
                                    {i.Code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={1} lg={1}>
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
                <Grid item md={2} lg={2}>
                    {/* <FormControl> */}
                    <FormGroup row value={ifEnd}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'true'}
                                    onChange={handleChange}
                                    checked={ifEnd.true}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="終止"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'false'}
                                    onChange={handleChange}
                                    checked={ifEnd.false}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="未終止"
                        />
                    </FormGroup>
                </Grid>
                <Grid item md={3} lg={3} display="flex" justifyContent="end" alignItems="center">
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={currencyQuery}>
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
    // dataList: PropTypes.array,
    partyList: PropTypes.array,
    submarineCableList: PropTypes.array,
    workTitleList: PropTypes.array,
    queryApi: PropTypes.string,
};

export default LiabilityQuery;
