import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { queryPaydraft, supplierNameDropDownUnique, submarineCableInfoList } from 'components/apis';

// day
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from '@mui/material/index';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// ==============================|| SAMPLE PAGE ||============================== //

const CorrespondenceQuery = ({ setListInfo, queryApi, value }) => {
    const dispatch = useDispatch();
    const [issueDate, setIssueDate] = useState(null); //發票日期
    const [supplierName, setSupplierName] = useState('All'); //供應商
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [invoiceNo, setInvoiceNo] = useState(''); //發票號碼
    const [supNmList, setSupNmList] = useState([]); //供應商下拉選單

    const initData = () => {
        setIssueDate(null);
        setSupplierName('All');
        setSubmarineCable('All');
        setWorkTitle('All');
        setInvoiceNo('');
    };

    const correspondenceQuery = () => {
        let tmpQuery =
            value === 0
                ? '/Status=TEMPORARY&PayeeType=SUPPLIER&'
                : '/Status=COMPLETE&PayeeType=SUPPLIER&';
        if (supplierName && supplierName !== 'All') {
            tmpQuery = tmpQuery + 'SupplierName=' + supplierName + '&';
        }
        if (submarineCable && submarineCable !== 'All') {
            tmpQuery = tmpQuery + 'SubmarineCable=' + submarineCable + '&';
        }
        if (invoiceNo && invoiceNo !== '' && value === 0) {
            tmpQuery = tmpQuery + 'InvoiceNo=' + invoiceNo + '&';
        }
        if (workTitle && workTitle !== 'All') {
            tmpQuery = tmpQuery + 'WorkTitle=' + workTitle + '&';
        }
        if (issueDate && value === 1) {
            tmpQuery =
                tmpQuery +
                'startIssueDate=' +
                dayjs(issueDate).format('YYYYMMDD') +
                '&' +
                'endIssueDate=' +
                dayjs(issueDate).format('YYYYMMDD') +
                '&';
        }
        tmpQuery = tmpQuery.slice(0, -1);
        tmpQuery = queryPaydraft + tmpQuery;
        console.log('tmpQuery=>>', tmpQuery);
        queryApi.current = tmpQuery;
        fetch(tmpQuery, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setListInfo(data);
                }
            })
            .catch((e) => {
                console.log('e1=>', e);
            });
    };

    useEffect(() => {
        fetch(supplierNameDropDownUnique, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
        })
            .then((res) => res.json())
            .then((data) => {
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
        fetch(submarineCableInfoList, { method: 'GET' })
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
    }, []);

    return (
        <MainCard title="函稿查詢" sx={{ width: '100%' }}>
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                {/* row1 */}
                <Grid item md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
                    >
                        發票號碼：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={invoiceNo}
                            size="small"
                            label="填寫發票號碼"
                            onChange={(e) => setInvoiceNo(e.target.value)}
                        />
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
                <Grid item md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                        }}
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
                {/* row2 */}
                {value === 1 ? (
                    <>
                        <Grid item md={1} lg={1}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                    ml: { lg: '0.5rem', xl: '1.5rem' },
                                }}
                            >
                                發文日期：
                            </Typography>
                        </Grid>
                        <Grid item md={2} lg={2}>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        inputFormat="YYYY/MM/DD"
                                        value={issueDate}
                                        onChange={(e) => {
                                            setIssueDate(e);
                                        }}
                                        renderInput={(params) => (
                                            <TextField size="small" {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            md={9}
                            lg={9}
                            display="flex"
                            justifyContent="end"
                            alignItems="center"
                        >
                            <Button
                                sx={{ mr: '0.5rem' }}
                                variant="contained"
                                onClick={correspondenceQuery}
                            >
                                查詢
                            </Button>
                            <Button variant="contained" onClick={initData}>
                                清除
                            </Button>
                        </Grid>
                    </>
                ) : (
                    <Grid
                        item
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="end"
                        alignItems="center"
                    >
                        <Button
                            sx={{ mr: '0.5rem' }}
                            variant="contained"
                            onClick={correspondenceQuery}
                        >
                            查詢
                        </Button>
                        <Button variant="contained" onClick={initData}>
                            清除
                        </Button>
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
};

CorrespondenceQuery.propTypes = {
    setListInfo: PropTypes.func,
    queryApi: PropTypes.object,
    value: PropTypes.number,
};

export default CorrespondenceQuery;
