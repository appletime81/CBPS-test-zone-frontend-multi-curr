import { useEffect, useState, useRef } from 'react';
import {
    Typography,
    Grid,
    Button,
    FormControl,
    InputLabel,
    TextField,
    Select,
    Table,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    TableCell,
} from '@mui/material';

// day
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// project import
import { BootstrapDialogTitle } from 'components/commonFunction';

// table
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// api
import { getCurrencyExchangeData } from 'components/apis.jsx';

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

const ChosePurpose = ({
    isPurposeDialogOpen,
    handleDialogClose,
    submarineCable,
    workTitle,
    fromCode,
    codeList,
    currencyExgID,
    setCurrencyExgID,
    rateInfo,
}) => {
    const dispatch = useDispatch();
    const [billYM, setBillYM] = useState(null); //入帳單到期日
    const [toCode, setToCode] = useState(''); //兌換幣別代碼
    const [dataList, setDataList] = useState([]);
    const [tempCurrencyExgID, setTempCurrencyExgID] = useState(null);
    const tempSelectPurpose = useRef({});

    const initInfo = () => {
        setToCode('');
        setBillYM(null);
    };

    const handleChange = (row) => {
        setTempCurrencyExgID(row.CurrencyExgID);
        tempSelectPurpose.current = {
            Purpose: row.Purpose,
            ExgRate: row.ExgRate,
            ToCode: row.ToCode,
        };
    };

    const handleSave = () => {
        rateInfo.current = tempSelectPurpose.current;
        setCurrencyExgID(tempCurrencyExgID);
        setTempCurrencyExgID(null);
        handleDialogClose();
        initInfo();
    };

    const handleQuery = () => {
        let tmpObject = {
            SubmarineCable: submarineCable,
            WorkTitle: workTitle,
            FromCode: fromCode,
            ifEnd: false,
        };

        if (toCode !== '') {
            tmpObject.ToCode = toCode;
        }
        if (billYM) {
            tmpObject.BillYM = dayjs(billYM).format('YYYYMM');
        }
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
                if (data.length > 0) {
                    setDataList(data);
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'success',
                                message: '查詢成功',
                            },
                        }),
                    );
                } else {
                    setDataList(data);
                    dispatch(
                        setMessageStateOpen({
                            messageStateOpen: {
                                isOpen: true,
                                severity: 'success',
                                message: '查無資料',
                            },
                        }),
                    );
                }
            })
            .catch((e) => console.log('e1=>', e));
    };

    useEffect(() => {
        tempSelectPurpose.current = {};
        setDataList([]);
    }, [submarineCable, workTitle]);

    useEffect(() => {
        if (isPurposeDialogOpen) {
            setTempCurrencyExgID(currencyExgID);
        }
    }, [isPurposeDialogOpen]);

    return (
        <Dialog maxWidth="md" fullWidth open={isPurposeDialogOpen}>
            <BootstrapDialogTitle>選擇用途/主旨</BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid
                    container
                    spacing={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={2} display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="h5">帳單到期：</Typography>
                    </Grid>
                    <Grid item md={2}>
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
                    <Grid item md={2} display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="h5">兌換幣別代碼：</Typography>
                    </Grid>
                    <Grid item md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>選擇兌換幣別</InputLabel>
                            <Select
                                value={toCode}
                                label="幣別"
                                onChange={(e) => setToCode(e.target.value)}
                            >
                                {codeList.map((i) => (
                                    <MenuItem key={i.Code} value={i.Code}>
                                        {i.Code}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={4}>
                        <Button size="small" variant="contained" onClick={handleQuery}>
                            查詢
                        </Button>
                    </Grid>
                    <Grid item md={12}>
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center"></StyledTableCell>
                                        <StyledTableCell align="center">主旨/用途</StyledTableCell>
                                        <StyledTableCell align="center">匯率</StyledTableCell>
                                        <StyledTableCell align="center">備註</StyledTableCell>
                                        <StyledTableCell align="center">建立日期</StyledTableCell>
                                        <StyledTableCell align="center">編輯人員</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataList.map((row, id) => {
                                        return (
                                            <TableRow key={row.CurrencyExgID + id}>
                                                <TableCell width="5%">
                                                    <RadioGroup
                                                        row
                                                        value={tempCurrencyExgID ?? currencyExgID}
                                                        onChange={() => handleChange(row)}
                                                        sx={{ justifyContent: 'center' }}
                                                    >
                                                        <FormControlLabel
                                                            value={row.CurrencyExgID}
                                                            sx={{ display: 'contents' }}
                                                            control={
                                                                <Radio
                                                                    sx={{
                                                                        '& .MuiSvgIcon-root': {
                                                                            fontSize: {
                                                                                xl: 18,
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    </RadioGroup>
                                                </TableCell>
                                                <TableCell align="center">{row.Purpose}</TableCell>
                                                <TableCell align="center">{row.ExgRate}</TableCell>
                                                <TableCell align="center">{row.Note}</TableCell>
                                                <TableCell align="center">
                                                    {dayjs(row.CreateTime).format('YYYY/MM/DD')}
                                                </TableCell>
                                                <TableCell align="center">{row.Editor}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleSave}>
                    儲存
                </Button>
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        handleDialogClose();
                        initInfo();
                    }}
                >
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChosePurpose;
