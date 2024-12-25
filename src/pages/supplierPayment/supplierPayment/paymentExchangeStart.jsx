import { useState, useRef, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import Decimal from 'decimal.js';
import MainCard from 'components/MainCard';
import NumericFormatCustom from 'components/numericFormatCustom';
import ChoseRate from './choseRate';
// material-ui
import { Typography, Button, Table, Dialog, DialogContent, Grid, DialogActions, TextField } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { paymentExchangeProcess } from 'components/apis.jsx';
import dayjs from 'dayjs';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
                // backgroundColor: theme.palette.common.gary,
                color: theme.palette.common.black,
                paddingTop: '0.2rem',
                paddingBottom: '0.2rem'
        },
        [`&.${tableCellClasses.body}`]: {
                fontSize: 14,
                paddingTop: '0.2rem',
                paddingBottom: '0.2rem'
        },
        [`&.${tableCellClasses.body}.totalAmount`]: {
                fontSize: 14,
                paddingTop: '0.2rem',
                paddingBottom: '0.2rem',
                backgroundColor: '#CFD8DC'
        }
}));

const PaymentExchangeStart = ({
        isDialogOpen,
        handleDialogClose,
        editPaymentInfo,
        actionName,
        billDetailList,
        invoiceWKMasterInfo,
        savePaymentEdit,
        queryApi,
        setListInfo,
        codeInfo
}) => {
        const dispatch = useDispatch();
        const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
        const [toPaymentDetailInfo, setToPaymentDetailInfo] = useState([]); //帳單明細檔
        // const [rate, setRate] = useState('');
        const toPaymentDetailInfoDetail = useRef({});
        const rateInfo = useRef([]); //僅提供前端畫面秀出使用者是選擇哪筆匯率資料。
        // const [currencyExgID, setCurrencyExgID] = useState(null);
        const feeAmountTotal = useRef(0); //已實收金額
        const receivedAmountTotal = useRef(0); //已實收金額
        const exgOriReceivedAmount = useRef(0); //原幣已換匯累計金額
        const toExgAmount = useRef(0); //待換匯金額
        const exgReceivedAmount = useRef(0); //換匯後已實收金額
        const exgDiffAmount = useRef(0); //換匯匯差

        const initData = () => {
                // setCurrencyExgID(null);
                rateInfo.current = [];
                feeAmountTotal.current = 0;
                receivedAmountTotal.current = 0;
                exgOriReceivedAmount.current = 0;
                toExgAmount.current = 0;
                exgReceivedAmount.current = 0;
                exgDiffAmount.current = 0;
                toPaymentDetailInfoDetail.current = [];
        };

        const handleRateDialogOpen = (info) => {
                setIsRateDialogOpen(true);
                toPaymentDetailInfoDetail.current = info;
        };

        const handleRateDialogClose = () => {
                setIsRateDialogOpen(false);
        };

        const handleTmpSaveEdit = () => {
                savePaymentEdit(editPaymentInfo);
        };

        const countTotal = (info) => {
                info.forEach((i) => {
                        feeAmountTotal.current = new Decimal(feeAmountTotal.current).add(new Decimal(i.FeeAmount));
                        receivedAmountTotal.current = new Decimal(receivedAmountTotal.current).add(new Decimal(i.ReceivedAmount));
                        exgOriReceivedAmount.current = new Decimal(exgOriReceivedAmount.current).add(new Decimal(i.ExgOriReceivedAmount));
                        toExgAmount.current = new Decimal(toExgAmount.current).add(new Decimal(i.ToExgAmount));
                        exgReceivedAmount.current = new Decimal(exgReceivedAmount.current).add(new Decimal(i.ExgReceivedAmount));
                        exgDiffAmount.current = new Decimal(exgDiffAmount.current).add(new Decimal(i.ExgDiffAmount));
                });
        };

        const sendInfo = (billDetail) => {
                if (billDetail.choseCurrencyExgID) {
                        console.log('invoiceWKMasterInfo=>>', invoiceWKMasterInfo);
                        console.log('billDetail=>>', billDetail);
                        console.log('billDetail=>>', billDetail.choseCurrencyExgID);

                        console.log(
                                'currencyExgID=>>',
                                billDetail.choseCurrencyExgID,
                                billDetail?.CurrencyExgList.find((i) => i.CurrencyExgID === billDetail.choseCurrencyExgID)
                        );
                        let currencyExg = billDetail?.CurrencyExgList.find((i) => i.CurrencyExgID === billDetail.choseCurrencyExgID);
                        fetch(paymentExchangeProcess, {
                                method: 'POST',
                                headers: {
                                        'Content-type': 'application/json',
                                        Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
                                },
                                body: JSON.stringify({
                                        InvoiceWKMaster: invoiceWKMasterInfo,
                                        BillDetail: billDetail,
                                        CurrencyExg: currencyExg
                                })
                        })
                                .then((res) => res.json())
                                .then((data) => {
                                        console.log('yessss=>>', data);
                                        const changeIndexValue = toPaymentDetailInfo.findIndex((i) => i.BillDetailID === data.BillDetailID && i.BillMasterID === data.BillMasterID);
                                        if (changeIndexValue !== -1) {
                                                toPaymentDetailInfo[changeIndexValue] = data;
                                        }
                                        dispatch(
                                                setMessageStateOpen({
                                                        messageStateOpen: {
                                                                isOpen: true,
                                                                severity: 'success',
                                                                message: '換匯成功'
                                                        }
                                                })
                                        );
                                        countTotal(toPaymentDetailInfo);
                                        fetch(queryApi, {
                                                method: 'GET',
                                                Authorization: 'Bearer' + localStorage.getItem('accessToken') ?? ''
                                        })
                                                .then((res) => res.json())
                                                .then((data) => {
                                                        console.log('data=>>', data);
                                                        if (Array.isArray(data)) {
                                                                setListInfo(data);
                                                        }
                                                        if (data.length === 0) {
                                                                dispatch(
                                                                        setMessageStateOpen({
                                                                                messageStateOpen: {
                                                                                        isOpen: true,
                                                                                        severity: 'info',
                                                                                        message: '查無資料'
                                                                                }
                                                                        })
                                                                );
                                                                setListInfo([]);
                                                        }
                                                })
                                                .catch((e) => {
                                                        console.log('e1=>', e);
                                                });
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
                } else {
                        dispatch(
                                setMessageStateOpen({
                                        messageStateOpen: {
                                                isOpen: true,
                                                severity: 'error',
                                                message: '請先填寫匯率資料'
                                        }
                                })
                        );
                }
        };

        useEffect(() => {
                if (isDialogOpen) {
                        let tmpArray = JSON.parse(JSON.stringify(billDetailList));
                        countTotal(tmpArray);
                        setToPaymentDetailInfo(tmpArray);
                }
        }, [isDialogOpen, billDetailList]);

        return (
                <>
                        <ChoseRate
                                isRateDialogOpen={isRateDialogOpen}
                                handleRateDialogClose={handleRateDialogClose}
                                toPaymentDetailInfoDetail={toPaymentDetailInfoDetail.current}
                                rateInfo={rateInfo}
                                // currencyExgID={currencyExgID}
                                // setCurrencyExgID={setCurrencyExgID}
                        />
                        <Dialog maxWidth="xxl" open={isDialogOpen}>
                                <BootstrapDialogTitle>會員收款換匯作業</BootstrapDialogTitle>
                                <DialogContent>
                                        <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                                                                <Grid item sm={2} md={2} lg={2}>
                                                                        <Typography
                                                                                variant="h5"
                                                                                align="center"
                                                                                sx={{
                                                                                        fontSize: { lg: '0.7rem', xl: '0.88rem' }
                                                                                }}
                                                                        >
                                                                                發票號碼：
                                                                        </Typography>
                                                                </Grid>
                                                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                                                        <TextField
                                                                                value={invoiceWKMasterInfo.InvoiceNo}
                                                                                fullWidth
                                                                                variant="outlined"
                                                                                size="small"
                                                                                InputProps={{
                                                                                        readyOnly: true
                                                                                }}
                                                                        />
                                                                </Grid>
                                                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                                                        <Typography
                                                                                variant="h5"
                                                                                align="center"
                                                                                sx={{
                                                                                        fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                                                                        ml: { lg: '0.5rem', xl: '1.5rem' }
                                                                                }}
                                                                        >
                                                                                發票到期日：
                                                                        </Typography>
                                                                </Grid>
                                                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                                                        <TextField
                                                                                value={dayjs(invoiceWKMasterInfo.DueDate).format('YYYY/MM/DD')}
                                                                                fullWidth
                                                                                InputProps={{
                                                                                        readyOnly: true
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                        />
                                                                </Grid>
                                                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                                                        <Typography
                                                                                variant="h5"
                                                                                align="center"
                                                                                sx={{
                                                                                        fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                                                                        ml: { lg: '0.5rem', xl: '1.5rem' }
                                                                                }}
                                                                        >
                                                                                發票匯率資料：
                                                                        </Typography>
                                                                </Grid>
                                                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                                                        <TextField
                                                                                value={invoiceWKMasterInfo.Purpose}
                                                                                fullWidth
                                                                                InputProps={{
                                                                                        readyOnly: true
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                        />
                                                                </Grid>
                                                        </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <MainCard title="帳單明細列表">
                                                                <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                                                        <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                                                                                <TableHead>
                                                                                        <TableRow>
                                                                                                <StyledTableCell align="center">帳單號碼</StyledTableCell>
                                                                                                <StyledTableCell align="center">費用項目</StyledTableCell>
                                                                                                <StyledTableCell align="center">會員</StyledTableCell>
                                                                                                <StyledTableCell align="center">應收金額</StyledTableCell>
                                                                                                <StyledTableCell align="center">已實收金額</StyledTableCell>
                                                                                                <StyledTableCell align="center">原幣已換匯累計金額</StyledTableCell>
                                                                                                <StyledTableCell align="center">待換匯金額</StyledTableCell>
                                                                                                <StyledTableCell align="center">換匯後已實收金額</StyledTableCell>
                                                                                                <StyledTableCell align="center">換匯匯差</StyledTableCell>
                                                                                                <StyledTableCell align="center">匯率資料</StyledTableCell>
                                                                                                <StyledTableCell align="center">Action</StyledTableCell>
                                                                                        </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                        {toPaymentDetailInfo?.map((row, id) => {
                                                                                                const findRateInfo = rateInfo.current.find(
                                                                                                        (i) =>
                                                                                                                i.BillDetailID === row.BillDetailID &&
                                                                                                                i.BillMasterID === row.BillMasterID
                                                                                                );
                                                                                                return (
                                                                                                        <TableRow
                                                                                                                key={row.BillingNo + id}
                                                                                                                sx={{
                                                                                                                        '&:last-child td, &:last-child th': {
                                                                                                                                border: 0
                                                                                                                        }
                                                                                                                }}
                                                                                                        >
                                                                                                                <TableCell align="center">{row?.BillingNo}</TableCell>
                                                                                                                <TableCell align="center">{row.FeeItem}</TableCell>
                                                                                                                <TableCell align="center">{row.PartyName}</TableCell>
                                                                                                                {/* 應收金額 */}
                                                                                                                <TableCell align="center">
                                                                                                                        {handleNumber(row.FeeAmount)} {codeInfo.fromCode}
                                                                                                                </TableCell>
                                                                                                                {/* 已實收金額 */}
                                                                                                                <TableCell align="center">
                                                                                                                        {handleNumber(row.ReceivedAmount)} {codeInfo.fromCode}
                                                                                                                </TableCell>
                                                                                                                {/* 原幣已換匯累計金額 */}
                                                                                                                <TableCell align="center">
                                                                                                                        {handleNumber(row.ExgOriReceivedAmount)} {codeInfo.fromCode}
                                                                                                                </TableCell>
                                                                                                                {/* 待換匯金額 */}
                                                                                                                <TableCell align="center">
                                                                                                                        {handleNumber(row.ToExgAmount)} {codeInfo.fromCode}
                                                                                                                </TableCell>
                                                                                                                {/* 換匯後已實收金額 */}
                                                                                                                <TableCell align="center">
                                                                                                                        {handleNumber(row.ExgReceivedAmount)} {codeInfo.payCode}
                                                                                                                </TableCell>
                                                                                                                {/* 換匯匯差 */}
                                                                                                                <TableCell align="center">
                                                                                                                        {handleNumber(row.ExgDiffAmount)} {codeInfo.payCode}
                                                                                                                </TableCell>
                                                                                                                <TableCell align="center">
                                                                                                                        <TextField
                                                                                                                                size="small"
                                                                                                                                disabled={row.ToExgAmount === 0}
                                                                                                                                value={findRateInfo?.Purpose || ''}
                                                                                                                                InputProps={{
                                                                                                                                        readOnly: true,
                                                                                                                                        onClick: () => handleRateDialogOpen(row)
                                                                                                                                }}
                                                                                                                        />
                                                                                                                </TableCell>
                                                                                                                {/* 此次付款金額 */}
                                                                                                                <TableCell align="center">
                                                                                                                        <Button
                                                                                                                                sx={{ mr: '0.05rem' }}
                                                                                                                                variant="contained"
                                                                                                                                disabled={row.ToExgAmount === 0}
                                                                                                                                onClick={() => {
                                                                                                                                        sendInfo(row);
                                                                                                                                        // handleSaveEdit();
                                                                                                                                        feeAmountTotal.current = 0;
                                                                                                                                        receivedAmountTotal.current = 0;
                                                                                                                                        exgOriReceivedAmount.current = 0;
                                                                                                                                        toExgAmount.current = 0;
                                                                                                                                        exgReceivedAmount.current = 0;
                                                                                                                                        exgDiffAmount.current = 0;
                                                                                                                                }}
                                                                                                                        >
                                                                                                                                換匯
                                                                                                                        </Button>
                                                                                                                </TableCell>
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
                                                                                                <StyledTableCell className="totalAmount" align="center">
                                                                                                        Total
                                                                                                </StyledTableCell>
                                                                                                <StyledTableCell className="totalAmount" align="center" />
                                                                                                <StyledTableCell className="totalAmount" align="center" />
                                                                                                <StyledTableCell className="totalAmount" align="center">
                                                                                                        {handleNumber(feeAmountTotal.current)} {codeInfo.fromCode}
                                                                                                </StyledTableCell>
                                                                                                <StyledTableCell className="totalAmount" align="center">
                                                                                                        {handleNumber(receivedAmountTotal.current)} {codeInfo.fromCode}
                                                                                                </StyledTableCell>
                                                                                                <StyledTableCell className="totalAmount" align="center">
                                                                                                        {handleNumber(exgOriReceivedAmount.current)} {codeInfo.fromCode}
                                                                                                </StyledTableCell>
                                                                                                <StyledTableCell className="totalAmount" align="center">
                                                                                                        {handleNumber(toExgAmount.current)} {codeInfo.fromCode}
                                                                                                </StyledTableCell>
                                                                                                <StyledTableCell className="totalAmount" align="center">
                                                                                                        {handleNumber(exgReceivedAmount.current)} {codeInfo.payCode}
                                                                                                </StyledTableCell>
                                                                                                <StyledTableCell className="totalAmount" align="center">
                                                                                                        {handleNumber(exgDiffAmount.current)} {codeInfo.payCode}
                                                                                                </StyledTableCell>
                                                                                                <StyledTableCell className="totalAmount" align="center" />
                                                                                                <StyledTableCell className="totalAmount" align="center" />
                                                                                        </TableRow>
                                                                                </TableBody>
                                                                        </Table>
                                                                </TableContainer>
                                                        </MainCard>
                                                </Grid>
                                        </Grid>
                                </DialogContent>
                                <DialogActions>
                                        {actionName === 'toPayment' ? (
                                                <>
                                                        <Button
                                                                sx={{ mr: '0.05rem' }}
                                                                variant="contained"
                                                                onClick={() => {
                                                                        // handleSaveEdit();
                                                                        initData();
                                                                }}
                                                        >
                                                                儲存
                                                        </Button>
                                                        <Button
                                                                sx={{ mr: '0.05rem' }}
                                                                variant="contained"
                                                                onClick={() => {
                                                                        handleDialogClose();
                                                                        handleTmpSaveEdit();
                                                                        initData();
                                                                }}
                                                        >
                                                                關閉
                                                        </Button>
                                                </>
                                        ) : (
                                                <Button
                                                        sx={{ mr: '0.05rem' }}
                                                        variant="contained"
                                                        onClick={() => {
                                                                handleDialogClose();
                                                                initData();
                                                        }}
                                                >
                                                        關閉
                                                </Button>
                                        )}
                                </DialogActions>
                        </Dialog>
                </>
        );
};

PaymentExchangeStart.propTypes = {
        actionName: PropTypes.string,
        invoiceNo: PropTypes.string,
        dueDate: PropTypes.string,
        editPaymentInfo: PropTypes.array,
        savePaymentEdit: PropTypes.func,
        handleDialogClose: PropTypes.func,
        isDialogOpen: PropTypes.bool
};

export default PaymentExchangeStart;
