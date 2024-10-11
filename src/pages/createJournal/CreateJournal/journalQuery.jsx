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
import {
    getInvoiceWKMasterInvoiceWKDetail,
    supplierNameDropDownUnique,
    submarineCableInfoList,
    getCurrencyData,
} from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// ==============================|| SAMPLE PAGE ||============================== //

const JournalQuery = ({
    setListInfo,
    queryApi,
    invoiceStatus,
    supplierName,
    setSupplierName,
    submarineCable,
    setSubmarineCable,
    code,
    setCode,
    toCode,
    setToCode,
    issueDate,
    setIssueDate,
    initQuery,
}) => {
    const dispatch = useDispatch();
    const [supNmList, setSupNmList] = useState([]); //供應商下拉選單
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [currencyListInfo, setCurrencyListInfo] = useState([]);

    const journalQuery = () => {
        let tmpObject = {};
        if (supplierName && supplierName !== 'All') {
            tmpObject.SupplierName = supplierName;
        }
        if (submarineCable && submarineCable !== 'All') {
            tmpObject.SubmarineCable = submarineCable;
        }
        if (issueDate[0] || issueDate[1]) {
            tmpObject.CreateDate = {
                start: issueDate[0] ? dayjs(issueDate[0]).format('YYYYMMDD') : '19110101',
                end: issueDate[1]
                    ? dayjs(issueDate[1]).format('YYYYMMDD')
                    : dayjs(new Date()).format('YYYYMMDD'),
            };
        }
        if (code && code !== 'All') {
            tmpObject.Code = code;
        }
        if (toCode && toCode !== 'All') {
            tmpObject.ToCode = toCode;
        }
        if (invoiceStatus === '0' || invoiceStatus === 0) {
            tmpObject.Status = 'VALIDATED';
        } else if (invoiceStatus === '1' || invoiceStatus === 1) {
            tmpObject.Status = 'BILLED';
        } else {
            tmpObject.Status = 'INVALID';
        }
        queryApi.current = tmpObject;
        console.log('tmpQuery=>>', tmpObject);
        fetch(getInvoiceWKMasterInvoiceWKDetail, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
            },
            body: JSON.stringify(tmpObject),
        })
            .then((res) => res.json())
            .then((data) => {
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

    useEffect(() => {
        fetch(supplierNameDropDownUnique, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('data=>>', data);
                if (Array.isArray(data)) {
                    setSupNmList(data);
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
        //海纜名稱
        fetch(submarineCableInfoList, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((data) => {
                setSubmarineCableList(data);
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
        //幣別
        fetch(getCurrencyData, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('data=>>', data);
                if (Array.isArray(data)) {
                    setCurrencyListInfo(data);
                }
            })
            .catch((e) => console.log('e1=>', e));
    }, []);

    return (
        <MainCard title="發票查詢" sx={{ width: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                {/* row1 */}
                <Grid item md={1} lg={1}>
                    <Typography
                        textAlign="right"
                        variant="h5"
                        sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}
                    >
                        海纜名稱：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜</InputLabel>
                        <Select
                            value={submarineCable}
                            label="海纜"
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
                <Grid item md={1} lg={1}>
                    <Typography
                        variant="h5"
                        textAlign="right"
                        sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}
                    >
                        供應商：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇供應商</InputLabel>
                        <Select
                            value={supplierName}
                            label="供應商"
                            onChange={(e) => setSupplierName(e.target.value)}
                        >
                            <MenuItem value={'All'}>All</MenuItem>
                            {supNmList.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={1} lg={1}>
                    <Typography
                        textAlign="right"
                        variant="h5"
                        sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}
                    >
                        發票日期：
                    </Typography>
                </Grid>
                <Grid item md={5} lg={5}>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        localeText={{ start: '起始日', end: '結束日' }}
                    >
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
                </Grid>
                {/* row2 */}
                <Grid item md={1} lg={1} xl={1}>
                    <Typography
                        variant="h5"
                        textAlign="right"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
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
                        textAlign="right"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
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
                <Grid
                    item
                    md={6}
                    lg={6}
                    xl={6}
                    display="flex"
                    justifyContent="end"
                    alignItems="center"
                >
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={journalQuery}>
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

export default JournalQuery;
