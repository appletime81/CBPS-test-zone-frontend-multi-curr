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
import {
    Typography,
    Button,
    Table,
    Dialog,
    DialogContent,
    Grid,
    DialogActions,
    TextField,
} from '@mui/material';
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
    [`&.${tableCellClasses.body}.totalAmount`]: {
        fontSize: 14,
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        backgroundColor: '#CFD8DC',
    },
}));

const PaymentExchangeStart = ({
    isDialogOpen,
    handleDialogClose,
    editPaymentInfo,
    actionName,
    dataList,
    invoiceWKMasterInfo,
    savePaymentEdit,
}) => {
    const dispatch = useDispatch();
    const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
    const [toPaymentDetailInfo, setToPaymentDetailInfo] = useState([]); //帳單明細檔
    const [rate, setRate] = useState('');
    const currencyExgList = useRef([]);
    const orgfeeAmountTotal = useRef(0); //應收金額
    const receivedAmountTotal = useRef(0); //已實收金額
    const paidAmountTotal = useRef(0); //已實付金額
    const toPaymentAmountTotal = useRef(0); //未付款金額
    const payAmountTotal = useRef(0); //此次付款金額

    const handleRateDialogOpen = (info) => {
        setIsRateDialogOpen(true);
        currencyExgList.current = info;
        // let tmpArray = toPaymentDetailInfo.map((i) => i);
        // tmpArray.forEach((i) => {
        //     if (i.BillMasterID === billMasterID && i.BillDetailID === billDetailID) {
        //         i.Note = note;
        //     }
        // });
        // setToPaymentDetailInfo(tmpArray);
    };

    const handleRateDialogClose = () => {
        setIsRateDialogOpen(false);
    };

    const changePayAmount = (payment, billMasterID, billDetailID) => {
        console.log(payment, typeof new Decimal(payment));
        payAmountTotal.current = 0;
        let tmpArray = toPaymentDetailInfo.map((i) => i);
        console.log('toPaymentDetailInfo=>>', toPaymentDetailInfo);
        tmpArray.forEach((i, index) => {
            if (i.BillMasterID === billMasterID && i.BillDetailID === billDetailID) {
                i.PayAmount = Number(payment);
            }
            console.log(
                'index=>>',
                index,
                payAmountTotal.current,
                i.PayAmount,
                i.ReceivedAmount,
                i.PaidAmount,
            );
            payAmountTotal.current = new Decimal(payAmountTotal.current)
                .add(
                    i.PayAmount
                        ? new Decimal(i.PayAmount)
                        : Number(i.ReceivedAmount - i.PaidAmount) > 0
                        ? new Decimal(i.ReceivedAmount).minus(new Decimal(i.PaidAmount))
                        : new Decimal(0),
                )
                .toNumber();
        });
        setToPaymentDetailInfo(tmpArray);
    };

    const handleSaveEdit = () => {
        let tmpArray = toPaymentDetailInfo.map((i) => i);
        tmpArray.forEach((i) => {
            i.PayAmount = i.PayAmount ? i.PayAmount : Number(i.ReceivedAmount - i.PaidAmount);
        });
        savePaymentEdit(tmpArray);
    };

    const handleTmpSaveEdit = () => {
        savePaymentEdit(editPaymentInfo);
    };

    const sendInfo = () => {
        if (payAmountTotal.current + paidAmountTotal.current > receivedAmountTotal.current) {
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'info',
                        message: `已實付金額+此次付款金額超出已實收金額${handleNumber(
                            new Decimal(payAmountTotal.current)
                                .add(new Decimal(paidAmountTotal.current))
                                .minus(new Decimal(receivedAmountTotal.current)),
                        )}`,
                    },
                }),
            );
        }
    };

    // useEffect(() => {
    //     let tmpArray = JSON.parse(JSON.stringify(editPaymentInfo));
    //     tmpArray.forEach((i) => {
    //         orgfeeAmountTotal.current = new Decimal(orgfeeAmountTotal.current).add(
    //             new Decimal(i.OrgFeeAmount),
    //         );
    //         receivedAmountTotal.current = new Decimal(receivedAmountTotal.current).add(
    //             new Decimal(i.ReceivedAmount),
    //         );
    //         paidAmountTotal.current = new Decimal(paidAmountTotal.current).add(
    //             new Decimal(i.PaidAmount),
    //         );
    //         toPaymentAmountTotal.current = new Decimal(toPaymentAmountTotal.current).add(
    //             i.OrgFeeAmount - i.PaidAmount > 0
    //                 ? new Decimal(i.OrgFeeAmount).minus(new Decimal(i.PaidAmount))
    //                 : 0,
    //         );
    //         payAmountTotal.current = new Decimal(payAmountTotal.current).add(
    //             i.PayAmount
    //                 ? i.PayAmount
    //                 : new Decimal(i.ReceivedAmount).minus(new Decimal(i.PaidAmount)),
    //         );
    //     });
    //     if (isDialogOpen) {
    //         setToPaymentDetailInfo(tmpArray);
    //     }
    // }, [isDialogOpen]);

    console.log('dataList=>>', dataList);
    console.log('invoiceWKMasterInfo=>>', invoiceWKMasterInfo);
    console.log('isRateDialogOpen=>>', isRateDialogOpen);

    return (
        <>
            <ChoseRate
                isRateDialogOpen={isRateDialogOpen}
                handleRateDialogClose={handleRateDialogClose}
                currencyExgList={currencyExgList.current}
                // submarineCable={submarineCable}
                // workTitle={workTitle}
                // fromCode={fromCode}
                // codeList={codeList}
                // currencyExgID={currencyExgID}
                // setCurrencyExgID={setCurrencyExgID}
                // rateInfo={rateInfo}
            />
            <Dialog maxWidth="xxl" open={isDialogOpen}>
                <BootstrapDialogTitle>
                    {/* {actionName === 'toPayment' ? '收款明細與編輯付款資訊' : '收款明細與付款資訊'} */}
                    會員收款換匯作業
                </BootstrapDialogTitle>
                <DialogContent>
                    <Grid
                        container
                        spacing={1}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ fontSize: 10 }}
                    >
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Grid
                                container
                                spacing={1}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ fontSize: 10 }}
                            >
                                <Grid item sm={2} md={2} lg={2}>
                                    <Typography
                                        variant="h5"
                                        align="center"
                                        sx={{
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                        }}
                                    >
                                        發票號碼：
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                    <TextField
                                        value={invoiceWKMasterInfo.InvoiceNo}
                                        fullWidth
                                        readyOnly
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
                                            ml: { lg: '0.5rem', xl: '1.5rem' },
                                        }}
                                    >
                                        發票到期日：
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                    <TextField
                                        value={dayjs(invoiceWKMasterInfo.DueDate).format(
                                            'YYYY/MM/DD',
                                        )}
                                        fullWidth
                                        readyOnly
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
                                            ml: { lg: '0.5rem', xl: '1.5rem' },
                                        }}
                                    >
                                        發票匯率資料：
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                    <TextField
                                        value={invoiceWKMasterInfo.Purpose}
                                        fullWidth
                                        readyOnly
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <MainCard title="帳單明細列表">
                                <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                    <Table
                                        sx={{ minWidth: 300 }}
                                        stickyHeader
                                        aria-label="sticky table"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center">
                                                    帳單號碼
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    費用項目
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    會員
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    應收金額
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    已實收金額
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    原幣已換匯累計金額
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    待換匯金額
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    換匯後已實收金額
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    換匯匯差
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    匯率資料
                                                </StyledTableCell>
                                                {/* {actionName === 'toPayment' ? ( */}
                                                <StyledTableCell align="center">
                                                    Action
                                                </StyledTableCell>
                                                {/* ) : null} */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dataList?.map((row) => {
                                                console.log(
                                                    'row=>>',
                                                    row.PayAmount === 0,
                                                    row.PayAmount === -0,
                                                    row.ReceivedAmount,
                                                    row.PaidAmount,
                                                );
                                                return (
                                                    <TableRow
                                                        key={
                                                            row.InvoiceNo +
                                                            row?.BillMasterID +
                                                            row?.BillDetailID
                                                        }
                                                        sx={{
                                                            '&:last-child td, &:last-child th': {
                                                                border: 0,
                                                            },
                                                        }}
                                                    >
                                                        <TableCell align="center">
                                                            {row?.BillingNo}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.FeeItem}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.PartyName}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {row.FeeAmount}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {handleNumber(row.ReceivedAmount)}
                                                        </TableCell>
                                                        {/* 已實收金額 */}
                                                        <TableCell align="center">
                                                            {handleNumber(row.ExgOriReceivedAmount)}
                                                        </TableCell>
                                                        {/* 已實付金額 */}
                                                        <TableCell align="center">
                                                            {handleNumber(row.ToExgAmount)}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {handleNumber(row.ExgReceivedAmount)}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {handleNumber(row.ExgDiffAmount)}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                size="small"
                                                                value={rate || ''}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                    onClick: () =>
                                                                        handleRateDialogOpen(
                                                                            row.CurrencyExgList,
                                                                        ),
                                                                }}
                                                            />
                                                        </TableCell>

                                                        {/* 此次付款金額 */}
                                                        {/* {actionName === 'toPayment' ? ( */}
                                                        <TableCell align="center">
                                                            <TextField
                                                                size="small"
                                                                inputProps={{ step: '.000001' }}
                                                                sx={{ minWidth: 75 }}
                                                                InputProps={{
                                                                    inputComponent:
                                                                        NumericFormatCustom,
                                                                }}
                                                                value={
                                                                    row.PayAmount ||
                                                                    row.PayAmount === 0
                                                                        ? row.PayAmount
                                                                        : new Decimal(
                                                                              row.ReceivedAmount,
                                                                          )
                                                                              .minus(
                                                                                  new Decimal(
                                                                                      row.PaidAmount,
                                                                                  ),
                                                                              )
                                                                              .toNumber()
                                                                }
                                                                // type="number"
                                                                onChange={(e) => {
                                                                    changePayAmount(
                                                                        e.target.value,
                                                                        row.BillMasterID,
                                                                        row.BillDetailID,
                                                                    );
                                                                }}
                                                            />
                                                        </TableCell>
                                                        {/* ) : null} */}
                                                    </TableRow>
                                                );
                                            })}
                                            <TableRow
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                >
                                                    Total
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                />
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                />
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                />
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                >
                                                    {handleNumber(orgfeeAmountTotal.current)}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                >
                                                    {handleNumber(receivedAmountTotal.current)}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                >
                                                    {handleNumber(paidAmountTotal.current)}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                >
                                                    {handleNumber(toPaymentAmountTotal.current)}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    className="totalAmount"
                                                    align="center"
                                                />
                                                {actionName === 'toPayment' ? (
                                                    <StyledTableCell
                                                        className="totalAmount"
                                                        align="center"
                                                    >
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
                                    orgfeeAmountTotal.current = 0;
                                    receivedAmountTotal.current = 0;
                                    paidAmountTotal.current = 0;
                                    toPaymentAmountTotal.current = 0;
                                    payAmountTotal.current = 0;
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
                                    orgfeeAmountTotal.current = 0;
                                    receivedAmountTotal.current = 0;
                                    paidAmountTotal.current = 0;
                                    toPaymentAmountTotal.current = 0;
                                    payAmountTotal.current = 0;
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
                                orgfeeAmountTotal.current = 0;
                                receivedAmountTotal.current = 0;
                                paidAmountTotal.current = 0;
                                toPaymentAmountTotal.current = 0;
                                payAmountTotal.current = 0;
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
    isDialogOpen: PropTypes.bool,
};

export default PaymentExchangeStart;
