import { useEffect, useState } from 'react';
import { Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem, Radio, FormGroup, RadioGroup, FormControlLabel, Checkbox } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// day
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material/index';
import dayjs from 'dayjs';

// api
import { searchInvoiceWKMasterIsBilled, supplierNameDropDownUnique, submarineCableInfoList, dropdownmenuBillMilestone, getWorkTitle } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// ==============================|| SAMPLE PAGE ||============================== //

const ResearchBillQuery = ({ setListInfo, queryApi }) => {
    const dispatch = useDispatch();
    const [supplierName, setSupplierName] = useState('All'); //供應商
    const [submarineCable, setSubmarineCable] = useState('All'); //海纜名稱
    const [workTitle, setWorkTitle] = useState('All'); //海纜作業
    const [invoiceNo, setInvoiceNo] = useState(''); //發票號碼
    const [billMilestone, setBillMilestone] = useState('All'); // 計帳段號
    const [isIssueDate, setIsIssueDate] = useState(''); //是否為發票日期
    const [issueDate, setIssueDate] = useState(null); //發票日期
    const [supNmList, setSupNmList] = useState([]); //供應商下拉選單
    const [submarineCableList, setSubmarineCableList] = useState([]); //海纜名稱下拉選單
    const [bmsList, setBmsList] = useState([]); //計帳段號下拉選單
    const [workTitleList, setWorkTitleList] = useState([]); //海纜作業下拉選單
    const [invoiceStatus, setInvoiceStatus] = useState({
        BILLED: false,
        PAYING: false,
        TEMPORARY: false,
        VALIDATED: false
    }); //處理狀態

    const initQuery = () => {
        setIssueDate([null, null]);
        setSupplierName('All');
        setSubmarineCable('All');
        setWorkTitle('All');
        setInvoiceStatus({ BILLED: false, PAYING: false, TEMPORARY: false, VALIDATED: false });
        setBillMilestone('All');
        setInvoiceNo('');
        setIsIssueDate('');
    };

    const journalQuery = () => {
        // let tmpQuery = '/';
        let tmpObject = {};
        if (supplierName && supplierName !== 'All') {
            tmpObject.SupplierName = supplierName;
        }
        if (submarineCable && submarineCable !== 'All') {
            tmpObject.SubmarineCable = submarineCable;
        }
        if (workTitle && workTitle !== 'All') {
            tmpObject.WorkTitle = workTitle;
        }
        if (invoiceNo && invoiceNo !== '') {
            tmpObject.InvoiceNo = invoiceNo;
        }
        if (billMilestone && billMilestone !== 'All') {
            tmpObject.BillMilestone = billMilestone;
        }
        if (isIssueDate === 'true') {
            tmpObject.IssueDate = dayjs(issueDate).format('YYYYMMDD');
        }
        if (isIssueDate === 'false') {
            tmpObject.DueDate = dayjs(issueDate).format('YYYYMMDD');
        }
        if (
            !(invoiceStatus?.TEMPORARY && invoiceStatus?.VALIDATED && invoiceStatus?.BILLED && invoiceStatus?.PAYING) &&
            (invoiceStatus?.TEMPORARY || invoiceStatus?.VALIDATED || invoiceStatus?.BILLED || invoiceStatus?.PAYING)
        ) {
            let tmpStatus = [];
            if (invoiceStatus?.TEMPORARY) {
                // tmpStatus = tmpStatus + 'Status=TEMPORARY&';
                tmpStatus.push('TEMPORARY');
            }
            if (invoiceStatus?.VALIDATED) {
                // tmpStatus = tmpStatus + 'Status=VALIDATED&';
                tmpStatus.push('VALIDATED');
            }
            if (invoiceStatus?.BILLED) {
                // tmpStatus = tmpStatus + 'Status=BILLED&';
                tmpStatus.push('BILLED');
            }
            if (invoiceStatus?.PAYING) {
                // tmpStatus = tmpStatus + 'Status=PAYING&';
                tmpStatus.push('PAYING');
            }
            tmpObject.Status = tmpStatus;
        }
        queryApi.current = tmpObject;
        console.log('tmpQuery=>>', tmpObject);
        fetch(searchInvoiceWKMasterIsBilled, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(tmpObject)
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
                            message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                        }
                    })
                );
            });
    };

    const handleChange = (event) => {
        setInvoiceStatus({ ...invoiceStatus, [event.target.name]: event.target.checked });
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
                <Grid item xs={2} sm={2} md={1} lg={1}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>供應商：</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2}>
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
                <Grid item sm={1} md={1} lg={1}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>海纜名稱：</Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
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
                <Grid item sm={1} md={1} lg={1}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>海纜作業：</Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
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

                <Grid item sm={1} md={1} lg={1}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>計帳段號：</Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
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
                <Grid item sm={1} md={1} lg={1}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>發票號碼：</Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <FormControl fullWidth size="small">
                        <TextField fullWidth variant="outlined" value={invoiceNo} size="small" label="填寫發票號碼" onChange={(e) => setInvoiceNo(e.target.value)} />
                    </FormControl>
                </Grid>
                <Grid item sm={1} md={1} lg={1}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>日期條件：</Typography>
                </Grid>
                <Grid item xs={8} sm={8} md={8} lg={8} display="flex" alignItems="center">
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
                <Grid item sm={1} md={1} lg={1}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: { lg: '0.7rem', xl: '0.88rem' } }}>處理狀態：</Typography>
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <FormGroup
                        row
                        value={invoiceStatus}
                        // onChange={(e) => setInvoiceStatus(e.target.value)}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={'TEMPORARY'}
                                    onChange={handleChange}
                                    checked={invoiceStatus.TEMPORARY}
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
                                    checked={invoiceStatus.VALIDATED}
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
                                    // checked={invoiceStatus.BILLED}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }}
                                />
                            }
                            label="已產帳單"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox name={'PAYING'} onChange={handleChange} checked={invoiceStatus.PAYING} sx={{ '& .MuiSvgIcon-root': { fontSize: { lg: 14, xl: 20 } } }} />
                            }
                            label="付款中"
                        />
                    </FormGroup>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} display="flex" justifyContent="end" alignItems="center">
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

export default ResearchBillQuery;
