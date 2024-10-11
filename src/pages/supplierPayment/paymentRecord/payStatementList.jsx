import { useState, useRef, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
// material-ui
import { Button, Table, Dialog, DialogContent, Grid, DialogActions } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs';

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

const PayStatementList = ({ isDetailOpen, isDetailClose, modifyItem }) => {
    let feeAmount = useRef(0); // 總費用金額加總(上)
    const [dataList, setDataList] = useState([]);

    const initData = () => {
        feeAmount.current = 0;
        setDataList([]);
    };

    useEffect(() => {
        if (isDetailOpen) {
            let tmpData = modifyItem.map((i) => i);
            tmpData.forEach((row1) => {
                feeAmount.current = feeAmount.current + row1.FeeAmount;
            });
            setDataList(tmpData);
        }
    }, [isDetailOpen]);

    return (
        <Dialog maxWidth="xxl" open={isDetailOpen}>
            <BootstrapDialogTitle>付款紀錄明細</BootstrapDialogTitle>
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
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table sx={{ minWidth: 300 }} stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">NO</StyledTableCell>
                                        <StyledTableCell align="center">發票號碼</StyledTableCell>
                                        <StyledTableCell align="center">
                                            此次應付金額
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            此次付款金額
                                        </StyledTableCell>
                                        <StyledTableCell align="center">付款日期</StyledTableCell>
                                        <StyledTableCell align="center">摘要說明</StyledTableCell>
                                        <StyledTableCell align="center">
                                            此次付款狀態
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataList.map((row, id) => {
                                        return (
                                            <TableRow
                                                key={row.BillMasterID + row?.BillDetailID + id}
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <TableCell align="center">{id + 1}</TableCell>
                                                <TableCell align="center">
                                                    {row.InvoiceNo}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {handleNumber(row?.FeeAmount)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {handleNumber(row?.FeeAmount)}
                                                </TableCell>
                                                <StyledTableCell align="center">
                                                    {dayjs(row?.PaidDate).format('YYYY/MM/DD')}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.Note}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.state}
                                                </StyledTableCell>
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
                <Button
                    sx={{ mr: '0.05rem' }}
                    variant="contained"
                    onClick={() => {
                        initData();
                        isDetailClose();
                    }}
                >
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PayStatementList;

PayStatementList.propTypes = {
    // actionName: React.String,
    // invoiceNo: React.String,
    // dueDate: PropTypes.instanceOf(Date),
    // editPaymentInfo: React.Array,
    // savePaymentEdit: React.func,
    // handleDialogClose: React.func,
    isDetailOpen: PropTypes.bool,
};

// isDetailOpen, isDetailClose, modifyItem
