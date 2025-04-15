import { useEffect, useState } from 'react';
import { Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem, Radio, FormGroup, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// day
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from '@mui/material/index';

// api
import { searchBillMasterByInvoiceWKMaster, supplierNameDropDownUnique, submarineCableInfoList, dropdownmenuBillMilestone, getWorkTitle } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// ==============================|| SAMPLE PAGE ||============================== //

const ResearchBillQuery = ({ setListInfo, setDetailInfo }) => {
    const dispatch = useDispatch();
    const [supplierName, setSupplierName] = useState('All'); //供應商
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [billMilestone, setBillMilestone] = useState('All'); // 計帳段號
    const [isIssueDate, setIsIssueDate] = useState(''); //是否為發票日期
    const [issueDate, setIssueDate] = useState(null); //發票日期
    const [invoiceNo, setInvoiceNo] = useState(''); //發票號碼
    const [supNmList, setSupNmList] = useState([]); //供應商下拉選單
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [bmsList, setBmsList] = useState([]); //計帳段號下拉選單
    const [workTitleList, setWorkTitleList] = useState([]); //海纜作業下拉選單
    const [invoiceStatusQuery, setInvoiceStatusQuery] = useState({
        BILLED: false,
        COMPLETE: false,
        INVALID: false,
        PAYING: false,
        TEMPORARY: false,
        VALIDATED: false
    }); //處理狀態

    const initQuery = () => {
        setSupplierName('All');
        setSubmarineCable('All');
        setWorkTitle('All');
        setBillMilestone('All');
        setIsIssueDate('');
        setIssueDate(null);
        setInvoiceNo('');
        setInvoiceStatusQuery({
            BILLED: false,
            COMPLETE: false,
            INVALID: false,
            PAYING: false,
            TEMPORARY: false,
            VALIDATED: false
        });
    };

    const billQuery = () => {
        let tmpQuery = {};
        if (supplierName && supplierName !== 'All') {
            tmpQuery.SupplierName = supplierName;
        }
        if (submarineCable && submarineCable !== 'All') {
            tmpQuery.SubmarineCable = submarineCable;
        }
        if (workTitle && workTitle !== 'All') {
            tmpQuery.WorkTitle = workTitle;
        }
        if (invoiceNo && invoiceNo !== '') {
            tmpQuery.InvoiceNo = invoiceNo;
        }
        if (billMilestone && billMilestone !== 'All') {
            tmpQuery.BillMilestone = billMilestone;
        }
        if (issueDate && isIssueDate === 'true') {
            tmpQuery.startIssueDate = dayjs(issueDate).format('YYYYMMDD');
            tmpQuery.endIssueDate = dayjs(issueDate).format('YYYYMMDD');
        }
        if (issueDate && isIssueDate === 'false') {
            tmpQuery.startDueDate = dayjs(issueDate).format('YYYYMMDD');
            tmpQuery.endDueDate = dayjs(issueDate).format('YYYYMMDD');
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
            tmpQuery.Status = tmpStatus;
        }
        fetch(searchBillMasterByInvoiceWKMaster, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(tmpQuery)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('查詢成功=>>', data);
                if (Array.isArray(data)) {
                    setListInfo(data);
                    setDetailInfo([]);
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
    };

    const handleChange = (event) => {
        setInvoiceStatusQuery({ ...invoiceStatusQuery, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
        fetch(supplierNameDropDownUnique, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
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
        //海纜名稱
        fetch(submarineCableInfoList, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
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
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                        }
                    })
                );
            });
        fetch(dropdownmenuBillMilestone, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setBmsList(data);
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
        fetch(getWorkTitle, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify({})
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setWorkTitleList(data);
                } else {
                    setWorkTitleList([]);
                }
            })
            .catch(() => {
                setWorkTitleList([]);
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
        <MainCard title="條件查詢" sx={{ width: '100%' }}>
            <Grid container display="flex" alignItems="center" spacing={2}>
                {/* row1 */}
                <Grid item md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                        供應商：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇供應商</InputLabel>
                        <Select value={supplierName} label="供應商" onChange={(e) => setSupplierName(e.target.value)}>
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
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                        海纜名稱：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜名稱</InputLabel>
                        <Select value={submarineCable} label="海纜名稱" onChange={(e) => setSubmarineCable(e.target.value)}>
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
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                        海纜作業：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇海纜作業</InputLabel>
                        <Select value={workTitle} label="海纜作業" onChange={(e) => setWorkTitle(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {workTitleList.map((i) => (
                                <MenuItem key={i.Title} value={i.Title}>
                                    {i.Title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                        計帳段號：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>選擇計帳段號</InputLabel>
                        <Select value={billMilestone} label="發票供應商" onChange={(e) => setBillMilestone(e.target.value)}>
                            <MenuItem value={'All'}>All</MenuItem>
                            {bmsList.map((i) => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {/* row2 */}
                <Grid item md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                        發票號碼：
                    </Typography>
                </Grid>
                <Grid item md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <TextField fullWidth variant="outlined" value={invoiceNo} size="small" label="填寫發票號碼" onChange={(e) => setInvoiceNo(e.target.value)} />
                    </FormControl>
                </Grid>
                <Grid item md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                        日期條件：
                    </Typography>
                </Grid>
                <Grid item md={8} lg={8} display="flex" alignItems="center">
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
                </Grid>
                <Grid item md={1} lg={1}>
                    <Typography variant="h5" sx={{ fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>
                        處理狀態：
                    </Typography>
                </Grid>
                <Grid item md={5} lg={5}>
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
                            label="完成付款結案"
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
                            label="作廢"
                        />
                    </FormGroup>
                </Grid>
                <Grid item md={6} lg={6} display="flex" justifyContent="end" alignItems="center">
                    <Button sx={{ mr: '0.5rem' }} variant="contained" onClick={billQuery}>
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

export default ResearchBillQuery;
