import { useState, useRef, useEffect } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
import Decimal from 'decimal.js';
// material-ui
import { Button, Table, Dialog, DialogContent, Grid, DialogActions, Box } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

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

const BillDetail = ({ isDetailOpen, isDetailClose, modifyItem, codeType }) => {
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
                feeAmount.current = new Decimal(feeAmount.current).add(new Decimal(row1.FeeAmount));
            });
            setDataList(tmpData);
        }
    }, [isDetailOpen]);

    return (
        <Dialog maxWidth="sm" open={isDetailOpen}>
            <BootstrapDialogTitle>發票列表</BootstrapDialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box display="flex" justifyContent="end" sx={{ fontSize: '1rem' }}>
                            幣別：{codeType}
                        </Box>
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table sx={{ minWidth: 300 }} stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">NO</StyledTableCell>
                                        <StyledTableCell align="center">費用項目</StyledTableCell>
                                        <StyledTableCell align="center">計帳段號</StyledTableCell>
                                        <StyledTableCell align="center">費用金額</StyledTableCell>
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
                                                <TableCell align="center">{row.FeeItem}</TableCell>
                                                <TableCell align="center">
                                                    {row.BillMilestone}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {handleNumber(row.FeeAmount)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <StyledTableCell className="totalAmount" align="center">
                                            Total
                                        </StyledTableCell>
                                        <StyledTableCell className="totalAmount"></StyledTableCell>
                                        <StyledTableCell className="totalAmount"></StyledTableCell>
                                        <StyledTableCell className="totalAmount" align="center">
                                            {handleNumber(feeAmount.current)}
                                        </StyledTableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                {/* <DialogContentText sx={{ fontSize: '20px', mt: '0.5rem' }}>總金額：${handleNumber(totalAmount)}</DialogContentText> */}
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

export default BillDetail;

BillDetail.propTypes = {
    actionName: PropTypes.string,
    invoiceNo: PropTypes.string,
    dueDate: PropTypes.string,
    editPaymentInfo: PropTypes.array,
    savePaymentEdit: PropTypes.func,
    handleDialogClose: PropTypes.func,
    isDetailOpen: PropTypes.bool,
};
