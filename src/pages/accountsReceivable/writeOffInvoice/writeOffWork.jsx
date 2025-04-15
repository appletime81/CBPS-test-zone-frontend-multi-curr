import { useState, useRef, useEffect } from 'react';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import MainCard from 'components/MainCard';
import NumericFormatCustom from 'components/numericFormatCustom';
import Decimal from 'decimal.js';
// material-ui
import { Typography, Button, Table, Dialog, DialogContent, Grid, Select, DialogActions, TextField, Box, MenuItem, Checkbox } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ToDeductWork from './toDeductWork';

import { saveWriteOff } from 'components/apis.jsx';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

// api
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.common.black,
        paddingTop: '0.1rem',
        paddingBottom: '0.1rem',
        overflowX: 'auto',
        minWidth: '100%'
    },
    [`&.${tableCellClasses.body}.totalAmount`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        backgroundColor: '#CFD8DC'
    }
}));

const WriteOffWork = ({ isDialogOpen, handleDialogClose, writeOffInfo, writeOffDetail, writeOffInitQuery, action, setCBWriteOff, cBWriteOff }) => {
    const dispatch = useDispatch();
    const [isDeductOpen, setIsDeductOpen] = useState(false); //檢視、折抵作業
    const [toWriteOffDetailInfo, setToWriteOffDetailInfo] = useState([]); //帳單明細檔
    const [cbToCn, setCbToCn] = useState([{}]);
    const orgFeeAmountTotal = useRef(0); //原始費用
    const dedAmountTotal = useRef(0); //折抵費用
    const wHTAmountTotal = useRef(0);
    const feeAmountTotal = useRef(0); //應繳費用
    const cbAmountTotal = useRef(0); //CB抵扣費用
    const receivedAmountTotal = useRef(0); //累計費用
    const bankFeesTotal = useRef(0); //累計手續費
    const cbData = useRef(); //CB折抵作業
    const isAll = useRef(false);

    let tmpBankFee = 0; //本次手續費
    let tmpReceiveAmount = 0; //本次實收
    let tmpTotal = 0; //本次總金額
    let tmpOverAmount = 0; //重溢繳
    let tmpShortAmount = 0; //短繳
    let tmpcbAmountTotal = 0; //CB
    let tmpChangeState = 0;

    // 本次手續費
    const changeBankFee = (bankFee, id) => {
        let tmpArray = toWriteOffDetailInfo.map((i) => i);
        tmpArray.forEach((i) => {
            if (i.BillDetailID === id) {
                let tmpBRAmount = new Decimal(i.ReceiveAmount)
                    .add(new Decimal(bankFee))
                    .add(new Decimal(i.CBWriteOffAmount) || 0)
                    .toNumber();
                i.BankFee = Number(bankFee);
                i.BRAmount = tmpBRAmount;
                i.OverAmount =
                    Number(i.ReceiveAmount) + (Number(i.CBWriteOffAmount) || 0) + Number(i.ReceivedAmount) - Number(i.FeeAmount) <= 0
                        ? 0
                        : new Decimal(i.ReceiveAmount || 0)
                              .add(new Decimal(i.CBWriteOffAmount) || 0)
                              .add(new Decimal(i.ReceivedAmount || 0))
                              .minus(new Decimal(i.FeeAmount || 0))
                              .toNumber();
                i.ShortAmount =
                    Number(i.FeeAmount) - Number(i.ReceivedAmount) - Number(i.BankFees) - tmpBRAmount <= 0
                        ? 0
                        : new Decimal(i.FeeAmount).minus(new Decimal(i.ReceivedAmount)).minus(new Decimal(i.BankFees)).minus(new Decimal(tmpBRAmount)).toNumber();
            }
        });
        setToWriteOffDetailInfo(tmpArray);
    };

    // 本次實收
    const changeReceiveAmount = (receiveAmount, id) => {
        let tmpArray = toWriteOffDetailInfo.map((i) => i);
        tmpArray.forEach((i) => {
            if (i.BillDetailID === id) {
                let tmpBRAmount = new Decimal(i.BankFee)
                    .add(new Decimal(receiveAmount))
                    .add(new Decimal(i.CBWriteOffAmount) || 0)
                    .toNumber();
                i.ReceiveAmount = Number(receiveAmount);
                i.BRAmount = tmpBRAmount;
                i.OverAmount =
                    Number(receiveAmount) + (Number(i.CBWriteOffAmount) || 0) + Number(i.ReceivedAmount) - Number(i.FeeAmount) <= 0
                        ? 0
                        : new Decimal(receiveAmount)
                              .add(new Decimal(i.CBWriteOffAmount) || 0)
                              .add(new Decimal(i.ReceivedAmount))
                              .minus(new Decimal(i.FeeAmount))
                              .toNumber();
                i.ShortAmount =
                    Number(i.FeeAmount) - Number(i.ReceivedAmount) - Number(i.BankFees) - tmpBRAmount <= 0
                        ? 0
                        : new Decimal(i.FeeAmount).minus(new Decimal(i.ReceivedAmount)).minus(new Decimal(i.BankFees)).minus(new Decimal(tmpBRAmount)).toNumber();
            }
        });
        setToWriteOffDetailInfo(tmpArray);
    };

    const changeReceiveDate = (receiveDate, id, index) => {
        let tmpArray = toWriteOffDetailInfo.map((i) => i);
        tmpArray.forEach((i) => {
            if (i.BillDetailID === id) {
                i.ReceiveDate = dayjs(receiveDate).format('YYYY/MM/DD');
            }
            if (index === 0) {
                i.ReceiveDate = dayjs(receiveDate).format('YYYY/MM/DD');
            }
        });
        setToWriteOffDetailInfo(tmpArray);
    };

    const changeNote = (note, id) => {
        let tmpArray = toWriteOffDetailInfo.map((i) => i);
        tmpArray.forEach((i) => {
            if (i.BillDetailID === id) {
                i.Note = note;
            }
        });
        setToWriteOffDetailInfo(tmpArray);
    };

    const changeState = (status, id) => {
        console.log(status, id, id === 'ALL');
        let tmpArray = toWriteOffDetailInfo.map((i) => i);
        if (id === 'changeAllState') {
            tmpArray.forEach((i) => {
                if (cbToCn[i.BillDetailID]) {
                    i.Status = status;
                    if (status === 'OK') {
                        tmpChangeState = new Decimal(i.ReceiveAmount).add(new Decimal(i.ShortAmount)).toNumber();
                        i.ReceiveAmount = tmpChangeState;
                        i.BRAmount = new Decimal(tmpChangeState).add(new Decimal(i.BankFee)).toNumber();
                        i.ShortAmount =
                            Number(i.FeeAmount) - Number(i.ReceivedAmount) - Number(i.BankFees) - tmpChangeState - Number(i.BankFee) <= 0
                                ? 0
                                : new Decimal(i.FeeAmount)
                                      .minus(new Decimal(i.ReceivedAmount))
                                      .minus(new Decimal(i.BankFees))
                                      .minus(new Decimal(tmpChangeState))
                                      .minus(new Decimal(i.BankFee))
                                      .toNumber();
                    }
                }
            });
        } else {
            tmpArray.forEach((i) => {
                if (i.BillDetailID === id) {
                    i.Status = status;
                    if (status === 'OK') {
                        console.log(22222222222);
                        tmpChangeState = new Decimal(i.ReceiveAmount).add(new Decimal(i.ShortAmount)).toNumber();
                        i.ReceiveAmount = tmpChangeState;
                        i.BRAmount = new Decimal(tmpChangeState).add(new Decimal(i.BankFee)).toNumber();
                        i.ShortAmount =
                            Number(i.FeeAmount) - Number(i.ReceivedAmount) - Number(i.BankFees) - tmpChangeState - Number(i.BankFee) <= 0
                                ? 0
                                : new Decimal(i.FeeAmount)
                                      .minus(new Decimal(i.ReceivedAmount))
                                      .minus(new Decimal(i.BankFees))
                                      .minus(new Decimal(tmpChangeState))
                                      .minus(new Decimal(i.BankFee))
                                      .toNumber();
                    }
                }
            });
        }
        setToWriteOffDetailInfo(tmpArray);
    };

    const initData = () => {
        let tmpArray = JSON.parse(JSON.stringify(writeOffDetail));
        let tmpOrgFeeAmountTotal = 0; //原始費用
        let tmpDedAmountTotal = 0; //折扣
        let tmpWHTAmountTotal = 0;
        let tmpFeeAmountTotal = 0; //應收
        let tmpReceivedAmountTotal = 0; //累計費用
        let tmpBankFeesTotal = 0; //累計手續費

        if (action === 'view') {
            tmpArray.forEach((i) => {
                i.ReceiveAmount = 0; //本次實收(暫時)
                i.BankFee = 0; //本次手續費(暫時)
                i.BRAmount = 0; //總金額(暫時)
                tmpOrgFeeAmountTotal = new Decimal(tmpOrgFeeAmountTotal).add(new Decimal(i.OrgFeeAmount || 0)).toNumber();
                tmpDedAmountTotal = new Decimal(tmpDedAmountTotal).add(new Decimal(i.DedAmount)).toNumber();
                tmpWHTAmountTotal = new Decimal(tmpWHTAmountTotal).add(new Decimal(i?.WHTAmount)).toNumber();
                tmpFeeAmountTotal = new Decimal(tmpFeeAmountTotal).add(new Decimal(i.FeeAmount)).toNumber();
                tmpReceivedAmountTotal = new Decimal(tmpReceivedAmountTotal).add(new Decimal(i.ReceivedAmount)).toNumber();
                tmpBankFeesTotal = new Decimal(tmpBankFeesTotal).add(new Decimal(i.BankFees)).toNumber();
                i.OverAmount =
                    Number(i.ReceiveAmount) + (Number(i.CBWriteOffAmount) || 0) + Number(i.ReceivedAmount) - Number(i.FeeAmount) <= 0
                        ? 0
                        : new Decimal(i.ReceiveAmount)
                              .add(new Decimal(i.CBWriteOffAmount || 0))
                              .add(new Decimal(i.ReceivedAmount))
                              .minus(new Decimal(i.FeeAmount))
                              .toNumber();
                i.ShortAmount =
                    Number(i.FeeAmount) - Number(i.ReceivedAmount) - Number(i.BankFees) - Number(i.BRAmount) - (Number(i.CBWriteOffAmount) || 0) <= 0
                        ? 0
                        : new Decimal(i.FeeAmount)
                              .minus(new Decimal(i.ReceivedAmount))
                              .minus(new Decimal(i.BankFees))
                              .minus(new Decimal(i.BRAmount))
                              .minus(new Decimal(i.CBWriteOffAmount || 0))
                              .toNumber() ?? 0;
            });
            orgFeeAmountTotal.current = tmpOrgFeeAmountTotal; //原始費用
            dedAmountTotal.current = tmpDedAmountTotal; //折扣
            wHTAmountTotal.current = tmpWHTAmountTotal; //預付稅款
            feeAmountTotal.current = tmpFeeAmountTotal; //應收
            receivedAmountTotal.current = tmpReceivedAmountTotal; //累計費用
            bankFeesTotal.current = tmpBankFeesTotal; //累計手續費
            setToWriteOffDetailInfo(tmpArray);
        } else {
            tmpArray.forEach((i) => {
                tmpOrgFeeAmountTotal = new Decimal(tmpOrgFeeAmountTotal).add(new Decimal(i.OrgFeeAmount)).toNumber();
                tmpDedAmountTotal = new Decimal(tmpDedAmountTotal).add(new Decimal(i.DedAmount)).toNumber();
                tmpWHTAmountTotal = new Decimal(tmpWHTAmountTotal).add(new Decimal(i.WHTAmount ?? 0)).toNumber();
                tmpFeeAmountTotal = new Decimal(tmpFeeAmountTotal).add(new Decimal(i.FeeAmount)).toNumber();
                tmpReceivedAmountTotal = new Decimal(tmpReceivedAmountTotal).add(new Decimal(i.ReceivedAmount)).toNumber();
                tmpBankFeesTotal = new Decimal(tmpBankFeesTotal).add(new Decimal(i.BankFees)).toNumber();
                i.OverAmount =
                    Number(i.ReceiveAmount) + (Number(i.CBWriteOffAmount) || 0) + Number(i.ReceivedAmount) - Number(i.FeeAmount) <= 0
                        ? 0
                        : new Decimal(i.ReceiveAmount)
                              .add(new Decimal(i.CBWriteOffAmount) || 0)
                              .add(new Decimal(i.ReceivedAmount))
                              .minus(new Decimal(i.FeeAmount))
                              .toNumber();
                i.ShortAmount =
                    Number(i.FeeAmount) - Number(i.ReceivedAmount) - Number(i.BankFees) - Number(i.BRAmount) - (Number(i.CBWriteOffAmount) || 0) <= 0
                        ? 0
                        : new Decimal(i.FeeAmount)
                              .minus(new Decimal(i.ReceivedAmount))
                              .minus(new Decimal(i.BankFees))
                              .minus(new Decimal(i.BRAmount))
                              .minus(new Decimal(i.CBWriteOffAmount) || 0)
                              .toNumber();

                // 20250106新增銷帳作業Default 設為正常繳款-起
                // if (i.Status === 'INCOMPLETE' && i.ReceiveAmount === 0) {
                //     i.Status = 'OK';
                //     tmpChangeState = new Decimal(i.ReceiveAmount).add(new Decimal(i.ShortAmount)).toNumber();
                //     i.ReceiveAmount = tmpChangeState;
                //     i.BRAmount = new Decimal(tmpChangeState).add(new Decimal(i.BankFee)).toNumber();
                //     i.ShortAmount =
                //         Number(i.FeeAmount) - Number(i.ReceivedAmount) - Number(i.BankFees) - tmpChangeState - Number(i.BankFee) <= 0
                //             ? 0
                //             : new Decimal(i.FeeAmount)
                //                   .minus(new Decimal(i.ReceivedAmount))
                //                   .minus(new Decimal(i.BankFees))
                //                   .minus(new Decimal(tmpChangeState))
                //                   .minus(new Decimal(i.BankFee))
                //                   .toNumber();
                // }
                // 20250106新增銷帳作業Default 設為正常繳款-終
            });
            orgFeeAmountTotal.current = tmpOrgFeeAmountTotal; //原始費用
            dedAmountTotal.current = tmpDedAmountTotal; //折扣
            wHTAmountTotal.current = tmpWHTAmountTotal; //預付稅款
            feeAmountTotal.current = tmpFeeAmountTotal; //應收
            receivedAmountTotal.current = tmpReceivedAmountTotal; //累計費用
            bankFeesTotal.current = tmpBankFeesTotal; //累計手續費
            setToWriteOffDetailInfo(tmpArray);
        }
    };

    const handleChangeCheckBox = (event) => {
        setCbToCn({ ...cbToCn, [event.target.value]: event.target.checked });
    };

    const handleChangeAll = () => {
        isAll.current = !isAll.current;
        let tmpObj = {};
        if (isAll.current) {
            toWriteOffDetailInfo.forEach((i) => {
                tmpObj[i?.BillDetailID] = true;
            });
            setCbToCn(tmpObj);
        } else {
            setCbToCn({});
        }
    };

    const handleDeductOpen = (info) => {
        cbData.current = info;
        setIsDeductOpen(true);
    };

    const handleDeductClose = () => {
        setIsDeductOpen(false);
    };

    const saveData = () => {
        toWriteOffDetailInfo.forEach((i) => {
            new Decimal(i.ReceiveAmount).minus(new Decimal(i?.CBWriteOffAmount)).toNumber();
        });
        let tmpArray = {};
        tmpArray = {
            WriteOffDetailList: toWriteOffDetailInfo
        };
        fetch(saveWriteOff, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(tmpArray)
        })
            .then((res) => res.json())
            .then(() => {
                writeOffInitQuery();
                handleClose();
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

    const handleClose = () => {
        handleDialogClose();
        setToWriteOffDetailInfo([]);
        orgFeeAmountTotal.current = 0; //原始費用
        dedAmountTotal.current = 0; //折抵費用
        feeAmountTotal.current = 0; //應繳費用
        cbAmountTotal.current = 0;
        receivedAmountTotal.current = 0; //累計費用
        setCbToCn({});
        isAll.current = false;
    };

    useEffect(() => {
        if (writeOffDetail?.length > 0 && isDialogOpen) {
            initData();
        }
    }, [isDialogOpen]);

    useEffect(() => {
        if (!isDeductOpen && toWriteOffDetailInfo.length > 0) {
            let tmpArray = JSON.parse(JSON.stringify(toWriteOffDetailInfo));
            tmpArray.forEach((i) => {
                i.BRAmount = (new Decimal(i.BankFee) || 0)
                    .add(new Decimal(i.ReceiveAmount) || 0)
                    .add(new Decimal(i.CBWriteOffAmount) || 0)
                    .toNumber();
                i.OverAmount =
                    Number(i.ReceiveAmount) + (Number(i.CBWriteOffAmount) || 0) + Number(i.ReceivedAmount) - Number(i.FeeAmount) <= 0
                        ? 0
                        : new Decimal(i.ReceiveAmount)
                              .add(new Decimal(i.CBWriteOffAmount) || 0)
                              .add(new Decimal(i.ReceivedAmount))
                              .minus(new Decimal(i.FeeAmount))
                              .toNumber();
                i.ShortAmount =
                    Number(i.FeeAmount) - Number(i.ReceivedAmount) - Number(i.BankFees) - Number(i.BRAmount) <= 0
                        ? 0
                        : new Decimal(i.FeeAmount).minus(new Decimal(i.ReceivedAmount)).minus(new Decimal(i.BankFees)).minus(new Decimal(i.BRAmount)).toNumber();
            });
            setToWriteOffDetailInfo(tmpArray);
        }
    }, [isDeductOpen]);

    return (
        <>
            <ToDeductWork
                isDeductOpen={isDeductOpen}
                handleDeductClose={handleDeductClose}
                cbData={cbData}
                writeOffInfo={writeOffInfo}
                toWriteOffDetailInfo={toWriteOffDetailInfo}
                setToWriteOffDetailInfo={setToWriteOffDetailInfo}
                setCBWriteOff={setCBWriteOff}
            />
            <Dialog maxWidth="xxl" open={isDialogOpen}>
                <BootstrapDialogTitle>{action !== 'view' ? '收款銷帳作業' : '已銷帳明細'}</BootstrapDialogTitle>
                <DialogContent>
                    <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                        <Grid item md={12} lg={12}>
                            <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                                <Grid item sm={1} md={1} lg={1}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: {
                                                lg: '0.7rem',
                                                xl: '0.88rem'
                                            },
                                            ml: {
                                                lg: '0.5rem',
                                                xl: '1.5rem'
                                            }
                                        }}
                                    >
                                        會員：
                                    </Typography>
                                </Grid>
                                <Grid item sm={2} md={2} lg={2}>
                                    <TextField value={writeOffInfo?.PartyName} fullWidth readOnly variant="outlined" size="small" />
                                </Grid>
                                <Grid item sm={1} md={1} lg={1}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: {
                                                lg: '0.7rem',
                                                xl: '0.88rem'
                                            },
                                            ml: {
                                                lg: '0.5rem',
                                                xl: '1.5rem'
                                            }
                                        }}
                                    >
                                        發票截止日期：
                                    </Typography>
                                </Grid>
                                <Grid item sm={2} md={2} lg={2}>
                                    <TextField value={dayjs(writeOffInfo?.DueDate).format('YYYY/MM/DD')} fullWidth readOnly variant="outlined" size="small" />
                                </Grid>
                                <Grid item sm={1} md={1} lg={1}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: {
                                                lg: '0.7rem',
                                                xl: '0.88rem'
                                            },
                                            ml: {
                                                lg: '0.5rem',
                                                xl: '1.5rem'
                                            }
                                        }}
                                    >
                                        海纜名稱：
                                    </Typography>
                                </Grid>
                                <Grid item sm={2} md={2} lg={2}>
                                    <TextField value={writeOffInfo?.SubmarineCable} fullWidth readOnly variant="outlined" size="small" />
                                </Grid>
                                <Grid item sm={1} md={1} lg={1}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: {
                                                lg: '0.7rem',
                                                xl: '0.88rem'
                                            },
                                            ml: {
                                                lg: '0.5rem',
                                                xl: '1.5rem'
                                            }
                                        }}
                                    >
                                        海纜作業：
                                    </Typography>
                                </Grid>
                                <Grid item sm={2} md={2} lg={2}>
                                    <TextField value={writeOffInfo?.WorkTitle} fullWidth readOnly variant="outlined" size="small" />
                                </Grid>
                                <Grid item sm={1} md={1} lg={1}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: {
                                                lg: '0.7rem',
                                                xl: '0.88rem'
                                            },
                                            ml: {
                                                lg: '0.5rem',
                                                xl: '1.5rem'
                                            }
                                        }}
                                    >
                                        勾選狀態變更：
                                    </Typography>
                                </Grid>
                                <Grid item sm={2} md={2} lg={2}>
                                    {/* <Select disabled={action === 'view'} value={row.Status} label="會員" onChange={(e) => changeState(e.target.value, row.BillDetailID)}> */}
                                    <Select fullWidth disabled={action === 'view'} onChange={(e) => changeState(e.target.value, 'changeAllState')}>
                                        <MenuItem value={'OK'}>正常繳款</MenuItem>
                                        <MenuItem value={'OVER'}>重溢繳</MenuItem>
                                        <MenuItem value={'PARTIAL'}>部分收款</MenuItem>
                                        <MenuItem value={'INCOMPLETE'}>尚未收款</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item sm={9} md={9} lg={9}></Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={12} lg={12}>
                            <Box display="flex" justifyContent="end" sx={{ fontSize: '1rem' }}>
                                幣別：{writeOffInfo.Code}
                            </Box>
                            <MainCard title="帳單明細列表">
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        maxHeight: window.screen.height * 0.5
                                    }}
                                >
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                {action === 'view' ? null : (
                                                    <StyledTableCell align="center">
                                                        <Checkbox onChange={handleChangeAll} />
                                                    </StyledTableCell>
                                                )}
                                                <StyledTableCell align="center">發票號碼</StyledTableCell>
                                                <StyledTableCell align="center">費用項目</StyledTableCell>
                                                <StyledTableCell align="center">計帳段號</StyledTableCell>
                                                <StyledTableCell align="center">原始費用</StyledTableCell>
                                                <StyledTableCell align="center">抵扣</StyledTableCell>
                                                <StyledTableCell align="center">預付稅款</StyledTableCell>
                                                <StyledTableCell align="center">應收</StyledTableCell>
                                                <StyledTableCell align="center">累計實收</StyledTableCell>
                                                <StyledTableCell align="center">累計手續費</StyledTableCell>
                                                {action === 'view' ? null : <StyledTableCell align="center">本次手續費</StyledTableCell>}
                                                {action === 'view' ? null : <StyledTableCell align="center">本次實收</StyledTableCell>}
                                                <StyledTableCell align="center">CB折抵</StyledTableCell>
                                                {action === 'view' ? null : <StyledTableCell align="center">本次總金額</StyledTableCell>}
                                                <StyledTableCell align="center">重溢繳</StyledTableCell>
                                                <StyledTableCell align="center">短繳</StyledTableCell>
                                                <StyledTableCell align="center">收款日期</StyledTableCell>
                                                <StyledTableCell align="center">摘要說明</StyledTableCell>
                                                <StyledTableCell align="center">收費狀態</StyledTableCell>
                                                {action === 'view' ? null : <StyledTableCell align="center">Action</StyledTableCell>}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {toWriteOffDetailInfo?.map((row, id) => {
                                                tmpBankFee = new Decimal(tmpBankFee).add(new Decimal(row.BankFee)).toNumber();
                                                tmpReceiveAmount = new Decimal(tmpReceiveAmount).add(new Decimal(row.ReceiveAmount)).toNumber();
                                                tmpTotal = new Decimal(tmpTotal).add(new Decimal(row.BRAmount)).toNumber(); //實收加總
                                                tmpOverAmount = new Decimal(tmpOverAmount).add(new Decimal(row.OverAmount)).toNumber(); //溢繳加總
                                                tmpShortAmount = new Decimal(tmpShortAmount).add(new Decimal(row.ShortAmount)).toNumber(); //短繳加總
                                                tmpcbAmountTotal = new Decimal(tmpcbAmountTotal).add(new Decimal(row.CBWriteOffAmount || 0)).toNumber(); //CB加總
                                                return (
                                                    <TableRow
                                                        key={id + row?.InvoiceNo + row?.FeeItem + row?.OrgFeeAmount + id}
                                                        sx={{
                                                            '&:last-child td, &:last-child th': {
                                                                border: 0
                                                            }
                                                        }}
                                                    >
                                                        {action === 'view' ? null : (
                                                            <TableCell
                                                                align="center"
                                                                sx={{
                                                                    minWidth: 75
                                                                }}
                                                            >
                                                                <Checkbox value={row?.BillDetailID} onChange={handleChangeCheckBox} checked={cbToCn[row?.BillDetailID] || false} />
                                                            </TableCell>
                                                        )}
                                                        <TableCell
                                                            align="center"
                                                            sx={{
                                                                minWidth: 75
                                                            }}
                                                        >
                                                            {row?.InvoiceNo}
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            sx={{
                                                                minWidth: 75
                                                            }}
                                                        >
                                                            {row?.FeeItem}
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            sx={{
                                                                minWidth: 75
                                                            }}
                                                        >
                                                            {row?.BillMilestone}
                                                        </TableCell>
                                                        {/* 原始費用 */}
                                                        <TableCell align="center">{handleNumber(row?.OrgFeeAmount)}</TableCell>
                                                        {/* 抵扣 */}
                                                        <TableCell align="center">{handleNumber(row?.DedAmount)}</TableCell>
                                                        {/* 預付稅款 */}
                                                        <TableCell align="center">{handleNumber(row?.WHTAmount)}</TableCell>
                                                        {/* 應收，1/23開始不需扣掉WHTAmount */}
                                                        <TableCell align="center">{handleNumber(row?.FeeAmount || 0)}</TableCell>
                                                        {/* 累計實收 */}
                                                        <TableCell align="center">{handleNumber(row?.ReceivedAmount)}</TableCell>
                                                        {/* 累計手續費 */}
                                                        <TableCell align="center">{handleNumber(row?.BankFees)}</TableCell>
                                                        {/* 本次手續費 */}
                                                        {action === 'view' ? null : (
                                                            <TableCell align="center">
                                                                <TextField
                                                                    sx={{
                                                                        minWidth: 80
                                                                    }}
                                                                    size="small"
                                                                    fullWidth
                                                                    value={row.BankFee}
                                                                    InputProps={{
                                                                        inputComponent: NumericFormatCustom
                                                                    }}
                                                                    onChange={(e) => changeBankFee(e.target.value, row.BillDetailID)}
                                                                />
                                                            </TableCell>
                                                        )}
                                                        {/* 本次實收 */}
                                                        {action === 'view' ? null : (
                                                            <TableCell align="center">
                                                                <TextField
                                                                    sx={{
                                                                        minWidth: 80
                                                                    }}
                                                                    size="small"
                                                                    value={row.ReceiveAmount}
                                                                    InputProps={{
                                                                        inputComponent: NumericFormatCustom
                                                                    }}
                                                                    onChange={(e) => {
                                                                        changeReceiveAmount(e.target.value, row.BillDetailID);
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        )}
                                                        {/* CB折抵 */}
                                                        <TableCell align="center">{handleNumber(row?.CBWriteOffAmount)}</TableCell>
                                                        {/* 本次總金額 */}
                                                        {action === 'view' ? null : <TableCell align="center">{handleNumber(row?.BRAmount)}</TableCell>}
                                                        {/* 重溢繳 */}
                                                        {/* 重溢繳 : 本次實收+CB折抵+累計實收-應繳 > 0，則顯示其金額差額 */}
                                                        <TableCell align="center">{handleNumber(row?.OverAmount)}</TableCell>
                                                        {/* 短繳 */}
                                                        {/* 短繳：應繳金額-累計實收金額-總金額(含手續費)  5/25以後 */}
                                                        <TableCell align="center">{handleNumber(row?.ShortAmount)}</TableCell>
                                                        {/* 收款日期 */}
                                                        <TableCell align="center">
                                                            {action === 'view' ? (
                                                                row.ReceiveDate
                                                            ) : (
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DesktopDatePicker
                                                                        value={row.ReceiveDate}
                                                                        onChange={(e) => {
                                                                            changeReceiveDate(e, row.BillDetailID, id);
                                                                        }}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                size="small"
                                                                                sx={{
                                                                                    minWidth: 150
                                                                                }}
                                                                                {...params}
                                                                            />
                                                                        )}
                                                                    />
                                                                </LocalizationProvider>
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {action === 'view' ? (
                                                                row.Note
                                                            ) : (
                                                                <TextField
                                                                    size="small"
                                                                    sx={{
                                                                        minWidth: 75
                                                                    }}
                                                                    value={row.Note}
                                                                    onChange={(e) => {
                                                                        changeNote(e.target.value, row.BillDetailID);
                                                                    }}
                                                                />
                                                            )}
                                                        </TableCell>
                                                        {/* 收費狀態 */}
                                                        <TableCell align="center">
                                                            <Select
                                                                disabled={action === 'view'}
                                                                value={row.Status}
                                                                label="會員"
                                                                onChange={(e) => changeState(e.target.value, row.BillDetailID)}
                                                            >
                                                                <MenuItem value={'OK'}>正常繳款</MenuItem>
                                                                <MenuItem value={'OVER'}>重溢繳</MenuItem>
                                                                <MenuItem value={'PARTIAL'}>部分收款</MenuItem>
                                                                <MenuItem value={'INCOMPLETE'}>尚未收款</MenuItem>
                                                            </Select>
                                                        </TableCell>
                                                        {action === 'view' ? null : (
                                                            <TableCell align="center">
                                                                <Box>
                                                                    <Button
                                                                        color="primary"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            fontSize: '12px'
                                                                        }}
                                                                        onClick={() => {
                                                                            handleDeductOpen(row);
                                                                        }}
                                                                    >
                                                                        CB折抵
                                                                    </Button>
                                                                </Box>
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                );
                                            })}
                                            <TableRow
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0
                                                    }
                                                }}
                                            >
                                                {action === 'view' ? null : (
                                                    <StyledTableCell className="totalAmount" align="center">
                                                        Total
                                                    </StyledTableCell>
                                                )}
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {action === 'view' ? 'Total' : null}
                                                </StyledTableCell>
                                                <StyledTableCell className="totalAmount" align="center" />
                                                <StyledTableCell className="totalAmount" align="center" />
                                                {/* 原始費用 */}
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {handleNumber(orgFeeAmountTotal.current)}
                                                </StyledTableCell>
                                                {/* 抵扣 */}
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {handleNumber(dedAmountTotal.current)}
                                                </StyledTableCell>
                                                {/* 預付稅款Total */}
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {handleNumber(wHTAmountTotal.current)}
                                                </StyledTableCell>
                                                {/* 應收Total */}
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {/* {handleNumber(new Decimal(feeAmountTotal.current).minus(new Decimal(wHTAmountTotal.current).toNumber()))} */}
                                                    {handleNumber(new Decimal(feeAmountTotal.current))}
                                                </StyledTableCell>
                                                {/* 累計實收Total */}
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {handleNumber(receivedAmountTotal.current)}
                                                </StyledTableCell>
                                                {/* 累計手續費Total */}
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {handleNumber(bankFeesTotal.current)}
                                                </StyledTableCell>
                                                {/* 本次手續費Total */}
                                                {action === 'view' ? null : (
                                                    <StyledTableCell className="totalAmount" align="center">
                                                        {handleNumber(tmpBankFee)}
                                                    </StyledTableCell>
                                                )}
                                                {/* 本次實收 */}
                                                {action === 'view' ? null : (
                                                    <StyledTableCell className="totalAmount" align="center">
                                                        {handleNumber(tmpReceiveAmount)}
                                                    </StyledTableCell>
                                                )}
                                                {/* CB折抵 */}
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {handleNumber(tmpcbAmountTotal)}
                                                </StyledTableCell>
                                                {/* 本次總金額 */}
                                                {action === 'view' ? null : (
                                                    <StyledTableCell className="totalAmount" align="center">
                                                        {handleNumber(tmpTotal)}
                                                    </StyledTableCell>
                                                )}
                                                {/* 短繳Total */}
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {handleNumber(tmpOverAmount)}
                                                </StyledTableCell>
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {handleNumber(tmpShortAmount)}
                                                </StyledTableCell>
                                                <StyledTableCell className="totalAmount" align="center"></StyledTableCell>
                                                <StyledTableCell className="totalAmount" align="center"></StyledTableCell>
                                                <StyledTableCell className="totalAmount" align="center"></StyledTableCell>
                                                {action === 'view' ? null : <StyledTableCell className="totalAmount" align="center"></StyledTableCell>}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </MainCard>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {action === 'view' ? null : (
                        <Box
                            sx={{
                                fontSize: '12px',
                                m: 1,
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'end',
                                alignItems: 'center'
                            }}
                        >
                            <Button sx={{ mr: '0.05rem' }} disabled={action === 'view'} variant="contained" onClick={saveData}>
                                暫存
                            </Button>
                        </Box>
                    )}
                    <Button sx={{ mr: '0.05rem' }} variant="contained" onClick={handleClose}>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default WriteOffWork;
