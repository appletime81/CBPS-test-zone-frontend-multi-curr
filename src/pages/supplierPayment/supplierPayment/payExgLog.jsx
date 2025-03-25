import { useState, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
// material-ui
import { Typography, Button, Table, Dialog, DialogContent, Grid, DialogActions, TextField } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { getPayExgLog } from 'components/apis.jsx';
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

const PayExgLog = ({ isDialogOpen, handleDialogClose, invoiceWKMasterInfo }) => {
    const dispatch = useDispatch();
    const [payExgLogList, setPayExgLogList] = useState([]); //帳單明細檔
    const [totalAmount, setTotalAmount] = useState({
        OriAmountTotal: 0,
        ExgAmountTotal: 0,
        ExgDiffAmountTotal: 0
    });

    const getPayExgLogList = async () => {
        if (!invoiceWKMasterInfo.InvoiceNo) return;
        try {
            const response = await fetch(getPayExgLog, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`
                },
                body: JSON.stringify({ InvoiceNo: invoiceWKMasterInfo.InvoiceNo })
            });
            const data = await response.json();
            const list = Array.isArray(data) ? data : [];
            setPayExgLogList(list);
            const totals = list.reduce(
                (acc, row) => {
                    acc.OriAmountTotal += Number(row.OriAmount) || 0;
                    acc.ExgAmountTotal += Number(row.ExgAmount) || 0;
                    acc.ExgDiffAmountTotal += Number(row.ExgDiffAmount) || 0;
                    return acc;
                },
                {
                    OriAmountTotal: 0,
                    ExgAmountTotal: 0,
                    ExgDiffAmountTotal: 0
                }
            );
            setTotalAmount(totals);
        } catch (error) {
            setPayExgLogList([]);
            dispatch(
                setMessageStateOpen({
                    messageStateOpen: {
                        isOpen: true,
                        severity: 'error',
                        message: '網路異常，請檢查網路連線或與系統窗口聯絡'
                    }
                })
            );
        }
    };

    useEffect(() => {
        if (isDialogOpen) getPayExgLogList();
    }, [isDialogOpen]);

    return (
        <>
            <Dialog maxWidth="xxl" open={isDialogOpen}>
                <BootstrapDialogTitle>檢視換匯紀錄</BootstrapDialogTitle>
                <DialogContent>
                    <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Grid container spacing={1} display="flex" justifyContent="center" alignItems="center" sx={{ fontSize: 10 }}>
                                <Grid item sm={1} md={1} lg={1}>
                                    <Typography
                                        variant="h5"
                                        align="end"
                                        sx={{
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' }
                                        }}
                                    >
                                        供應商：
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                    <TextField
                                        value={invoiceWKMasterInfo.SupplierName}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={1} sm={1} md={1} lg={1}>
                                    <Typography
                                        variant="h5"
                                        align="end"
                                        sx={{
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                            ml: { lg: '0.5rem', xl: '1.5rem' }
                                        }}
                                    >
                                        海纜名稱：
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                    <TextField
                                        value={invoiceWKMasterInfo.SubmarineCable}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true
                                        }}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={1} sm={1} md={1} lg={1}>
                                    <Typography
                                        variant="h5"
                                        align="end"
                                        sx={{
                                            fontSize: { lg: '0.7rem', xl: '0.88rem' },
                                            ml: { lg: '0.5rem', xl: '1.5rem' }
                                        }}
                                    >
                                        海纜作業：
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                    <TextField
                                        value={invoiceWKMasterInfo.WorkTitle}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true
                                        }}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={3} sm={3} md={3} lg={3} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                <Table sx={{ minWidth: 300 }} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">發票號碼</StyledTableCell>
                                            <StyledTableCell align="center">收款金額</StyledTableCell>
                                            <StyledTableCell align="center">收款幣別</StyledTableCell>
                                            <StyledTableCell align="center">換匯後金額</StyledTableCell>
                                            <StyledTableCell align="center">換匯後幣別</StyledTableCell>
                                            <StyledTableCell align="center">換匯匯差金額</StyledTableCell>
                                            <StyledTableCell align="center">換匯時間</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {payExgLogList?.map((row, id) => {
                                            return (
                                                <TableRow
                                                    key={row.WKMasterID + id}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 0
                                                        }
                                                    }}
                                                >
                                                    <TableCell align="center">{row?.InvoiceNo}</TableCell>
                                                    <TableCell align="center">{handleNumber(row.OriAmount)}</TableCell>
                                                    <TableCell align="center">{row.Code}</TableCell>
                                                    <TableCell align="center">{handleNumber(row?.ExgAmount)}</TableCell>
                                                    <TableCell align="center">{row.ToCode}</TableCell>
                                                    <TableCell align="center">{handleNumber(row.ExgDiffAmount)}</TableCell>
                                                    <TableCell align="center">{dayjs(row.ExgDate).format('YYYY/MM/DD HH:mm:ss')}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        <TableRow>
                                            <StyledTableCell className="totalAmount" align="center">
                                                Total
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(totalAmount.OriAmountTotal)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount"></StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(totalAmount.ExgAmountTotal)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount"></StyledTableCell>
                                            <StyledTableCell className="totalAmount" align="center">
                                                {handleNumber(totalAmount.ExgDiffAmountTotal)}
                                            </StyledTableCell>
                                            <StyledTableCell className="totalAmount"></StyledTableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ mr: '0.05rem' }}
                        variant="contained"
                        onClick={() => {
                            handleDialogClose();
                        }}
                    >
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

PayExgLog.propTypes = {
    actionName: PropTypes.string,
    invoiceNo: PropTypes.string,
    dueDate: PropTypes.string,
    editPaymentInfo: PropTypes.array,
    savePaymentEdit: PropTypes.func,
    handleDialogClose: PropTypes.func,
    isDialogOpen: PropTypes.bool
};

export default PayExgLog;
