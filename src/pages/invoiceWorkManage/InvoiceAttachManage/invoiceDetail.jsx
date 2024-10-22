import { useState, useRef, useEffect } from 'react';
import React from 'react';
import Decimal from 'decimal.js';
// project import
import { handleNumber, BootstrapDialogTitle } from 'components/commonFunction';
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

const InvoiceDetail = ({ toCodeType, isDetailOpen, isDetailClose, modifyItem }) => {
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
                feeAmount.current = new Decimal(feeAmount.current)
                    .add(new Decimal(row1.FeeAmount))
                    .toNumber();
            });
            setDataList(tmpData);
        }
    }, [isDetailOpen]);

    return (
        <Dialog maxWidth="md" open={isDetailOpen}>
            <BootstrapDialogTitle>發票明細</BootstrapDialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box display="flex" justifyContent="end">
                            幣別：{toCodeType}
                        </Box>
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table sx={{ minWidth: 300 }} stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">費用項目</StyledTableCell>
                                        <StyledTableCell align="center">計帳段號</StyledTableCell>
                                        <StyledTableCell align="center">費用金額</StyledTableCell>
                                        <StyledTableCell align="center">摘要說明</StyledTableCell>
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
                                                <TableCell align="center">{row.FeeItem}</TableCell>
                                                <TableCell align="center">
                                                    {row.BillMilestone}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {handleNumber(row.FeeAmount)}
                                                </TableCell>
                                                <StyledTableCell align="center">
                                                    {row.Note}
                                                </StyledTableCell>
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
                                        <StyledTableCell className="totalAmount">
                                            {handleNumber(feeAmount.current)}
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

export default InvoiceDetail;
