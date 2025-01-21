import { useState, useEffect } from 'react';
import { Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormGroup, FormControlLabel, Radio, Box, Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { TextField } from '@mui/material/index';
// project import
import MainCard from 'components/MainCard';

// api
import { getInvoiceWKMasterInvoiceWKDetail, supplierNameDropDownUnique } from 'components/apis.jsx';
import dayjs from 'dayjs';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const InvoiceQuery = ({ setListInfo, queryApi, submarineCableList, bmsList, setAction, setPage, codeList }) => {
    const dispatch = useDispatch();
    const [issueDate, setIssueDate] = useState([null, null]); //發票日期
    const [supplierNameQuery, setSupplierNameQuery] = useState('All'); //供應商
    const [submarineCableQuery, setSubmarineCableQuery] = useState('All'); //海纜名稱
    const [supNmList, setSupNmList] = useState([]); //供應商下拉選單
    const [fromCode, setFromCode] = useState('All');
    const [toCode, setToCode] = useState('All');
    const [invoiceStatusQuery, setInvoiceStatusQuery] = useState({
        BILLED: false,
        COMPLETE: false,
        INVALID: false,
        PAYING: false,
        TEMPORARY: false,
        VALIDATED: false
    }); //處理狀態
    const [billMilestoneQuery, setBillMilestoneQuery] = useState('All'); //計帳段號
    const [invoiceNoQuery, setInvoiceNoQuery] = useState(''); //發票號碼
    const [isIssueDate, setIsIssueDate] = useState(''); //是否為發票日期

    const initQuery = () => {
        setIssueDate([null, null]);
        setSupplierNameQuery('All');
        setSubmarineCableQuery('All');
        setInvoiceStatusQuery({
            BILLED: false,
            COMPLETE: false,
            INVALID: false,
            PAYING: false,
            TEMPORARY: false,
            VALIDATED: false
        });
        setBillMilestoneQuery('All');
        setInvoiceNoQuery('');
        setIsIssueDate('');
        setFromCode('');
        setToCode('');
    };

    const handleChange = (event) => {
        setInvoiceStatusQuery({ ...invoiceStatusQuery, [event.target.name]: event.target.checked });
    };

    const invoiceQuery = () => {
        let tmpObject = {};
        if (supplierNameQuery && supplierNameQuery !== 'All') {
            tmpObject.SupplierName = supplierNameQuery;
        }
        if (submarineCableQuery && submarineCableQuery !== 'All') {
            tmpObject.SubmarineCable = submarineCableQuery;
        }
        if (invoiceNoQuery && invoiceNoQuery !== '') {
            tmpObject.InvoiceNo = invoiceNoQuery;
        }
        if (billMilestoneQuery && billMilestoneQuery !== 'All') {
            tmpObject.BillMilestone = billMilestoneQuery;
        }
        if (fromCode && fromCode !== 'All') {
            tmpObject.Code = fromCode;
        }
        if (toCode && toCode !== 'All') {
            tmpObject.ToCode = toCode;
        }
        if (isIssueDate === 'true') {
            tmpObject.IssueDate = {
                start: issueDate[0] ? dayjs(issueDate[0]).format('YYYYMMDD') : '19110101',
                end: issueDate[1] ? dayjs(issueDate[1]).format('YYYYMMDD') : dayjs(new Date()).format('YYYYMMDD')
            };
        }
        if (isIssueDate === 'false') {
            tmpObject.DueDate = {
                start: issueDate[0] ? dayjs(issueDate[0]).format('YYYYMMDD') : '19110101',
                end: issueDate[1] ? dayjs(issueDate[1]).format('YYYYMMDD') : dayjs(new Date()).format('YYYYMMDD')
            };
        }
        if (
            !(
                invoiceStatusQuery?.TEMPORARY &&
                invoiceStatusQuery?.VALIDATED &&
                invoiceStatusQuery?.BILLED &&
                invoiceStatusQuery?.PAYING &&
                invoiceStatusQuery?.COMPLETE &&
                invoiceStatusQuery?.INVALID
            ) &&
            (invoiceStatusQuery?.TEMPORARY ||
                invoiceStatusQuery?.VALIDATED ||
                invoiceStatusQuery?.BILLED ||
                invoiceStatusQuery?.PAYING ||
                invoiceStatusQuery?.COMPLETE ||
                invoiceStatusQuery?.INVALID)
        ) {
            let tmpStatus = [];
            if (invoiceStatusQuery?.TEMPORARY) {
                tmpStatus.push('TEMPORARY');
            }
            if (invoiceStatusQuery?.VALIDATED) {
                tmpStatus.push('VALIDATED');
            }
            if (invoiceStatusQuery?.BILLED) {
                tmpStatus.push('BILLED');
            }
            if (invoiceStatusQuery?.PAYING) {
                tmpStatus.push('PAYING');
            }
            if (invoiceStatusQuery?.COMPLETE) {
                tmpStatus.push('COMPLETE');
            }
            if (invoiceStatusQuery?.INVALID) {
                tmpStatus.push('INVALID');
            }
            tmpObject.Status = tmpStatus;
        }
        queryApi.current = tmpObject;
        console.log('tmpQuery=>>', tmpObject);
        fetch(getInvoiceWKMasterInvoiceWKDetail, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
            },
            body: JSON.stringify(tmpObject)
        })
            .then((res) => res.json())
            .then((data) => {
                setPage(0);
                setListInfo(data);
                setAction('');
            })
            .catch(() => {
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
    };

    useEffect(() => {
        fetch(supplierNameDropDownUnique, {
            method: 'GET',
            Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
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
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                        }
                    })
                );
            });
    }, []);

    return (
        <MainCard title="條件查詢">
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={1}>
                {/* row1 */}
                <Grid item xs={12} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        供應商：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇供應商</InputLabel>
                        <Select value={supplierNameQuery} label="發票供應商" onChange={(e) => setSupplierNameQuery(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {supNmList.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={2} md={1} lg={1}>
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
                <Grid item xs={12} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜</InputLabel>
                        <Select value={submarineCableQuery} onChange={(e) => setSubmarineCableQuery(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {submarineCableList.map((i) => (
                                <MenuItem key={i.CableName} value={i.CableName}>
                                    {i.CableName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        處理狀態：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={2} md={5} lg={5}>
                    <FormGroup row value={invoiceStatusQuery}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'TEMPORARY'}
                                    onChange={handleChange}
                                    checked={invoiceStatusQuery.TEMPORARY}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="暫存"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'VALIDATED'}
                                    onChange={handleChange}
                                    checked={invoiceStatusQuery.VALIDATED}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="待立帳"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'BILLED'}
                                    onChange={handleChange}
                                    checked={invoiceStatusQuery.BILLED}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="已立帳"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'PAYING'}
                                    onChange={handleChange}
                                    checked={invoiceStatusQuery.PAYING}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="付款中"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'COMPLETE'}
                                    onChange={handleChange}
                                    checked={invoiceStatusQuery.COMPLETE}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="已結案"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'INVALID'}
                                    onChange={handleChange}
                                    checked={invoiceStatusQuery.INVALID}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="已作廢"
                        />
                    </FormGroup>
                </Grid>
                {/* row2 */}
                <Grid item xs={12} sm={2} md={1} lg={1}>
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
                <Grid item xs={12} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇計帳段號</InputLabel>
                        <Select value={billMilestoneQuery} label="發票供應商" onChange={(e) => setBillMilestoneQuery(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {bmsList.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        發票號碼：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={2} md={2} lg={2}>
                    <TextField fullWidth variant="outlined" value={invoiceNoQuery} size="small" label="填寫發票號碼" onChange={(e) => setInvoiceNoQuery(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        原始幣別：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇原始幣別</InputLabel>
                        <Select value={fromCode} label="幣別" onChange={(e) => setFromCode(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {codeList?.map((i) => (
                                <MenuItem key={i.Code} value={i.Code}>
                                    {i.Code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={2} md={1} lg={1}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' }
                        }}
                    >
                        兌換幣別：
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇兌換幣別</InputLabel>
                        <Select value={toCode} label="幣別" onChange={(e) => setToCode(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {codeList?.map((i) => (
                                <MenuItem key={i.Code} value={i.Code}>
                                    {i.Code}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {/* row3 */}
                <Grid item xs={12} sm={9} md={9} lg={9} display="flex" alignItems="center">
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                            ml: { lg: '0.5rem', xl: '1.5rem' },
                            mr: { lg: '1rem' }
                        }}
                    >
                        日期條件及區間：
                    </Typography>
                    <FormControl>
                        <RadioGroup row value={isIssueDate} onChange={(e) => setIsIssueDate(e.target.value)}>
                            <FormControlLabel
                                value={true}
                                control={
                                    <Radio
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } }
                                        }}
                                    />
                                }
                                label="發票日期"
                            />
                            <FormControlLabel
                                value={false}
                                control={
                                    <Radio
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } }
                                        }}
                                    />
                                }
                                label="發票到期日"
                            />
                        </RadioGroup>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: '起始日', end: '結束日' }}>
                        <DateRangePicker
                            inputFormat="YYYY/MM/DD"
                            value={issueDate}
                            onChange={(e) => {
                                setIssueDate(e);
                            }}
                            renderInput={(startProps, endProps) => (
                                <>
                                    <TextField size="small" {...startProps} />
                                    <Box sx={{ mx: 1 }}> to </Box>
                                    <TextField size="small" {...endProps} />
                                </>
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item md={3} lg={3} display="flex" justifyContent="end" alignItems="center">
                    <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={invoiceQuery}>
                        查詢
                    </Button>
                    <Button sx={{ mr: '0.25rem' }} variant="contained" onClick={initQuery}>
                        清除
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
};

InvoiceQuery.propTypes = {
    setListInfo: PropTypes.func,
    queryApi: PropTypes.object,
    supNmList: PropTypes.array,
    submarineCableList: PropTypes.array,
    bmsList: PropTypes.array,
    setAction: PropTypes.func,
    setPage: PropTypes.func
};

export default InvoiceQuery;
