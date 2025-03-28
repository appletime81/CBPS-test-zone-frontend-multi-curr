import { useState, useRef, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import Decimal from 'decimal.js';
import MainCard from 'components/MainCard';
import NumericFormatCustom from 'components/numericFormatCustom';
// material-ui
import { Typography, Button, Table, Dialog, DialogContent, Grid, DialogActions, TextField } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs';

// redux
import { useDispatch } from 'react-redux';
import { setMessageStateOpen } from 'store/reducers/dropdown';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
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

const PaymentWork = ({ isDialogOpen, handleDialogClose, editPaymentInfo, actionName, invoiceNo, dueDate, savePaymentEdit }) => {
    const dispatch = useDispatch();
    const [toPaymentDetailInfo, setToPaymentDetailInfo] = useState([]); //帳單明細檔
    const exgReceivedAmountTotal = useRef(new Decimal(0)); //應收金額
    const receivedAmountTotal = useRef(new Decimal(0)); //已實收金額
    const paidAmountTotal = useRef(new Decimal(0)); //已實付金額
    const toPaymentAmountTotal = useRef(new Decimal(0)); //未付款金額
    const payAmountTotal = useRef(new Decimal(0)); //此次付款金額

    const initTotal = () => {
        exgReceivedAmountTotal.current = new Decimal(0);
        receivedAmountTotal.current = new Decimal(0);
        paidAmountTotal.current = new Decimal(0);
        toPaymentAmountTotal.current = new Decimal(0);
        payAmountTotal.current = new Decimal(0);
    };

    const changeNote = (note, billMasterID, billDetailID) => {
        setToPaymentDetailInfo((prev) => prev.map((i) => (i.BillMasterID === billMasterID && i.BillDetailID === billDetailID ? { ...i, Note: note } : i)));
    };

    const changePayAmount = (payment, billMasterID, billDetailID) => {
        setToPaymentDetailInfo((prev) => {
            let newPayAmountTotal = new Decimal(0);
            console.log('prev=>>', prev);
            const updatedInfo = prev.map((i) => {
                console.log('i.PayAmount=>>', i.PayAmount);
                let newPayAmount = i.PayAmount;
                if (i.BillMasterID === billMasterID && i.BillDetailID === billDetailID) {
                    newPayAmount = Number(payment);
                }

                // defaultPayment為「換匯後已實收金額」-「已實付金額」若大於「未付款金額」，顯示toPayment，否則顯示「換匯後已實收金額」-「已實付金額」
                const remainingAmount = new Decimal(i.ExgReceivedAmount).minus(new Decimal(i.PaidAmount));
                const defaultPayment = Decimal.min(remainingAmount, new Decimal(i.UnPaidAmount));
                // 原手動加總
                // const remainingAmount = new Decimal(i.ReceivedAmount).minus(new Decimal(i.PaidAmount));
                // const payAmount = newPayAmount ? new Decimal(newPayAmount) : Decimal.max(remainingAmount, 0);
                newPayAmountTotal = newPayAmountTotal.plus(newPayAmount ?? defaultPayment);
                return { ...i, PayAmount: newPayAmount };
            });
            payAmountTotal.current = newPayAmountTotal;
            return updatedInfo;
        });
    };
    // const changePayAmount = (payment, billMasterID, billDetailID) => {
    //     payAmountTotal.current = 0;
    //     let tmpArray = toPaymentDetailInfo.map((i) => i);
    //     tmpArray.forEach((i) => {
    //         if (i.BillMasterID === billMasterID && i.BillDetailID === billDetailID) {
    //             i.PayAmount = Number(payment);
    //         }
    //         payAmountTotal.current = new Decimal(payAmountTotal.current)
    //             .add(
    //                 i.PayAmount
    //                     ? new Decimal(i.PayAmount)
    //                     : Number(i.ReceivedAmount - i.PaidAmount) > 0
    //                     ? new Decimal(i.ReceivedAmount).minus(new Decimal(i.PaidAmount))
    //                     : new Decimal(0)
    //             )
    //             .toNumber();
    //     });
    //     setToPaymentDetailInfo(tmpArray);
    // };

    const handleSaveEdit = () => {
        let tmpArray = toPaymentDetailInfo.map((i) => i);
        tmpArray.map((i) => (i.PayAmount = i.PayAmount ?? new Decimal(i.ExgReceivedAmount).minus(new Decimal(i.PaidAmount)).toNumber()));
        savePaymentEdit(tmpArray);
    };

    const handleTmpSaveEdit = () => {
        savePaymentEdit(editPaymentInfo);
    };

    const sendInfo = () => {
        console.log(
            'payAmountTotal.current=>>',
            payAmountTotal.current + paidAmountTotal.current > receivedAmountTotal.current,
            payAmountTotal.current.add(paidAmountTotal.current).gt(receivedAmountTotal.current)
        );
        if (payAmountTotal.current.add(paidAmountTotal.current).gt(receivedAmountTotal.current)) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'info',
                        message: `已實付金額+此次付款金額超出已實收金額${handleNumber(
                            new Decimal(payAmountTotal.current).add(new Decimal(paidAmountTotal.current)).minus(new Decimal(receivedAmountTotal.current)).toNumber()
                        )}`
                    }
                })
            );
        }
    };

    useEffect(() => {
        if (!isDialogOpen) return;
        const updatedPaymentInfo = editPaymentInfo.map((i) => {
            // let toPayment = new Decimal(row.FeeAmount / exgRate).minus(new Decimal(row.PaidAmount)).toNumber();
            const receivedAmount = new Decimal(i.ReceivedAmount || 0);
            const exgReceivedAmount = new Decimal(i.ExgReceivedAmount || 0);
            const paidAmount = new Decimal(i.PaidAmount || 0);
            // const feeAmountExg = new Decimal(i.FeeAmount || 0).dividedBy(exgRate); //「換匯後已實收金額」

            receivedAmountTotal.current = receivedAmountTotal.current.plus(receivedAmount);
            exgReceivedAmountTotal.current = exgReceivedAmountTotal.current.plus(exgReceivedAmount);
            paidAmountTotal.current = paidAmountTotal.current.plus(paidAmount);

            // const toPayDifference = Decimal.max(feeAmountExg.minus(paidAmount), 0);
            // toPaymentAmountTotal.current = toPaymentAmountTotal.current.plus(toPayDifference);
            toPaymentAmountTotal.current = toPaymentAmountTotal.current.plus(i.UnPaidAmount);

            //「換匯後已實收金額」-「已實付金額」若大於「未付款金額」，顯示toPayment，否則顯示「換匯後已實收金額」-「已實付金額」
            const payAmount = i.PayAmount ? new Decimal(i.PayAmount) : Decimal.min(exgReceivedAmount.minus(paidAmount), i.UnPaidAmount);

            payAmountTotal.current = payAmountTotal.current.plus(payAmount);

            return { ...i, PayAmount: payAmount.toNumber() };
        });
        setToPaymentDetailInfo(updatedPaymentInfo);
    }, [isDialogOpen]);

    console.log('editPaymentInfo=>>', editPaymentInfo);
    console.log('toPaymentDetailInfo=>>', toPaymentDetailInfo);

    return (
        <Dialog maxWidth="xxl" open={isDialogOpen}>
            <BootstrapDialogTitle>{actionName === 'toPayment' ? '收款明細與編輯付款資訊' : '收款明細與付款資訊'}</BootstrapDialogTitle>
            <DialogContent>
                <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                            <Grid item sm={1} md={1} lg={1}>
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
                            <Grid item xs={2} sm={2} md={2} lg={2}>
                                <TextField
                                    value={invoiceNo}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} lg={2}>
                                <Typography
                                    variant="h5"
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
                                    value={dayjs(dueDate).format('YYYY/MM/DD')}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={5} sm={5} md={5} lg={5} />
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
                                            <StyledTableCell align="center">計帳段號</StyledTableCell>
                                            <StyledTableCell align="center">會員</StyledTableCell>
                                            <StyledTableCell align="center">已實收金額</StyledTableCell>
                                            <StyledTableCell align="center">換匯後已實收金額</StyledTableCell>
                                            <StyledTableCell align="center">已實付金額</StyledTableCell>
                                            <StyledTableCell align="center">未付款金額</StyledTableCell>
                                            <StyledTableCell align="center">摘要說明</StyledTableCell>
                                            {actionName === 'toPayment' ? <StyledTableCell align="center">此次付款金額</StyledTableCell> : null}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {toPaymentDetailInfo?.map((row, id) => {
                                            // 未付款金額(20250214，康迪表示直接抓key為"UnPaidAmount")
                                            // let toPayment = new Decimal(row.FeeAmount / exgRate).minus(new Decimal(row.PaidAmount)).toNumber();
                                            //「換匯後已實收金額」-「已實付金額」若大於「未付款金額」，顯示toPayment(UnPaidAmount)，否則顯示「換匯後已實收金額」-「已實付金額」
                                            let defaultPayment =
                                                row.ExgReceivedAmount - row.PaidAmount > row.UnPaidAmount
                                                    ? row.UnPaidAmount
                                                    : new Decimal(row.ExgReceivedAmount).minus(new Decimal(row.PaidAmount)).toNumber();
                                            return (
                                                <TableRow
                                                    key={row.BillingNo + row?.FeeItem + row?.BillMilestone + id}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 0
                                                        }
                                                    }}
                                                >
                                                    <TableCell align="center">{row?.BillingNo}</TableCell>
                                                    <TableCell align="center">{row.FeeItem}</TableCell>
                                                    <TableCell align="center">{row.BillMilestone}</TableCell>
                                                    <TableCell align="center">{row.PartyName}</TableCell>
                                                    {/* 已實收金額 */}
                                                    <TableCell align="center">
                                                        {handleNumber(row.ReceivedAmount)} {row.Code}
                                                    </TableCell>
                                                    {/* 換匯後已實收金額 */}
                                                    <TableCell align="center">
                                                        {handleNumber(row?.ExgReceivedAmount)} {row.PayCode}
                                                    </TableCell>
                                                    {/* 已實付金額 */}
                                                    <TableCell align="center">
                                                        {handleNumber(row.PaidAmount)} {row.PayCode}
                                                    </TableCell>
                                                    {/* 未付款金額 */}
                                                    <TableCell align="center">
                                                        {/* {toPayment > 0 ? handleNumber(toPayment) : 0} {row.PayCode} */}
                                                        {handleNumber(row.UnPaidAmount) ?? 0}
                                                    </TableCell>
                                                    {actionName === 'toPayment' ? (
                                                        <TableCell align="center">
                                                            <TextField
                                                                size="small"
                                                                sx={{ minWidth: 75 }}
                                                                value={row.Note}
                                                                onChange={(e) => {
                                                                    changeNote(e.target.value, row.BillMasterID, row.BillDetailID);
                                                                }}
                                                            />
                                                        </TableCell>
                                                    ) : (
                                                        <TableCell align="center">
                                                            <TableCell align="center">{row.Note}</TableCell>
                                                        </TableCell>
                                                    )}
                                                    {/* 此次付款金額 */}
                                                    {actionName === 'toPayment' ? (
                                                        <TableCell align="center">
                                                            <TextField
                                                                size="small"
                                                                inputProps={{ step: '.000001' }}
                                                                sx={{ minWidth: 75 }}
                                                                label={row.PayCode}
                                                                InputProps={{
                                                                    inputComponent: NumericFormatCustom,
                                                                    // 使用者輸入的「此次付款金額」若大於「未付款金額」則顯示紅色
                                                                    style: { color: row.PayAmount > row.UnPaidAmount ? 'red' : 'black' }
                                                                }}
                                                                disabled={row.UnPaidAmount <= 0}
                                                                value={row.PayAmount ?? defaultPayment}
                                                                onChange={(e) => {
                                                                    changePayAmount(e.target.value, row.BillMasterID, row.BillDetailID);
                                                                }}
                                                            />
                                                        </TableCell>
                                                    ) : null}
                                                </TableRow>
                                            );
                                        })}
                                        <TableRow
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <StyledTableCell className="totalAmount" align="center">
                                                Total
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center" />
                                            <StyledTableCell className="totalAmount" align="center" />
                                            <StyledTableCell className="totalAmount" align="center" />
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(receivedAmountTotal.current)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(exgReceivedAmountTotal.current)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(paidAmountTotal.current)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(toPaymentAmountTotal.current)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center" />
                                            {actionName === 'toPayment' ? (
                                                <StyledTableCell className="totalAmount" align="center">
                                                    {handleNumber(payAmountTotal.current)}
                                                </StyledTableCell>
                                            ) : null}
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
                                sendInfo();
                                handleSaveEdit();
                                initTotal();
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
                                initTotal();
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
                            initTotal();
                        }}
                    >
                        關閉
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

PaymentWork.propTypes = {
    actionName: PropTypes.string,
    invoiceNo: PropTypes.string,
    dueDate: PropTypes.string,
    editPaymentInfo: PropTypes.array,
    savePaymentEdit: PropTypes.func,
    handleDialogClose: PropTypes.func,
    isDialogOpen: PropTypes.bool
};

export default PaymentWork;
