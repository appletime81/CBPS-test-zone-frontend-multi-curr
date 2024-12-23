import { useEffect, useRef, useState } from 'react';
import {
    Typography,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import dayjs from 'dayjs';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// autocomplete
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// table
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

// project
import { BootstrapDialogTitle } from 'components/commonFunction';

// api
import {
    addCurrencyExchangeData,
    updateCurrencyExchangeData,
    corporatesView,
} from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: theme.palette.common.gary,
        color: theme.palette.common.black,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
    },
}));

const CurrencyAdd = ({
    handleAddCurrencyClose,
    isAddCurrencyOpen,
    currencyListInfo,
    submarineCableList,
    editItem,
    currencyQuery,
    dialogAction,
    workTitleList,
}) => {
    const dispatch = useDispatch();
    const [submarineCable, setSubmarineCable] = useState('');
    const [billYM, setBillYM] = useState(null); //發票日期
    const [purpose, setPurpose] = useState('');
    const [exgRate, setExgRate] = useState(0);
    const [workTitle, setWorkTitle] = useState('');
    const [fromCode, setFromCode] = useState('');
    const [fromCName, setFromCName] = useState('');
    const [toCode, setToCode] = useState('');
    const [toCName, setToCName] = useState('');
    const [note, setNote] = useState('');
    const isDataExist = useRef(false);

    const initInfo = () => {
        setSubmarineCable('');
        setBillYM(null);
        setPurpose('');
        setExgRate(0);
        setWorkTitle('');
        setFromCode('');
        setFromCName('');
        setToCode('');
        setToCName('');
        setNote('');
        isDataExist.current = false;
    };

    const infoCheck = () => {
        if (purpose === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入主旨/用途',
                    },
                }),
            );
            return false;
        }
        if (submarineCable === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜名稱',
                    },
                }),
            );
            return false;
        }
        if (workTitle === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入海纜作業',
                    },
                }),
            );
            return false;
        }
        if (!billYM) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入出帳日期',
                    },
                }),
            );
            return false;
        }
        if (fromCode.Code === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入原始幣別',
                    },
                }),
            );
            return false;
        }
        if (toCode.Code === '') {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入兌換幣別',
                    },
                }),
            );
            return false;
        }
        if (exgRate === 0) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請輸入匯率',
                    },
                }),
            );
            return false;
        }
        console.log('isDataExist.current=>>', !isDataExist.current);
        if (!isDataExist.current) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '請先新增聯盟資料',
                    },
                }),
            );
            return false;
        }
        return true;
    };

    const addCurrencyData = () => {
        if (infoCheck()) {
            console.log('dialogAction=>>', dialogAction);
            if (dialogAction === 'Add') {
                let tmpArray = {};
                tmpArray.SubmarineCable = submarineCable;
                tmpArray.BillYM = dayjs(billYM).format('YYYYMM');
                tmpArray.Purpose = purpose;
                tmpArray.ExgRate = exgRate;
                tmpArray.WorkTitle = workTitle;
                tmpArray.FromCode = fromCode;
                tmpArray.ToCode = toCode;
                tmpArray.Note = note;
                fetch(addCurrencyExchangeData, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                    },
                    body: JSON.stringify(tmpArray),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.alert_msg) {
                            dispatch(
                                setMessageStateOpen({
                                    messageStateOpen: {
                                        isOpen: true,
                                        severity: 'error',
                                        message: data.alert_msg,
                                    },
                                }),
                            );
                        } else {
                            handleAddCurrencyClose();
                            dispatch(
                                setMessageStateOpen({
                                    messageStateOpen: {
                                        isOpen: true,
                                        severity: 'success',
                                        message: '新增成功',
                                    },
                                }),
                            );
                            initInfo();
                            currencyQuery();
                        }
                    })
                    .catch((e) => console.log('e1=>', e));
            }
        }

        if (dialogAction === 'Edit') {
            let tmpArray = {};
            tmpArray.CurrencyExgID = editItem.CurrencyExgID;
            tmpArray.SubmarineCable = submarineCable;
            tmpArray.BillYM = dayjs(billYM).format('YYYYMM');
            tmpArray.Purpose = purpose;
            tmpArray.ExgRate = exgRate;
            tmpArray.WorkTitle = workTitle;
            tmpArray.FromCode = fromCode;
            tmpArray.ToCode = toCode;
            tmpArray.Note = note;
            fetch(updateCurrencyExchangeData, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpArray),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.alert_msg) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: data.alert_msg,
                                },
                            }),
                        );
                    } else {
                        initInfo();
                        handleAddCurrencyClose();
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'success',
                                    message: '編輯成功',
                                },
                            }),
                        );
                        currencyQuery();
                    }
                })
                .catch((e) => console.log('e1=>', e));
        }
    };

    const handleFromCode = (e) => {
        setFromCode(e);
        setFromCName(currencyListInfo.filter((i) => i.Code === e)[0].CName ?? '');
    };

    const handleToCode = (e) => {
        setToCode(e);
        setToCName(currencyListInfo.filter((i) => i.Code === e)[0].CName ?? '');
    };

    useEffect(() => {
        if (submarineCable && workTitle) {
            let tmpObject = {
                SubmarineCable: submarineCable,
                WorkTitle: workTitle,
            };

            fetch(corporatesView, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? '',
                },
                body: JSON.stringify(tmpObject),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.length === 0) {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'error',
                                    message: '請先新增聯盟資料',
                                },
                            }),
                        );
                        isDataExist.current = false;
                    } else {
                        dispatch(
                            setMessageStateOpen({
                                messageStateOpen: {
                                    isOpen: true,
                                    severity: 'success',
                                    message: '已有聯盟資料，請繼續輸入其他匯率資訊',
                                },
                            }),
                        );
                        isDataExist.current = true;
                    }
                });
        }
    }, [submarineCable, workTitle]);

    useEffect(() => {
        if (editItem?.CurrencyExgID && isAddCurrencyOpen) {
            setSubmarineCable(editItem.SubmarineCable);
            setBillYM(editItem.BillYM);
            setPurpose(editItem.Purpose);
            setExgRate(editItem.ExgRate);
            setWorkTitle(editItem.WorkTitle);
            setFromCode(editItem.FromCode);
            setFromCName(editItem.FromCName);
            setToCode(editItem.ToCode);
            setToCName(editItem.ToCName);
            setNote(editItem.Note);
        }
    }, [editItem?.CurrencyExgID, isAddCurrencyOpen]);

    return (
        <Dialog maxWidth="md" fullWidth open={isAddCurrencyOpen}>
            <BootstrapDialogTitle>
                {dialogAction === 'Edit' ? '編輯貨幣與匯率資料' : '新增貨幣與匯率資料'}
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid
                    container
                    spacing={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={3} lg={3} display="flex" justifyContent="center">
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
                    <Grid item md={3} lg={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>選擇海纜</InputLabel>
                            <Select
                                value={submarineCable}
                                label="海纜"
                                onChange={(e) => setSubmarineCable(e.target.value)}
                            >
                                {submarineCableList.map((i) => (
                                    <MenuItem key={i} value={i}>
                                        {i}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} lg={3} display="flex" justifyContent="center">
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
                    <Grid item md={3} lg={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>選擇海纜作業</InputLabel>
                            <Select
                                value={workTitle}
                                label="海纜作業"
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
                    <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
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
                    <Grid item xs={3} sm={3} md={3} lg={3}>
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
                    <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
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
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={purpose}
                            size="small"
                            label="填寫主旨/用途"
                            onChange={(e) => setPurpose(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
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
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <FormControl fullWidth size="small">
                            <Select
                                value={fromCode}
                                onChange={(e) => handleFromCode(e.target.value)}
                            >
                                {currencyListInfo.map((i) => (
                                    <MenuItem key={i.Code} value={i.Code}>
                                        {i.Code}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' },
                            }}
                        >
                            原始幣別中文：
                        </Typography>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={fromCName}
                            size="small"
                            disabled
                            label="請選取左方原始幣別"
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
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
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <FormControl fullWidth size="small">
                            <Select value={toCode} onChange={(e) => handleToCode(e.target.value)}>
                                {currencyListInfo.map((i) => (
                                    <MenuItem key={i.Code} value={i.Code}>
                                        {i.Code}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' },
                            }}
                        >
                            兌換幣別中文：
                        </Typography>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={toCName}
                            size="small"
                            disabled
                            label="請選取左方兌換幣別"
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' },
                            }}
                        >
                            匯率：
                        </Typography>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={exgRate}
                            size="small"
                            label="填寫匯率"
                            onChange={(e) => setExgRate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} display="flex" justifyContent="center">
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                ml: { lg: '0.5rem', xl: '1.5rem' },
                            }}
                        >
                            備註：
                        </Typography>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={note}
                            size="small"
                            label="填寫備註"
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={addCurrencyData}>
                    儲存
                </Button>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleAddCurrencyClose();
                        initInfo();
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CurrencyAdd;
